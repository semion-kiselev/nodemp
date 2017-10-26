const http = require('http');

const server = http.createServer((req, res) => {
    req.on('error', err => console.error(err));
    res.on('error', err => console.error(err));

    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });

    res.end('Hello World');
});

server.listen(3001);
