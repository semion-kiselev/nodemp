exports.addLastModifiedDate = function (next) {
    this._doc.lastModifiedDate = new Date();
    next();
};
