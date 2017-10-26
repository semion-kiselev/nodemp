const qs = require('qs');

module.exports = (options) => (req, res, next) => {
    const query = req.originalUrl.split('?')[1];

    req.parsedQuery = qs.parse(query, options);
    next();
};

