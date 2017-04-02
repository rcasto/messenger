var ws = require('ws');

var port = 3000;
var wss = new ws.Server({ 
    port: port
}, () => {
    console.log(`Web socket server started on port ${port}`);
});

wss.on('connection', (client) => {
    console.log(`New client connected: ${client}`);

    client.on('message', (message) => {
        console.log('received: %s', message);
    });
});