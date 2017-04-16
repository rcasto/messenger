var clientModule = require('../lib/client');

function messageHandle(data, flags) {
    console.log(`Message: ${data} - Flags: ${flags}`);
    // Do some other message routing stuff here
}

clientModule.connect('ws://localhost:3000', messageHandle)
    .then((socket) => {
        socket.send(JSON.stringify({
            text: 'Testing this shit out'
        }));
    })
    .catch(error => console.error(`An error occurred: ${error}`))