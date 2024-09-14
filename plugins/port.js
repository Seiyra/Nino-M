import http from 'http';

// Create a server to listen on port 3002
const pluginPort = 3002;
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Plugin server running on port 3002');
});

// Start listening on the port
server.listen(pluginPort, () => {
  console.log(`Plugin server listening on port ${pluginPort}`);
});

// Handle error events
server.on('error', (err) => {
  console.error(`Error on plugin server: ${err.message}`);
});
