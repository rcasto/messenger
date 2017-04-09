var clientModule = require('../lib/client');

function messageHandle(data, flags) {
    console.log(`Message: ${data} - Flags: ${flags}`);
}

clientModule.connect('ws://localhost:3000', messageHandle)
    .then((socket) => {
        socket.send(JSON.stringify({
            text: 'Testing this shit out'
        }));
    })
    .catch(error => console.error(`An error occurred: ${error}`))