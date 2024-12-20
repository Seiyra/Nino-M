import express from 'express';
import { createServer } from 'http';
import { Socket } from 'socket.io';
import { toBuffer } from 'qrcode';
import fetch from 'node-fetch';

function connect(conn, PORT) {
  let app = global.app = express();
  console.log(app);

  let server = global.server = createServer(app);
  let _qr = 'QR invalido, probablemente ya hayas escaneado el QR.';

  conn.ev.on('connection.update', function appQR({ qr }) {
    if (qr) _qr = qr;
  });

  // Serve QR code as image
  app.use(async (req, res) => {
    try {
      res.setHeader('content-type', 'image/png');
      res.end(await toBuffer(_qr));
    } catch (error) {
      res.status(500).send('Error generating QR code');
    }
  });

  // Start the server
  server.listen(PORT, () => {
    console.log('App listening on port', PORT);
    if (opts['keepalive']) keepAlive();
  });
}

function pipeEmit(event, event2, prefix = '') {
  let old = event.emit;
  event.emit = function (event, ...args) {
    old.emit(event, ...args);
    event2.emit(prefix + event, ...args);
  };
  return {
    unpipeEmit() {
      event.emit = old;
    }
  };
}

// Keep the app alive (if running on Replit)
function keepAlive() {
  const url = `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`;
  if (/(\/\/|\.)undefined\./.test(url)) return;
  setInterval(() => {
    fetch(url).catch(console.error);
  }, 5 * 1000 * 60); // Ping every 5 minutes
}

export default connect;
