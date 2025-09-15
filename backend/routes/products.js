const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Lấy toàn bộ sản phẩm
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// ✅ Lấy chi tiết sản phẩm theo ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }
    res.json(product);
  } catch (err) {
    console.error('❌ Lỗi khi lấy chi tiết sản phẩm:', err);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

module.exports = router;
