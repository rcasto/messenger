var dnsd = require('dnsd');

var port = 5353;
var server = dnsd.createServer(handler);
server.listen(port, '127.0.0.1', () => {
    console.log(`Server running at 127.0.0.1:${port}`);
});

function handler(req, res) {
  console.log(`${req.connection.remoteAddress}:${req.connection.remotePort}/${req.connection.type} ${req}`);

  var question = req.question[0];
  var hostname = question.name;
  var length = hostname.length;
  var ttl = Math.floor(Math.random() * 3600);

  if (question.type == 'A') {
    res.answer.push({name:hostname, type:'A', data:"1.1.1."+length, 'ttl':ttl});
    res.answer.push({name:hostname, type:'A', data:"2.2.2."+length, 'ttl':ttl});
  }

  res.end();
}