const fs = require('fs');

module.exports = function inputOutput(filePath) {
    const frs = fs.createReadStream(filePath);

    frs.on('error', (err) => {
        if (err.code && err.code === 'ENOENT') {
            return console.error('Seems the file path you provided is incorrect');
        }

        return console.error(err);
    });

    frs.pipe(process.stdout);
};
