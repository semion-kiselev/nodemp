const passport = require('passport');
const jwt = require('jsonwebtoken');
const {jwtSecret} = require('../config/auth');

const authCb = (req, res, next) => (err, user) => {
    if (err) {
        return res.status(500).end();
    }

    if (!user) {
        return res.status(404).json({
            code: 404,
            message: 'Not Found',
            data: {}
        })
    }

    const token = jwt.sign({id: user.id}, jwtSecret, {expiresIn: '1h'});
    return res.json({
        code: 200,
        message: 'OK',
        data: {
            user: {
                email: user.login,
                username: user.username
            }
        },
        token
    });
};

exports.login = (req, res, next) => {
    passport.authenticate('local', authCb(req, res, next))(req, res, next);
};

exports.authWithGoogle = passport.authenticate('google', {scope: ['profile', 'email']});
exports.loginWithGoogle = (req, res, next) => {
    passport.authenticate('google', authCb(req, res, next))(req, res, next);
};

exports.authWithTwitter = passport.authenticate('twitter');
exports.loginWithTwitter = (req, res, next) => {
    passport.authenticate('twitter', authCb(req, res, next))(req, res, next);
};

exports.authWithFacebook = passport.authenticate('facebook', {scope: ['email']});
exports.loginWithFacebook = (req, res, next) => {
    passport.authenticate('facebook', authCb(req, res, next))(req, res, next);
};

