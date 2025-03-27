const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct } = require('../controllers/product.controller');

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', createProduct);
router.put('/', updateProduct);

module.exports = router;
