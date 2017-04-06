var ws = require('ws');
var config = require('./config.json');

var wss = new ws.Server({
    port: config.port,
    host: config.host
}, () => console.log(`Web socket server started on port ${config.port}`));

wss.on('connection', (client) => {
    console.log(`New client connected: ${client}`);

    client.on('message', (message) => {
        console.log('received: %s', message);
    });
    client.on('error', (error) => onError(error, 'Client socket error'));
});
wss.on('error', (error) => onError(error, 'WebSocket server error'));

function onError(error, message) {
    console.error(`An error occurred: ${message}\n${error}`);
}