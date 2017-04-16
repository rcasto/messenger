var socketService = require('./socketService');
var logger = require('./logger');
var helpers = require('./helpers');
var uuid = require('uuid');

var connectionMap = {};

function create(config) {
    var server = socketService.createServerSocket({
        port: config.port,
        host: config.host
    }, () => logger.log(`Web socket server started on port ${config.port}`));

    server.on('connection', (client) => {
        client.id = uuid(); // attach id as property of socket
        // send the client their id
        client.send(JSON.stringify({
            type: 'id',
            data: client.id
        }))
        logger.log(`New client connected: ${client.id} - Total clients: ${Object.keys(connectionMap).length + 1}`);
        connectionMap[client.id] = {
            socket: client,
            keepAlive: () => {} //keepalive(client, config.keepAliveIntervalInMs || 5000)
        };
        client.on('message', (message, flags) => {
            logger.log(`Message received from client ${client.id}: ${message}`);
            message = helpers.tryJSONParse(message);
            // client disconnected, cleanup
            if (message && message.type === 'close') {
                connectionMap[client.id].keepAlive();
                delete connectionMap[client.id];
            } else {
                config.messageHandler && config.messageHandler(message, flags);
            }
        });
        client.on('error', (error) => logger.error(`Client ${client.id} socket error`, error));
    });
    server.on('error', (error) => logger.error('WebSocket server error', error));

    process.on('exit', () => cleanup(server));
    process.on('SIGINT', () => cleanup(server));
    
    return server;
}

// assumes that the socket has a property called 'id'
function keepalive(socket, keepAliveIntervalInMs) {
    // If you have gotten more than one ping before you get the chance to send a pong, you only send one pong.
    // You might also get a pong without ever sending a ping; ignore this if it happens
    var hasSentPing = false;
    var pingData = JSON.stringify({
        id: socket.id
    });
    var cancelId = setTimeout(function loop() {
        socket.ping(pingData, false, false);
        hasSentPing = true;
        cancelId = setTimeout(loop, keepAliveIntervalInMs);
    }, keepAliveIntervalInMs);
    socket.on('pong', (data) => {
        if (data.toString() === pingData && hasSentPing) {
            console.log(`Got a pong from client ${socket.id}`);
            hasSentPing = false;
        }
    });
    return function () {
        clearTimeout(cancelId);
    };
}

function cleanup(server) {
    logger.log('Server shutting down, cleaning up');
    Object.keys(connectionMap).forEach((clientId) => {
        connectionMap[clientId].socket.send(JSON.stringify({
            type: 'close'
        }));
        connectionMap[clientId].keepAlive();
        delete connectionMap[clientId];
    });
    server.close();
}

module.exports = {
    create,
    cleanup
};