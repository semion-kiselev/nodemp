const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
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

const createGoogleStrategy = () => {
    return new GoogleStrategy({
        clientID: '32149450977-0qgfi3rg16bobcvrn2k8vmlqg09ihuui.apps.googleusercontent.com',
        clientSecret: 'Whb5By0GuTjbiUPcoeXRbNaD',
        callbackURL: 'http://localhost:8080/auth/google/callback'
    }, async (accessToken, refreshToken, profile, cb) => {
        const email = path(['emails', '0', 'value'], profile);

        if (!email) {
            return cb(null, false);
        }

        const user = await User.findOne({email});

        if (!user) {
            return cb(null, false);
        }

        return cb(null, user);
    })
};

const createTwitterStrategy = () => {
    return new TwitterStrategy({
        consumerKey: 'RIsOm76tj3n4Sq6m0avJzYeOD',
        consumerSecret: 'EOtsZCFlZ1ekcT0MJSPab8gGvI1lrpu3avlyb5fF6dCNSXcntv',
        callbackURL: 'http://localhost:8080/auth/twitter/callback'
    }, async (token, tokenSecret, profile, cb) => {
        const username = path(['username'], profile);

        if (!username) {
            return cb(null, false);
        }

        const user = await User.findOne({username});

        if (!user) {
            return cb(null, false);
        }

        return cb(null, user);
    })
};

const createFacebookStrategy = () => {
    return new FacebookStrategy({
        clientID: '1374138019378297',
        clientSecret: '43e23bf95e5c3e7b675043d68fed2e20',
        callbackURL: 'http://localhost:8080/auth/facebook/callback',
        profileFields: ['id', 'emails', 'name']
    }, async (token, tokenSecret, profile, cb) => {
        const email = path(['emails', '0', 'value'], profile);

        if (!email) {
            return cb(null, false);
        }

        const user = await User.findOne({email});

        if (!user) {
            return cb(null, false);
        }

        return cb(null, user);
    })
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
passport.use(createGoogleStrategy());
passport.use(createTwitterStrategy());
passport.use(createFacebookStrategy());
passport.use(createJwtStrategy());

exports.jwtSecret = jwtSecret;

