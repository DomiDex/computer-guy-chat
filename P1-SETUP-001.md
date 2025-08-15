# Task P1-SETUP-001: Initialize PNPM Monorepo with Turborepo Configuration

## Metadata
- **ID**: P1-SETUP-001
- **Priority**: CRITICAL
- **Estimated Time**: 1 hour
- **Dependencies**: None
- **Assignee**: DevOps Engineer

## Success Criteria
- [ ] PNPM workspace configured correctly
- [ ] Turborepo pipeline defined for build, test, and dev commands
- [ ] All workspace packages properly linked
- [ ] Scripts run without errors
- [ ] Git repository initialized with proper .gitignore

## Requirements

### Functional Requirements
- Initialize a monorepo structure using PNPM workspaces
- Configure Turborepo for efficient task execution
- Setup shared TypeScript configuration
- Define workspace packages structure
- Configure development scripts

### Non-Functional Requirements
- Build pipeline must complete in under 30 seconds
- Support parallel execution of tasks
- Enable incremental builds for faster development
- Support both local and CI environments

## Implementation

### Step 1: Initialize Project Root

Create the following file structure and configuration:

#### `/package.json`
```json
{
  "name": "computer-guys-chatbot",
  "version": "1.0.0",
  "private": true,
  "description": "Customer service chatbot for Computer Guys",
  "author": "Computer Guys Development Team",
  "license": "PROPRIETARY",
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=8.0.0"
  },
  "packageManager": "pnpm@8.15.0",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "test:unit": "turbo run test:unit",
    "test:integration": "turbo run test:integration",
    "test:e2e": "turbo run test:e2e",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md,yml,yaml}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,md,yml,yaml}\"",
    "typecheck": "turbo run typecheck",
    "clean": "turbo run clean && rm -rf node_modules",
    "db:migrate": "turbo run db:migrate --filter=@cg/api",
    "db:seed": "turbo run db:seed --filter=@cg/api",
    "db:reset": "turbo run db:reset --filter=@cg/api",
    "prepare": "husky install"
  },
  "devDependencies": {
    "@commitlint/cli": "^18.6.0",
    "@commitlint/config-conventional": "^18.6.0",
    "@types/node": "^20.11.0",
    "husky": "^9.0.0",
    "lint-staged": "^15.2.0",
    "prettier": "^3.2.0",
    "turbo": "^1.12.0",
    "typescript": "^5.3.0"
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": [
      "prettier --write",
      "eslint --fix"
    ],
    "*.{json,md,yml,yaml}": [
      "prettier --write"
    ]
  },
  "commitlint": {
    "extends": [
      "@commitlint/config-conventional"
    ]
  }
}
```

#### `/pnpm-workspace.yaml`
```yaml
packages:
  # Application packages
  - 'apps/*'
  # Shared packages
  - 'packages/*'
  # Convex backend
  - 'convex'
  # Infrastructure
  - 'infrastructure/*'
```

#### `/turbo.json`
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [
    "**/.env.*local",
    ".env"
  ],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [
        "dist/**",
        ".next/**",
        "!.next/cache/**",
        "build/**"
      ],
      "env": [
        "NODE_ENV",
        "DATABASE_URL",
        "NEXT_PUBLIC_CONVEX_URL",
        "NEXT_PUBLIC_API_URL"
      ]
    },
    "dev": {
      "cache": false,
      "persistent": true,
      "env": [
        "NODE_ENV",
        "DATABASE_URL",
        "JWT_SECRET",
        "REDIS_URL",
        "CONVEX_URL",
        "NEXT_PUBLIC_CONVEX_URL",
        "NEXT_PUBLIC_API_URL",
        "OPENROUTER_API_KEY",
        "PINECONE_API_KEY"
      ]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"],
      "env": [
        "NODE_ENV"
      ]
    },
    "test:unit": {
      "outputs": ["coverage/**"],
      "env": ["NODE_ENV"]
    },
    "test:integration": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"],
      "env": [
        "NODE_ENV",
        "DATABASE_URL",
        "REDIS_URL"
      ]
    },
    "test:e2e": {
      "dependsOn": ["build"],
      "outputs": ["test-results/**"],
      "env": [
        "NODE_ENV",
        "TEST_BASE_URL"
      ]
    },
    "lint": {
      "outputs": []
    },
    "typecheck": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "clean": {
      "cache": false
    },
    "db:migrate": {
      "cache": false,
      "env": [
        "DATABASE_URL"
      ]
    },
    "db:seed": {
      "cache": false,
      "dependsOn": ["db:migrate"],
      "env": [
        "DATABASE_URL"
      ]
    },
    "db:reset": {
      "cache": false,
      "env": [
        "DATABASE_URL"
      ]
    }
  }
}
```

#### `/.npmrc`
```ini
# PNPM configuration
auto-install-peers=true
strict-peer-dependencies=false
shamefully-hoist=true

