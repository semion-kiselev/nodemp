const http = require('http');

const product = {
    id: 1,
    name: 'Supreme T-Shirt',
    brand: 'Supreme',
    price: 99.99,
    options: [
        {color: 'blue'},
        {size: 'XL'}
    ]
};

const server = http.createServer((req, res) => {
    req.on('error', err => console.error(err));
    res.on('error', err => console.error(err));

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });

    res.end(JSON.stringify(product));
});

server.listen(3003);
