var socketService = require('./socketService');
var logger = require('./logger');

var socket = null;
var messageHandler = null;

function connect(url, handle) {
    return new Promise((resolve, reject) => {
        if (!url || !handle) {
          return reject('Invalid invocation parameters: ${url} : ${handle}');
        }

        if (socket) {
            return resolve(socket);
        }

        messageHandler = handle;
        socket = socketService.createClientSocket(url);

        socket.once('open', () => resolve(socket));
        socket.on('message', (data, flags) =>
            messageHandler && messageHandler(data, flags));
        socket.once('error', (error) => {
            cleanup();
            reject(error);
        });
        socket.once('close', (code, reason) => {
            logger.log(`Socket closed. Code: ${code}, Reason: ${reason}`);
            cleanup();
        });
    });
}

function cleanup() {
    logger.log('Cleaning up resources');
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