# Performance optimizations
node-linker=isolated
symlink=true
prefer-frozen-lockfile=true

# Security
engine-strict=true
resolution-mode=highest

# Registry
registry=https://registry.npmjs.org/
```

#### `/.gitignore`
```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
test-results/
playwright-report/
*.lcov

# Production builds
dist/
build/
.next/
out/
*.tsbuildinfo

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
*.env

# IDE
.vscode/
.idea/
*.swp
*.swo
*.swn
.DS_Store

# Logs
logs/
*.log
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Cache
.turbo/
.cache/
.parcel-cache/
.npm/

# Convex
.convex/
convex/_generated/

# Docker
.dockerignore
docker-compose.override.yml

# Temporary files
tmp/
temp/
*.tmp
*.temp

# OS files
Thumbs.db
Desktop.ini
```

#### `/.prettierrc`
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf",
  "bracketSpacing": true,
  "jsxSingleQuote": false,
  "jsxBracketSameLine": false,
  "proseWrap": "preserve",
  "overrides": [
    {
      "files": "*.md",
      "options": {
        "proseWrap": "always"
      }
    },
    {
      "files": ["*.json", "*.yml", "*.yaml"],
      "options": {
        "tabWidth": 2
      }
    }
  ]
}
```

#### `/.prettierignore`
```
# Build outputs
dist/
build/
.next/
out/
coverage/

# Dependencies
node_modules/
.pnp.js
.pnp/

# Generated files
convex/_generated/
*.generated.ts
*.generated.js

# Cache
.turbo/
.cache/

# Environment
.env*

# Git
.git/
```

### Step 2: Setup Husky for Git Hooks

#### `/.husky/pre-commit`
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run lint-staged for formatting and linting
npx lint-staged

# Run type checking
pnpm typecheck
```

#### `/.husky/commit-msg`
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Validate commit message format
npx commitlint --edit $1
```

#### `/commitlint.config.js`
```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation
        'style',    // Formatting
        'refactor', // Code refactoring
        'test',     // Testing
        'chore',    // Maintenance
        'perf',     // Performance
        'ci',       // CI/CD
        'revert',   // Revert commit
        'build',    // Build system
      ],
    ],
    'scope-enum': [
      2,
      'always',
      [
        'api',
        'web',
        'chat',
        'auth',
        'db',
        'convex',
        'types',
        'validators',
        'config',
        'deps',
        'docker',
        'ci',
      ],
    ],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
  },
};
```

### Step 3: Initialize Git and Install Dependencies

#### Setup Script (`/scripts/setup.sh`)
```bash
#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Setting up Computer Guys Chatbot Monorepo${NC}"

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
  echo -e "${RED}❌ Node.js version 20 or higher is required${NC}"
  exit 1
fi

# Check PNPM installation
if ! command -v pnpm &> /dev/null; then
  echo -e "${YELLOW}📦 Installing PNPM...${NC}"
  npm install -g pnpm@8.15.0
fi

# Initialize git if not already initialized
if [ ! -d .git ]; then
  echo -e "${YELLOW}📚 Initializing Git repository...${NC}"
  git init
  git branch -m main
fi

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
pnpm install

# Setup Husky
echo -e "${YELLOW}🐺 Setting up Husky...${NC}"
pnpm prepare

# Create necessary directories
echo -e "${YELLOW}📁 Creating directory structure...${NC}"
mkdir -p apps/api apps/web packages/types packages/validators convex infrastructure

# Make scripts executable
chmod +x scripts/*.sh
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg

echo -e "${GREEN}✅ Setup complete!${NC}"
echo -e "${GREEN}Run 'pnpm dev' to start development${NC}"
```

