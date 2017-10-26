const users = require('../mocks/users');
const products = require('../mocks/products');
const compose = require('ramda/src/compose');
const map = require('ramda/src/map');
const find = require('ramda/src/find');
const propEq = require('ramda/src/propEq');

exports.getProducts = (req, res) => {
    res.json(products);
};

exports.getProduct = (req, res) => {
    const product = find(propEq('id', +req.params.id), products);

    if (!product) {
        res.status(404).end('Product Not Found');
    }

    res.json(product);
};

exports.getProductReviewers = (req, res) => {
    const product = find(propEq('id', +req.params.id), products);

    if (!product) {
        res.status(404).end('Product Not Found');
    }

    const reviewersIds = product.reviewers;
    const reviewers = map(id => find(propEq('id', +id), users), reviewersIds);

    res.json(reviewers);
};

exports.addProduct = (req, res) => {
    const product = req.body;
    products.push(product);

    res.json(product);
};