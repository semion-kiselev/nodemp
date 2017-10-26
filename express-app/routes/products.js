const express = require('express');
const router = express.Router();
const {getProducts, getProduct, getProductReviewers, addProduct} = require('../controllers/products');

router.get('/', getProducts);
router.get('/:id', getProduct);
router.get('/:id/reviewers', getProductReviewers);
router.post('/', addProduct);

module.exports = router;