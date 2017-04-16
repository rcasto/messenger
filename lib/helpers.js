function tryJSONParse(str) {
    try {
        return JSON.parse(str);
    } catch(e) {
        return null;
    }
}

module.exports = {
    tryJSONParse
};