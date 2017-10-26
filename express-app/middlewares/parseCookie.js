const cookie = require('cookie');

module.exports = (options) => (req, res, next) => {
    const cookieStr = '';

    req.parsedCookie = cookie.parse(cookieStr, options);
    next();
};
