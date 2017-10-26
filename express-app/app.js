const express = require('express');
const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users');
const errors = require('./helpers/errors');
const parseCookie = require('./middlewares/parseCookie');
const parseQuery = require('./middlewares/parseQuery');

const app = express();

app.use(express.json());
app.use(parseCookie());
app.use(parseQuery());
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use(errors.notFound);

module.exports = app;
