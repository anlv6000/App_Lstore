const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Import routes
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/carts');
const deliveryRoutes = require('./routes/deliveries');

// Sử dụng routes
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/carts', cartRoutes);
app.use('/deliveries', deliveryRoutes);

// Khởi chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API running at http://localhost:${PORT}`));