const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['available', 'preorder'], required: true },
  price: { type: Number, required: true },
  scale: { type: String }, // ví dụ: "1/144", "1/100"
  brand: { type: String },
  stock: { type: Number, default: 0 },
  releaseDate: { type: Date },
  images: { type: [String], default: [] }, // ✅ Mảng ảnh
  description: { type: String }, // nếu muốn dùng cho chi tiết sản phẩm
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);
