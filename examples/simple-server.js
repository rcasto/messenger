var server = require('../server.js');

function messageHandler(message) {
    console.log(`Message received from client: ${message}`);
}

server.create({
    messageHandler: messageHandler,
    port: 3000,
    host: 'localhost'
});