var ws = require('ws');
var config = require('./config.json');

var socket = null;
var messageHandler = null;

function connect(handle) {
    return new Promise((resolve, reject) => {
        if (socket) {
            return resolve(socket);
        }

        messageHandler = handle;
        socket = new ws(`ws://${config.host}`);

        socket.once('open',() => resolve(socket));
        socket.on('message', (data, flags) =>
            messageHandler && messageHandler(data, flags));
        socket.once('error', (error) => {
            cleanup();
            reject(error);
        });
        socket.once('close', cleanup);
    });
}

function cleanup() {
    console.log('Socket connection closed');
    socket && socket.close();
    socket = null;
    messageHandler = null;
}

process.on('exit', () => cleanup);
process.on('SIGINT', cleanup);

module.exports = {
    connect,
    cleanup
};