const http = require('http');
const fs = require('fs');
const path = require('path');
const through = require('through2');

const replaceMessage = message => through(function(chunk, enc, next) {
    const html = chunk.toString().replace(/{message}/, message);
    this.push(html);
    next();
});

const server = http.createServer((req, res) => {
    req.on('error', err => console.error(err));
    res.on('error', err => console.error(err));

    const message = 'Hello World';
    const viewPath = path.resolve(__dirname, '..', 'views/index.html');

    // v1
    // const view = fs.readFileSync(viewPath).toString().replace(/{message}/, message);

    //v2
    const frs = fs.createReadStream(viewPath);

    res.writeHead(200, {
        'Content-Type': 'text/html'
    });

    // v1
    // res.end(view);

    //v2
    frs.pipe(replaceMessage(message)).pipe(res);
});

server.listen(3002);
