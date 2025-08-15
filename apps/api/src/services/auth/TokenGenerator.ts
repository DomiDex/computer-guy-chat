import { createHash } from 'crypto';

import type { User, PrismaClient } from '@prisma/client';
import type { SignOptions, VerifyOptions, JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';

export interface TokenPayload extends JwtPayload {
  sub: string;
  email: string;
  type: 'access' | 'refresh';
  jti: string;
  fingerprint?: string;
  sessionId?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
  refreshExpiresIn: number;
}

export interface GenerateTokenOptions {
  deviceId?: string;
  deviceName?: string;
  userAgent?: string;
  ipAddress?: string;
}

export class TokenGenerator {
  private readonly accessTokenExpiry = 15 * 60;
  private readonly refreshTokenExpiry = 7 * 24 * 60 * 60;
  private readonly issuer = 'cg-chatbot';
  private readonly audience = 'cg-customers';
  private readonly jwtSecret: string;
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters');
    }
    this.jwtSecret = secret;
    this.prisma = prisma;
  }

  async generateTokenPair(user: User, options: GenerateTokenOptions = {}): Promise<TokenPair> {
    const tokenFamily = nanoid(32);
    const sessionId = nanoid(24);
    const fingerprint = this.generateFingerprint(options);

    const accessTokenId = `at_${nanoid(24)}`;
    const accessToken = this.generateAccessToken(user, accessTokenId, sessionId, fingerprint);

    const refreshTokenId = `rt_${nanoid(24)}`;
    const refreshToken = await this.generateRefreshToken(
      user,
      refreshTokenId,
      tokenFamily,
      sessionId,
      fingerprint,
      options
    );

    await this.logTokenGeneration(user.id, options);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.accessTokenExpiry,
      refreshExpiresIn: this.refreshTokenExpiry,
      tokenType: 'Bearer',
    };
  }

  private generateAccessToken(
    user: User,
    tokenId: string,
    sessionId: string,
    fingerprint?: string
  ): string {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      type: 'access',
      jti: tokenId,
      ...(sessionId && { sessionId }),
      ...(fingerprint && { fingerprint }),
    };

    const options: SignOptions = {
      expiresIn: this.accessTokenExpiry,
      issuer: this.issuer,
      audience: this.audience,
      algorithm: 'HS256',
    };

    return jwt.sign(payload, this.jwtSecret, options);
  }

  private async generateRefreshToken(
    user: User,
    tokenId: string,
    tokenFamily: string,
    _sessionId: string,
    _fingerprint: string | undefined,
    options: GenerateTokenOptions
  ): Promise<string> {
    const token = `${tokenId}.${nanoid(64)}`;

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        token,
        tokenFamily,
        expiresAt: new Date(Date.now() + this.refreshTokenExpiry * 1000),
        deviceId: options.deviceId,
        deviceName: options.deviceName,
        userAgent: options.userAgent,
        ipAddress: options.ipAddress,
      },
    });

    return token;
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      const options: VerifyOptions = {
        issuer: this.issuer,
        audience: this.audience,
        algorithms: ['HS256'],
      };

      const payload = jwt.verify(token, this.jwtSecret, options) as TokenPayload;

      if (payload.type !== 'access') {
        throw new Error('Invalid token type');
      }

      return payload;
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  async refreshTokens(
    refreshToken: string,
    options: GenerateTokenOptions = {}
  ): Promise<TokenPair> {
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken) {
      throw new Error('Invalid refresh token');
    }

    if (storedToken.revokedAt) {
      await this.handleSuspiciousRefresh(storedToken.tokenFamily);
      throw new Error('Token has been revoked');
    }

    if (storedToken.expiresAt < new Date()) {
      throw new Error('Refresh token expired');
    }

    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date(), revokedReason: 'Token rotation' },
    });

    return this.generateTokenPair(storedToken.user, options);
  }

  async revokeToken(token: string, reason: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { token },
      data: { revokedAt: new Date(), revokedReason: reason },
    });
  }

  async revokeTokenFamily(tokenFamily: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { tokenFamily },
      data: {
        revokedAt: new Date(),
        revokedReason: 'Security: Token family compromised',
      },
    });
  }

  private generateFingerprint(options: GenerateTokenOptions): string {
    const data = `${options.deviceId || ''}:${options.userAgent || ''}:${options.ipAddress || ''}`;
    return createHash('sha256').update(data).digest('hex').substring(0, 16);
  }

  private async handleSuspiciousRefresh(tokenFamily: string): Promise<void> {
    await this.revokeTokenFamily(tokenFamily);
    console.error(`Suspicious refresh detected for token family: ${tokenFamily}`);
  }

  private async logTokenGeneration(userId: string, options: GenerateTokenOptions): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'token.generated',
        entity: 'auth',
        metadata: {
          deviceId: options.deviceId,
          deviceName: options.deviceName,
        },
        ipAddress: options.ipAddress,
        userAgent: options.userAgent,
        severity: 'info',
      },
    });
  }
}
