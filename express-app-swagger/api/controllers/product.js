const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const {isObjectId} = require('../helpers/validator');

function getProducts(req, res, next) {
    Product.find()
        .then(products => res.json(products))
        .catch(next);
}

function getProduct(req, res, next) {
    const id = req.swagger.params.productId.value;

    if (!isObjectId(id)) {
        return res.status(400).end();
    }

    Product.findById(id)
        .then((product) => {
            if (!product) {
                return res.status(404).end('Product Not Found');
            }

            return res.json(product);
        })
        .catch(next);
}

function getProductReviewers(req, res, next) {
    const id = req.swagger.params.productId.value;

    if (!isObjectId(id)) {
        return res.status(400).end();
    }

    Product.findById(id).populate('reviewers')
        .then((product) => {
            if (!product) {
                return res.status(404).end('Product Not Found');
            }

            return res.json(product.reviewers);
        })
        .catch(next);
}

function addProduct(req, res, next) {
    Product.create(req.body)
        .then(product => res.json(product))
        .catch(next);
}

function deleteProduct(req, res, next) {
    const id = req.swagger.params.productId.value;

    if (!isObjectId(id)) {
        return res.status(400).end();
    }

    Product.findByIdAndRemove(id)
        .then(() => res.status(200).end())
        .catch(next);
}

module.exports = {
    getProducts,
    getProduct,
    getProductReviewers,
    addProduct,
    deleteProduct
};
