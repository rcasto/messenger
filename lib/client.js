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
        socket.on('message', (data, flags) => {
            data = JSON.parse(data);
            if (data && data.type === 'close') {
                cleanup();
            } else {
                messageHandler && messageHandler(data, flags);
            }
        });
        socket.on('ping', (data) => {
            if (data.toString() === '{}') {
                console.log('Got a ping from server');
                socket && socket.pong(data.toString(), false, false);
            }
        });
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
    socket && socket.send(JSON.stringify({
        type: 'close'
    }));
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