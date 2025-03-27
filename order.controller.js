const Order = require('../models/order.model');


exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
   
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
    
        res.status(200).json(order);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};


exports.createOrder = async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};