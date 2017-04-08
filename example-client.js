var clientModule = require('./client');

function messageHandle(data, flags) {
    console.log(`Message: ${data} - Flags: ${flags}`);
}

clientModule.connect(messageHandle)
    .then((socket) => {
        socket.send(JSON.stringify({
            text: 'Testing this shit out'
        }));
    })
    .catch(error => console.error(`An error occurred: ${error}`))