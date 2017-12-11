const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {ExtractJwt, Strategy: JwtStrategy} = require('passport-jwt');
const path = require('ramda/src/path');
const mongoose = require('mongoose');
const User = mongoose.model('User');

const jwtSecret = 'jwtSecret';

const createLocalStrategy = () => {
    return new LocalStrategy({
        usernameField: 'email'
    }, async (email, password, cb) => {
        if (!email || !password) {
            return cb(null, false);
        }

        const user = await User.findOne({email});

        if (!user || !user.verifyPassword(password)) {
            return cb(null, false);
        }

        return cb(null, user);
    });
};

const createJwtStrategy = () => {
    return new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromHeader('x-access-token'),
        secretOrKey: jwtSecret
    }, async (jwtPayload, cb) => {
        const user = await User.findById(jwtPayload.id);

        if (!user) {
            return cb(null, false);
        }

        return cb(null, user);
    })
};

passport.use(createLocalStrategy());
passport.use(createJwtStrategy());

exports.jwtSecret = jwtSecret;


