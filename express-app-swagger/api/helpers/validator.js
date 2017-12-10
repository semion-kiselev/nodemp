const is = require('ramda/src/is');

exports.isObjectId = (value) => {
    const re = /^[0-9a-fA-F]{24}$/;
    return re.test(is(String, value) ? value : value.toString());
};
