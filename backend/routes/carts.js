const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// Lấy toàn bộ giỏ hàng
router.get('/', async (req, res) => {
  try {
    const carts = await Cart.find();
    res.json(carts);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách giỏ hàng' });
  }
});

// ✅ Lấy chi tiết giỏ hàng theo ID
router.get('/:id', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) return res.status(404).json({ error: 'Không tìm thấy giỏ hàng' });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server khi lấy giỏ hàng' });
  }
});

// ✅ Thêm giỏ hàng mới
router.post('/', async (req, res) => {
  try {
    const newCart = new Cart(req.body);
    const savedCart = await newCart.save();
    res.status(201).json(savedCart);
  } catch (err) {
    res.status(400).json({ error: 'Lỗi khi tạo giỏ hàng' });
  }
});

// ✅ Cập nhật giỏ hàng
router.put('/:id', async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCart) return res.status(404).json({ error: 'Không tìm thấy giỏ hàng để cập nhật' });
    res.json(updatedCart);
  } catch (err) {
    res.status(400).json({ error: 'Lỗi khi cập nhật giỏ hàng' });
  }
});

// ✅ Xóa giỏ hàng
router.delete('/:id', async (req, res) => {
  try {
    const deletedCart = await Cart.findByIdAndDelete(req.params.id);
    if (!deletedCart) return res.status(404).json({ error: 'Không tìm thấy giỏ hàng để xóa' });
    res.json({ message: 'Đã xóa giỏ hàng thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi xóa giỏ hàng' });
  }
});

module.exports = router;
