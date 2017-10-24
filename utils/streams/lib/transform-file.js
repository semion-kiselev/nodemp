const fs = require('fs');
const path = require('path');
const split = require('split');
const csvToJson = require('./transformers/csv-to-json');

module.exports = function transformFile(filePath, toFile) {
    const frs = fs.createReadStream(filePath);

    frs.on('error', (err) => {
        if (err.code && err.code === 'ENOENT') {
            return console.error('Seems the file path you provided is incorrect');
        }

        return console.error(err);
    });

    const splitting = split(null, null, {trailing: false});
    const pipeRoad = frs.pipe(splitting).pipe(csvToJson());

    if (toFile) {
        const pathData = path.parse(filePath);
        const fws = fs.createWriteStream(path.resolve(pathData['dir'], `${pathData['name']}.json`));
        fws.on('error', console.error);

        return pipeRoad.pipe(fws);
    }

    return pipeRoad.pipe(process.stdout);
};


