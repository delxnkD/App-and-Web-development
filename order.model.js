const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
    {
        customer: {
            fullName: { type: String, required: true },
            email: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            zip: { type: String, required: true }
        },
        items: [
            {
                name: { type: String, required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
                total: { type: Number, required: true },
                image: { type: String, required: true }
            }
        ],
        summary: {
            subtotal: { type: Number, required: true },
            tax: { type: Number, required: true },
            total: { type: Number, required: true }
        },
        status: { type: String, default: 'Processing' }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