## Testing

### Validation Script (`/scripts/validate-setup.js`)
```javascript
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
};

function checkFile(filePath, description) {
  const exists = fs.existsSync(path.join(process.cwd(), filePath));
  if (exists) {
    console.log(`${colors.green}✓${colors.reset} ${description}`);
  } else {
    console.log(`${colors.red}✗${colors.reset} ${description}`);
    process.exit(1);
  }
  return exists;
}

function checkCommand(command, description) {
  try {
    execSync(command, { stdio: 'ignore' });
    console.log(`${colors.green}✓${colors.reset} ${description}`);
    return true;
  } catch {
    console.log(`${colors.red}✗${colors.reset} ${description}`);
    return false;
  }
}

console.log('\n🔍 Validating monorepo setup...\n');

// Check configuration files
checkFile('package.json', 'Root package.json exists');
checkFile('pnpm-workspace.yaml', 'PNPM workspace configuration exists');
checkFile('turbo.json', 'Turborepo configuration exists');
checkFile('.npmrc', 'NPM configuration exists');
checkFile('.gitignore', 'Git ignore file exists');
checkFile('.prettierrc', 'Prettier configuration exists');

// Check Git hooks
checkFile('.husky/pre-commit', 'Pre-commit hook exists');
checkFile('.husky/commit-msg', 'Commit message hook exists');

// Check commands work
checkCommand('pnpm --version', 'PNPM is installed');
checkCommand('pnpm turbo --version', 'Turborepo is installed');
checkCommand('pnpm prettier --version', 'Prettier is installed');

// Check Node version
const nodeVersion = process.version.match(/^v(\d+)/)[1];
if (parseInt(nodeVersion) >= 20) {
  console.log(`${colors.green}✓${colors.reset} Node.js version ${nodeVersion} meets requirements`);
} else {
  console.log(`${colors.red}✗${colors.reset} Node.js version 20+ required (current: ${nodeVersion})`);
  process.exit(1);
}

console.log(`\n${colors.green}✅ All checks passed! Monorepo is properly configured.${colors.reset}\n`);
```

## Documentation

### README for Monorepo Setup (`/README.md`)
```markdown
# Computer Guys Chatbot Monorepo

## 🚀 Quick Start

### Prerequisites
- Node.js >= 20.0.0
- PNPM >= 8.0.0

### Installation
```bash
# Install PNPM if not already installed
npm install -g pnpm@8.15.0

# Install dependencies
pnpm install

# Run setup script
bash scripts/setup.sh
```

### Development
```bash
# Start all services in development mode
pnpm dev

# Run specific app
pnpm dev --filter=@cg/api
pnpm dev --filter=@cg/web

# Run tests
pnpm test

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

## 📁 Project Structure

```
computer-guys-chatbot/
├── apps/
│   ├── api/          # Hono.js backend API
│   └── web/          # Next.js frontend
├── packages/
│   ├── types/        # Shared TypeScript types
│   └── validators/   # Zod validation schemas
├── convex/           # Convex backend functions
├── infrastructure/   # Docker and deployment configs
└── turbo.json        # Turborepo configuration
```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps for production |
| `pnpm test` | Run all tests |
| `pnpm lint` | Lint all packages |
| `pnpm format` | Format code with Prettier |
| `pnpm typecheck` | Run TypeScript type checking |

## 📝 Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat(scope):` New feature
- `fix(scope):` Bug fix
- `docs(scope):` Documentation changes
- `chore(scope):` Maintenance tasks
- `test(scope):` Test updates
```

## Rollback Strategy

If setup fails:
1. Remove `node_modules` and `pnpm-lock.yaml`
2. Delete `.turbo` cache directory
3. Run `git clean -fdx` (if in git repo)
4. Start fresh with setup script

## Success Validation

Run the validation script to ensure everything is configured correctly:
```bash
node scripts/validate-setup.js
```

All checks should pass before proceeding to the next task.