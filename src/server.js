const fs = require('fs');
const http = require('http');

const server = http.createServer(function listener(req, res) {
  fs.readFile(__dirname + '/../build/index.html', 'utf-8', function send(error, data) {
    res.write(data);
    res.end();
  });
});

server.listen(3000);
