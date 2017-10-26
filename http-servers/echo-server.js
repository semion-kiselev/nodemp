const http = require('http');
const url = require('url');

// v1

// const server = http.createServer((req, res) => {
//     req.on('error', err => console.error(err));
//     res.on('error', err => console.error(err));
//
//     const urlParsed = url.parse(req.url, true);
//
//     if (urlParsed.pathname === '/' && urlParsed.query.message) {
//         res.statusCode = 200;
//         res.end(urlParsed.query.message);
//     } else{
//         res.statusCode = 404;
//         res.end();
//     }
// });

// v2

const server = http.createServer((req, res) => {
    res.writeHead(200);
    req.pipe(res);

});

server.listen(3004);

