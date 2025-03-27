const Product = require('../models/product.model');

exports.getProducts = async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};
        
        // If category is provided, add it to the query
        if (category) {
            query.category = category;
        }
        
        const products = await Product.find(query);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No product with that id');

        const updatedProduct = await Product.findByIdAndUpdate(id, product);
        res.json(updatedProduct);
        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
   }  
