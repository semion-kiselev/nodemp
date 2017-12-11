const passport = require('passport');
module.exports = {};

module.exports.jwt = function (req, def, scopes, callback) {
    const $ = passport.authenticate('jwt', {session: false}, function(error, user, info) {
        if (error) {
            const err = new Error('Error in JWT authentication process');
            err.status = 500;
            return callback(err);
        }

        if (!user) {
            const err = new Error('Authentication failed,: ' + info);
            err.status = 401;
            return callback(err);
        }

        req.user = user;
        return callback();
    });

    $(req, null, callback);
};
