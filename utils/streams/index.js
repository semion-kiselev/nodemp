const fs = require('fs');
const path = require('path');

const {
    ACTION,
    HELP,
    HELP_ALIAS,
    actionTypes,
    helpMessage,
    parserOptions
} = require('./config');

const inputOutput = require('./lib/input-output');
const transform = require('./lib/transform');
const transformFile = require('./lib/transform-file');
const cssBundler = require('./lib/css-bundler');

const args = process.argv.slice(2);
const argv = require('minimist')(args, parserOptions);

const argvKeys = Object.keys(argv);

if (argvKeys.length === 1 && !argv._.length) {
    return console.log('No arguments are provided. Please, use --help command for arguments list');
}

if (process.argv[2] === `-${HELP_ALIAS}` ||  process.argv[2] === `--${HELP}`) {
    return console.log(helpMessage);
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
