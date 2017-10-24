const through = require('through2');

module.exports = function transform() {
    const toUpper = through(function(chunk, enc, next) {
        this.push(chunk.toString().toUpperCase());
        next();
    });

    process.stdin.pipe(toUpper).pipe(process.stdout);
};
