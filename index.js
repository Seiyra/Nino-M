import { fork, setupPrimary } from 'cluster'; // Use setupPrimary instead of setupMaster
import { join, dirname } from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import cfonts from "cfonts";
import chalk from "chalk";
import yargs from "yargs";
import { createInterface } from "readline";
import { watchFile, unwatchFile } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(__dirname);
const { name, author } = require(join(__dirname, "./package.json"));
const { say } = cfonts;
const rl = createInterface(process.stdin, process.stdout);

// Print banner
say('𝐸𝓁𝓉𝒶\nBot\nMD', {
  font: 'chrome',
  align: 'center',
  gradient: ['red', 'magenta']
});

say(`by Elta`, {
  font: 'console',
  align: 'center',
  gradient: ['red', 'magenta']
});

let isRunning = false;

/**
* Start the main process and the plugin server
* @param {String} file `path/to/file`
*/
function start(file) {
  if (isRunning) return;
  isRunning = true;

  let args = [join(__dirname, file), ...process.argv.slice(2)];

  // Fork the main process
  setupPrimary({ // Replaced setupMaster with setupPrimary
    exec: args[0],
    args: args.slice(1),
  });

  let p = fork();

  p.on('message', data => {
    console.log('✅ Main process running:', data);
    if (data === 'reset') {
      p.process.kill();
      isRunning = false;
      start.apply(this, arguments);
    } else if (data === 'uptime') {
      p.send(process.uptime());
    }
  });

  p.on('exit', (code, signal) => {
    isRunning = false;
    console.error(`⚠️ Main process error (code: ${code}, signal: ${signal})`);
    if (code !== 0) {
      watchFile(args[0], () => {
        unwatchFile(args[0]);
        start(file);
      });
    }
  });

  // Start plugin server
  const pluginProcess = fork(join(__dirname, './pluginServer.js'));
  pluginProcess.on('exit', (code, signal) => {
    console.error(`⚠️ Plugin server error (code: ${code}, signal: ${signal})`);
  });

  // Handle input from terminal
  let opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
  if (!opts['test'] && !rl.listenerCount()) {
    rl.on('line', line => {
      p.emit('message', line.trim());
    });
  }
}

// Start the bot and plugin server
start('main.js');
