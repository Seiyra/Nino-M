import express from 'express'; // Import the express library
const app = express(); // Launch the express app
import { createServer } from 'http'; // Import the http library
const server = createServer(app); // Create the server

/** Replying to request at '/' */
app.get('/', (req, res) => {
  res.send('Testing...');
});

server.listen(3002, () => {
  console.log('Server is running on port 3002');
});
