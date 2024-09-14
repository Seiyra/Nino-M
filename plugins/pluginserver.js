const http = require('http');

// Get the plugin server port from environment variables or fallback to 3002
const pluginPort = process.env.PLUGIN_PORT || 3002;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from Elta Bot Plugin Server!');
});

// Start the plugin server
server.listen(pluginPort, () => {
  console.log(`Plugin server listening on port ${pluginPort}`);
});
