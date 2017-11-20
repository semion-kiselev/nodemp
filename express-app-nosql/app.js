const express = require('express');
const session = require('express-session');
const sessionConfig = require('./config/session');
const passport = require('passport');
require('./config/auth');
const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users');
const citiesRouter = require('./routes/cities');
const authRouter = require('./routes/auth');
const errors = require('./helpers/errors');

const app = express();

app.use(session(sessionConfig));
app.use(express.json());
app.use(passport.initialize());
app.use('/api/users', passport.authenticate('jwt', {session: false}), usersRouter);
app.use('/api/products', passport.authenticate('jwt', {session: false}), productsRouter);
app.use('/api/cities', passport.authenticate('jwt', {session: false}), citiesRouter);
app.use('/auth', authRouter);
app.use(errors.notFound);
app.use(errors.validationErrors);
app.use(errors.productionErrors);

module.exports = app;
