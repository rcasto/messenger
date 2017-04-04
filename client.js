var ws = require('ws');
var config = require('./config.json');

var socket = null;
var messageHandler = null;

function connect() {
  return new Promise((resolve, reject) => {
    if (!socket) {
      socket = new ws(`ws://${config.host}`);
      socket.on('open', resolve);
      socket.on('message', (data, flags) => 
        messageHandler && messageHandler());
      socket.on('error', reject);
      socket.on('close', cleanup);
    }

    resolve(socket);
  });
}

function cleanup() {
  console.log('Socket connection closed');
}