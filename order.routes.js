const express = require('express');
const router = express.Router();

const { getOrders, getOrder, createOrder } = require('../controllers/order.controller');

router.get('/', getOrders);
router.get('/:id', getOrder);
router.post('/', createOrder);

module.exports = router;