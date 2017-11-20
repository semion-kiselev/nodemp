const express = require('express');
const router = express.Router();
const {getProducts, getProduct, getProductReviewers, addProduct, deleteProduct} = require('../controllers/products');

router.get('/', getProducts);
router.get('/:id', getProduct);
router.get('/:id/reviewers', getProductReviewers);
router.post('/', addProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
