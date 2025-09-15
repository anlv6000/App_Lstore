const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  type: String, // "available" hoặc "preorder"
  price: Number,
  scale: String,
  brand: String,
  stock: Number,
  releaseDate: Date
});

module.exports = mongoose.model('Product', productSchema);