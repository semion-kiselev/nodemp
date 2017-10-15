const fs = require('fs');
const path = require('path');
const through = require('through2');
const split = require('split');
const {readdir, stat, unlink} = require('mz/fs');
const request = require('request');

const ACTION = 'action';
const ACTION_ALIAS = 'a';
const FILE = 'file';
const FILE_ALIAS = 'f';
const HELP = 'help';
const HELP_ALIAS = 'h';
const MAKE_FILE = 'make-file';
const MAKE_FILE_ALIAS = 'm';
const PATH = 'path';
const PATH_ALIAS = 'p';
const actionTypes = {
    IO: 'io',
    TRANSFORM: 'transform',
    TRANSFORM_FILE: 'transform-file',
    BUNDLE_CSS: 'bundle-css'
};

const additionCssUrl = 'https://www.epam.com/etc/clientlibs/foundation/main.min.fc69c13add6eae57cd247a91c7e26a15.css';

const helpMessage = `
    Use --${ACTION} (or -${ACTION_ALIAS}) param to declare action (REQUIRED)
    Action types: 
        - ${actionTypes.IO} (require --${FILE} (or -${FILE_ALIAS}) param with relative path)
        - ${actionTypes.TRANSFORM}
        - ${actionTypes.TRANSFORM_FILE} (require --${FILE} (or -${FILE_ALIAS}) param with relative path),
          add --${MAKE_FILE} (-${MAKE_FILE_ALIAS}) to transform file to a result file with the same name
        - ${actionTypes.BUNDLE_CSS} (require --${PATH} (or -${PATH_ALIAS}) param with relative path
`;

const args = process.argv.slice(2);
const minimistOptions = {
    alias: {
        [ACTION_ALIAS]: ACTION,
        [FILE_ALIAS]: FILE,
        [HELP_ALIAS]: HELP,
        [MAKE_FILE_ALIAS]: MAKE_FILE,
        [PATH_ALIAS]: PATH
    },
    unknown(param) {
        console.log(`You have provided unknown params ${param}. Use --help command for arguments list`);
    }
};
const argv = require('minimist')(args, minimistOptions);

function inputOutput(filePath) {
    const frs = fs.createReadStream(filePath);

    frs.on('error', (err) => {
        if (err.code && err.code === 'ENOENT') {
            return console.error('Seems the file path you provided is incorrect');
        }

        return console.error(err);
    });

    frs.pipe(process.stdout);
}

function transformFile(filePath, toFile) {
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
}

function transform() {
    const toUpper = through(function(chunk, enc, next) {
        this.push(chunk.toString().toUpperCase());
        next();
    });

    process.stdin.pipe(toUpper).pipe(process.stdout);
}

async function cssBundler(dirPath) {
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
}

function httpClient() {}

function httpServer() {}

function printHelpMessage() {
    console.log(helpMessage);
}

const argvKeys = Object.keys(argv);

if (argvKeys.length === 1 && !argv._.length) {
    return console.log('No arguments are provided. Please, use --help command for arguments list');
}

if (process.argv[2] === `-${HELP_ALIAS}` ||  process.argv[2] === `--${HELP}`) {
    return printHelpMessage();
}

if (argv[ACTION] === actionTypes.IO) {
    const filePath = argv['file'];

    if (!filePath) {
        return console.log('You haven\'t provided file');
    }

    const fullPath = path.resolve(__dirname, argv['file']);
    return inputOutput(fullPath);
}

if (argv[ACTION] === actionTypes.TRANSFORM) {
    return transform();
}

if (argv[ACTION] === actionTypes.TRANSFORM_FILE) {
    const filePath = argv['file'];

    if (!filePath) {
        return console.log('You haven\'t provided file');
    }

    const fullPath = path.resolve(__dirname, argv['file']);
    return transformFile(fullPath, argv['make-file']);
}

if (argv[ACTION] === actionTypes.BUNDLE_CSS) {
    const dirPath = argv['path'];

    if (!dirPath) {
        return console.log('You haven\'t provided path to directory with css files');
    }

    const fullPath = path.resolve(__dirname, argv['path']);
    return cssBundler(fullPath);
}

module.exports = {
    inputOutput,
    transformFile,
    transform,
    httpClient,
    httpServer
};

function csvToJson() {
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
            const values = getSplitCsvRow(row);
            const item = {};
            keys.forEach((key, index) => {
                item[key] = values[index];
            });

            if (isSecondLine) {
                this.push(JSON.stringify(item));
                isSecondLine = false;
            } else {
                this.push(`,${JSON.stringify(item)}`);
            }

            next();
        }
    }, function(done) {
        this.push(']');
        done();
    });
}

function getSplitCsvRow(row) {
    const re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    const a = [];
    row.replace(re_value, function(m0, m1, m2, m3) {
        if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
        else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
        else if (m3 !== undefined) a.push(m3);
        return '';
    });

    if (/,\s*$/.test(row)) a.push('');
    return a;
}

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
