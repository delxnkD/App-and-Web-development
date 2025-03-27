const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/product.model');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const seedProducts = async () => {
  try {
    const productCount = await Product.countDocuments();

    if (productCount === 0) {
      const products = [
        // Laptops
        {
          name: "Lenovo ThinkPad X1 Carbon",
          description: "A powerful and budget-friendly laptop for multitasking with AMD Ryzen 5 processor and 16GB RAM.",
          price: 499.99,
          stock: 50,
          category: "laptops",
          image: "https://placehold.co/600x400/6366F1/FFFFFF/png?text=Acer+Aspire+5",
          featured: true,
        },
        {
          name: "MSI GS66 Stealth",
          description: "A high-end ultrabook with stunning 4K display, Intel i7 processor, and premium build quality.",
          price: 1299.99,
          stock: 15,
          category: "laptops",
          image: "https://placehold.co/600x400/6366F1/FFFFFF/png?text=Dell+XPS+13",
          featured: true
        },
        {
          name: "MacBook Pro 16",
          description: "Professional-grade laptop with M4 Pro chip, 14-inch Retina display, and exceptional battery life.",
          price: 1999.99,
          stock: 25,
          category: "laptops",
          image: "https://placehold.co/600x400/6366F1/FFFFFF/png?text=MacBook+Pro+14",
          featured: true
        },
        
        // Smartphones
        {
          name: "Apple iPhone 14 Pro",
          description: "The latest iPhone with advanced camera features, A16 Bionic chip, and Dynamic Island display.",
          price: 1199.99,
          stock: 30,
          category: "smartphones",
          image: "https://placehold.co/600x400/0EA5E9/FFFFFF/png?text=iPhone+14+Pro",
          featured: true,
        },
        {
          name: "Samsung Galaxy S23 Ultra",
          description: "Flagship Android phone with S Pen, 200MP camera, and Snapdragon 8 Gen 2 processor.",
          price: 1199.99,
          stock: 40,
          category: "smartphones",
          image: "https://placehold.co/600x400/0EA5E9/FFFFFF/png?text=Galaxy+S23+Ultra",
          featured: true
        },
        {
          name: "Google Pixel 7 Pro",
          description: "Best-in-class camera system with Google's advanced AI features and clean Android experience.",
          price: 899.99,
          stock: 35,
          category: "smartphones",
          image: "https://placehold.co/600x400/0EA5E9/FFFFFF/png?text=Pixel+7+Pro"
        },

        // Tablets
        {
          name: "iPad Pro 12.9",
          description: "Professional tablet with M2 chip, Liquid Retina XDR display, and Apple Pencil support.",
          price: 1099.99,
          stock: 20,
          category: "tablets",
          image: "https://placehold.co/600x400/8B5CF6/FFFFFF/png?text=iPad+Pro+12.9",
          featured: true
        },
        {
          name: "Samsung Galaxy Tab S8 Ultra",
          description: "Large-screen tablet with S Pen, Snapdragon 8 Gen 1, and DeX mode for productivity.",
          price: 999.99,
          stock: 15,
          category: "tablets",
          image: "https://placehold.co/600x400/8B5CF6/FFFFFF/png?text=Galaxy+Tab+S8+Ultra"
        },

        // Wearables
        {
          name: "Samsung Galaxy Watch 6",
          description: "Advanced smartwatch with health monitoring, sleep tracking, and 40-hour battery life.",
          price: 349.99,
          stock: 20,
          category: "wearables",
          image: "https://placehold.co/600x400/10B981/FFFFFF/png?text=Galaxy+Watch+6",
          featured: true
        },
        {
          name: "Apple Watch Series 8",
          description: "Premium smartwatch with ECG, blood oxygen monitoring, and crash detection.",
          price: 399.99,
          stock: 25,
          category: "wearables",
          image: "https://placehold.co/600x400/10B981/FFFFFF/png?text=Apple+Watch+Series+8"
        },
        {
          name: "Fitbit Sense 2",
          description: "Health-focused smartwatch with stress management, heart rate tracking, and 6+ days battery.",
          price: 299.99,
          stock: 30,
          category: "wearables",
          image: "https://placehold.co/600x400/10B981/FFFFFF/png?text=Fitbit+Sense+2"
        },

        // Accessories
        {
          name: "Logitech MX Master 3",
          description: "Premium wireless mouse with precision tracking, customizable buttons, and ergonomic design.",
          price: 99.99,
          stock: 100,
          category: "accessories",
          image: "https://placehold.co/600x400/F43F5E/FFFFFF/png?text=MX+Master+3",
          featured: true
        },
        {
          name: "Apple AirPods Pro 2",
          description: "Wireless earbuds with active noise cancellation, spatial audio, and MagSafe charging.",
          price: 249.99,
          stock: 45,
          category: "accessories",
          image: "https://placehold.co/600x400/F43F5E/FFFFFF/png?text=AirPods+Pro+2",
          featured: true
        },
        {
          name: "Samsung Galaxy Buds2 Pro",
          description: "Premium wireless earbuds with intelligent ANC, 360° audio, and voice detection.",
          price: 199.99,
          stock: 60,
          category: "accessories",
          image: "https://placehold.co/600x400/F43F5E/FFFFFF/png?text=Galaxy+Buds2+Pro"
        },
        {
          name: "Dell 27\" 4K Monitor",
          description: "Professional-grade monitor with HDR support, 99% sRGB coverage, and USB-C connectivity.",
          price: 399.99,
          stock: 30,
          category: "accessories",
          image: "https://placehold.co/600x400/F43F5E/FFFFFF/png?text=Dell+4K+Monitor"
        },

        // Gaming
        {
          name: "PlayStation 5",
          description: "Next-gen gaming console with 4K graphics, ray tracing, and ultra-fast SSD storage.",
          price: 499.99,
          stock: 15,
          category: "gaming",
          image: "https://placehold.co/600x400/F97316/FFFFFF/png?text=PlayStation+5",
          featured: true
        },
        {
          name: "Xbox Series X",
          description: "Powerful gaming console with 4K gaming, Game Pass subscription, and backward compatibility.",
          price: 499.99,
          stock: 20,
          category: "gaming",
          image: "https://placehold.co/600x400/F97316/FFFFFF/png?text=Xbox+Series+X"
        },
        {
          name: "Nintendo Switch OLED",
          description: "Handheld gaming console with 7-inch OLED screen, detachable controllers, and dock mode.",
          price: 349.99,
          stock: 25,
          category: "gaming",
          image: "https://placehold.co/600x400/F97316/FFFFFF/png?text=Switch+OLED"
        }
      ];

      await Product.insertMany(products);
      console.log("✅ 20 products have been seeded successfully!");
    } else {
      console.log("ℹ️ Products already exist in the database. Seeding skipped.");
    }
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    process.exit(1);
  }
};

seedProducts();
