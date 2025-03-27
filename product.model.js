const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true,},
    image: { type: String, default:"https://placehold.co/600x400" },
    category: { type: String, required: true },
    featured: { type: Boolean, default: false },
 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
