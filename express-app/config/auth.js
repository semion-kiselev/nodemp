const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const {ExtractJwt, Strategy: JwtStrategy} = require('passport-jwt');
const find = require('ramda/src/find');
const propEq = require('ramda/src/propEq');
const path = require('ramda/src/path');

const jwtSecret = 'jwtSecret';

const users = [
    {
        id: 1,
        username: 'semion_kiselev',
        login: 'semion.kiselev@gmail.com',
        password: '123456'
    }
];

const createLocalStrategy = () => {
    return new LocalStrategy({
        usernameField: 'login'
    }, (email, password, cb) => {
        if (!email || !password) {
            return cb(null, false);
        }

        const user = find(propEq('login', email), users);

        if (!user || user.password !== password) {
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
    }, (accessToken, refreshToken, profile, cb) => {
        const email = path(['emails', '0', 'value'], profile);

        if (!email) {
            return cb(null, false);
        }

        const user = find(propEq('login', email), users);

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
    }, (token, tokenSecret, profile, cb) => {
        const username = path(['username'], profile);

        if (!username) {
            return cb(null, false);
        }

        const user = find(propEq('username', username), users);

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
    }, (token, tokenSecret, profile, cb) => {
        const email = path(['emails', '0', 'value'], profile);
        console.log('profile ', email);

        if (!email) {
            return cb(null, false);
        }

        const user = find(propEq('login', email), users);

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
    }, (jwtPayload, cb) => {
        const user = find(propEq('id', jwtPayload.id), users);

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
