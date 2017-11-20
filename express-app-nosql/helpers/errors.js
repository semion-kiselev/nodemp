const forEachObjIndexed = require('ramda/src/forEachObjIndexed');

exports.notFound = (req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
};

exports.validationErrors = (err, req, res, next) => {
    if (!err.errors) {
        return next(err);
    }

    const validatorErrors = {};
    forEachObjIndexed((val, key) => validatorErrors[key] = val.message)(err.errors);

    res.status(422).json(validatorErrors);
};

exports.productionErrors = (err, req, res, next) => {
    res.status(err.status || 500).end();
};
