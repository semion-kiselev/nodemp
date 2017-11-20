const mongoose = require('mongoose');
const Product = mongoose.model('Product');

exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch(err) {
        next(err);
    }
};

exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).end('Product Not Found');
        }

        return res.json(product);
    } catch(err) {
        next(err);
    }
};

exports.getProductReviewers = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('reviewers');

        if (!product) {
            return res.status(404).end('Product Not Found');
        }

        return res.json(product.reviewers);
    } catch(err) {
        next(err);
    }
};

exports.addProduct = async (req, res, next) => {
    try {
        const createdProduct = await Product.create(req.body);
        res.json(createdProduct);
    } catch(err) {
        next(err);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        await Product.findByIdAndRemove(req.params.id);
        res.status(200).end();
    } catch(err) {
        next(err);
    }
};
