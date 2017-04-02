var ws = require('ws');

var socket = new ws('ws://localhost:3000');

socket.on('open', () => {
    socket.send('something');
});

socket.on('message', (data, flags) => {
  // flags.binary will be set if a binary data is received.
  // flags.masked will be set if the data was masked.
});