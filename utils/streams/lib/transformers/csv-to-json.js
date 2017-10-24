const through = require('through2');
const csv = require('csvtojson');

module.exports = function csvToJson() {
    let isFirstLine = true;
    let isSecondLine = true;
    let keys = [];

    return through(function(chunk, enc, next) {
        const row = chunk.toString();

        if (isFirstLine) {
            keys = row.split(',');
            isFirstLine = false;
            this.push('[');
            next();
        } else {
            csv({noheader: true, headers: keys}).fromString(row)
                .on('json', json => {
                    if (isSecondLine) {
                        this.push(JSON.stringify(json));
                        isSecondLine = false;
                    } else {
                        this.push(`,${JSON.stringify(json)}`);
                    }

                    next();
                });
        }
    }, function(done) {
        this.push(']');
        done();
    });
};
