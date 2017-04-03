var express = require('express');

var app = express();
var port = 3000;

app.get('/', (req, res) => {
    res.send('Hello!');
    res.end();
});

app.listen(port, function () {
    console.log(`Server started on port ${port}`);
});