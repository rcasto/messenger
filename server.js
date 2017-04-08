var ws = require('ws');
var logger = require('./logger');

function create(messageRouter, config) {
    var server = new ws.Server({
        port: config.port,
        host: config.host
    }, () => logger.log(`Web socket server started on port ${config.port}`))
        .on('connection', (client) => {
            logger.log(`New client connected: ${client}`);
            client.on('message', (message) => {
                logger.log(`Message received from client: ${message}`);
                messageRouter && messageRouter(message);
            });
            client.on('error', (error) => logger.error('Client socket error', error));
        })
        .on('error', (error) => logger.error('WebSocket server error', error));

    process.on('exit', () => cleanup(server));
    process.on('SIGINT', () => cleanup(server));
    
    return server;
}

function cleanup(server) {
    logger.log('Server shutting down, cleaning up');
    server.close();
}

module.exports = {
    create,
    cleanup
};