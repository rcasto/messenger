var ws = require('ws');

function createServerSocket(config, cb) {
    return new ws.Server(config, cb);
}

function createClientSocket(address) {
    return new ws(address);
}

module.exports = {
    createServerSocket,
    createClientSocket
};