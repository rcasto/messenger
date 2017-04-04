var ws = require('ws');
var config = require('./config.json');

var socket = new ws(`ws://${config.host}`);

socket.on('open', () => {
    socket.send('something');
});

socket.on('message', (data, flags) => {
  // flags.binary will be set if a binary data is received.
  // flags.masked will be set if the data was masked.
});
socket.on('error', (error) => console.error(error));