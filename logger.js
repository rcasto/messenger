function log(message) {
    console.log(`Info: ${message}`);
}

function error(message, error) {
    console.error(`Error: ${message}\n${error}`);
}

module.exports = {
    log,
    error
};