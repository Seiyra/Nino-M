import http from 'http';

// Create plugin server on port 3002
const pluginPort = 3002;
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Plugin server running on port 3002');
});

// Start server
server.listen(pluginPort, () => {
  console.log(`Plugin server running on port ${pluginPort}`);
});

// Error handling
server.on('error', (err) => {
  console.error(`Plugin server error: ${err.message}`);
});
