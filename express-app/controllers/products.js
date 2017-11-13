const omit = require('ramda/src/omit');
const {Product, User} = require('../models');

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch(err) {
        throw err;
    }
};

exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(+req.params.id);

        if (!product) {
            res.status(404).end('Product Not Found');
        }

        res.json(product);
    } catch(err) {
        throw err;
    }
};

exports.getProductReviewers = async (req, res) => {
    try {
        const product = await Product.findById(+req.params.id, {
            include: [
                {model: User}
            ]
        });

        if (!product) {
            res.status(404).end('Product Not Found');
        }

        res.json(product.Users);
    } catch(err) {
        throw err;
    }
};

exports.addProduct = async (req, res) => {
    try {
        const product = req.body;
        const productWithoutReviewers = omit(['reviewers'], product);
        const createdProduct = await Product.create(productWithoutReviewers);
        await createdProduct.setUsers(product.reviewers);

        res.json(createdProduct);
    } catch(err) {
        throw err;
    }
};