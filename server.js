var socketService = require('./lib/socketService');
var logger = require('./lib/logger');

function create(config) {
    var server = socketService.createServerSocket({
        port: config.port,
        host: config.host
    }, () => logger.log(`Web socket server started on port ${config.port}`));

    server.on('connection', (client) => {
        logger.log(`New client connected: ${client}`);
        client.on('message', (message) => {
            logger.log(`Message received from client: ${message}`);
            config.messageHandler && config.messageHandler(message);
        });
        client.on('error', (error) => logger.error('Client socket error', error));
    });
    server.on('error', (error) => logger.error('WebSocket server error', error));

    process.on('exit', () => cleanup(server));
    process.on('SIGINT', () => cleanup(server));
    
    return server;
}

function cleanup(server) {
    logger.log('Server shutting down, cleaning up');
    // TODO: notify clients that server is shutting down
    server.close();
}

module.exports = {
    create,
    cleanup
};