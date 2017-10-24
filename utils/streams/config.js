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

const helpMessage = `
    Use --${ACTION} (or -${ACTION_ALIAS}) param to declare action (REQUIRED)
    Action types: 
        - ${actionTypes.IO} (require --${FILE} (or -${FILE_ALIAS}) param with relative path)
        - ${actionTypes.TRANSFORM}
        - ${actionTypes.TRANSFORM_FILE} (require --${FILE} (or -${FILE_ALIAS}) param with relative path),
          add --${MAKE_FILE} (-${MAKE_FILE_ALIAS}) to transform file to a result file with the same name
        - ${actionTypes.BUNDLE_CSS} (require --${PATH} (or -${PATH_ALIAS}) param with relative path
`;

const parserOptions = {
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

module.exports = {
    ACTION,
    HELP,
    HELP_ALIAS,
    actionTypes,
    helpMessage,
    parserOptions
};