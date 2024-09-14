const express = require('express');
const app = express();

// Get the port from environment variables or fallback to 3000
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from Elta Bot Main Server!');
});

// Start the main server
app.listen(port, () => {
  console.log(`Main server listening on port ${port}`);
});
