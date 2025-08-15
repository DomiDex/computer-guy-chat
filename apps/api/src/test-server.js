const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        message: 'Basic server is running',
      })
    );
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`✅ Test server running on http://localhost:${port}`);
  console.log(`📝 Check health: http://localhost:${port}/health`);
});
