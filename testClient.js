var clientModule = require('./client');

function messageHandle(data, flags) {
    console.log(`Message: ${data} - Flags: ${flags}`);
}

try {
    let clientSocket = await clientModule.connect(messageHandle);
    clientSocket.send({
        text: 'Testing this shit out'
    });
} catch(error) {
    console.error(`An error occurred: ${error}`);
}