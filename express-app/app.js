const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./config/auth');
const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const errors = require('./helpers/errors');
const parseCookie = require('./middlewares/parseCookie');
const parseQuery = require('./middlewares/parseQuery');

const app = express();

app.use(session({
    secret: 'sessionSecret',
    name: 'ses',
    resave: false,
    saveUninitialized: false
}));

app.use(express.json());
app.use(parseCookie());
app.use(parseQuery());
app.use(passport.initialize());
app.use('/api/users', passport.authenticate('jwt', {session: false}), usersRouter);
app.use('/api/products', passport.authenticate('jwt', {session: false}), productsRouter);
app.use('/auth', authRouter);
app.use(errors.notFound);

module.exports = app;
