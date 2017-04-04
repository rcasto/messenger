var ws = require('ws');
var config = require('./config.json');

var wss = new ws.Server({
    port: config.port,
    host: config.host
}, () => {
    console.log(`Web socket server started on port ${port}`);
});

wss.on('connection', (client) => {
    console.log(`New client connected: ${client}`);

    client.on('message', (message) => {
        console.log('received: %s', message);
    });
    client.on('error', onError);
});
wss.on('error', onError);

function onError(error) {
    console.error(error);
}