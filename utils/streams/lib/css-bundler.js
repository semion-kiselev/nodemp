const fs = require('fs');
const path = require('path');
const {readdir, stat, unlink} = require('mz/fs');
const request = require('request');

const additionCssUrl = 'https://www.epam.com/etc/clientlibs/foundation/main.min.fc69c13add6eae57cd247a91c7e26a15.css';

module.exports = async function cssBundler(dirPath) {
    try {
        await deleteBundleCssIfExists(dirPath);
        const cssPathsArray = await getCssPathsArray(dirPath);

        if (!cssPathsArray.length) {
            return false;
        }

        const bundlePath = path.resolve(dirPath, 'bundle.css');
        combineCssFiles(bundlePath, cssPathsArray);
        await addCssFromUrl(bundlePath, additionCssUrl);
    } catch(err) {
        if (err.code && err.code === 'ENOENT') {
            return console.error('Seems the directory path you provided is incorrect');
        }
        return console.error(err);
    }
};

async function getCssPathsArray(dirPath) {
    const files = await readdir(dirPath);
    const cssFiles = [];

    for (let fileName of files) {
        const filePath = path.resolve(dirPath, fileName);
        const fileStat = await stat(filePath);

        if (fileStat.isFile() && path.extname(filePath) === '.css') {
            cssFiles.push(filePath);
        }
    }

    return cssFiles;
}

async function deleteBundleCssIfExists(dirPath) {
    try {
        const filePath = path.resolve(dirPath, 'bundle.css');
        await unlink(filePath);
    } catch(err) {
        if (!(err.code && err.code === 'ENOENT')) {
            throw err;
        }
    }
}

function combineCssFiles(bundlePath, cssPathsArray) {
    const fws = fs.createWriteStream(bundlePath, {flags: 'a'});
    fws.on('error', console.error);

    for (let cssPath of cssPathsArray) {
        const frs = fs.createReadStream(cssPath);
        frs.on('error', console.error );
        frs.pipe(fws);
    }
}

async function addCssFromUrl(bundlePath, url) {
    const fws = fs.createWriteStream(bundlePath, {flags: 'a'});
    fws.on('error', console.error);

    request(url).pipe(fws);
}
