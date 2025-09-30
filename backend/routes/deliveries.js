const express = require('express');
const router = express.Router();
const Delivery = require('../models/Delivery');

// Lấy toàn bộ đơn giao hàng
router.get('/', async (req, res) => {
  try {
    const deliveries = await Delivery.find();
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách giao hàng' });
  }
});

// ✅ Lấy chi tiết đơn giao hàng theo ID
router.get('/:id', async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ error: 'Không tìm thấy đơn giao hàng' });
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server khi lấy đơn giao hàng' });
  }
});

// ✅ Lấy đơn giao hàng theo username
router.get('/username/:username', async (req, res) => {
  try {
    const deliveries = await Delivery.find({ username: req.params.username });
    if (deliveries.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy đơn giao hàng cho username này' });
    }
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server khi tìm đơn giao hàng theo username' });
  }
});

// ✅ Tạo đơn giao hàng mới
router.post('/', async (req, res) => {
  try {
    const newDelivery = new Delivery(req.body);
    const savedDelivery = await newDelivery.save();
    res.status(201).json(savedDelivery);
  } catch (err) {
    res.status(400).json({ error: 'Lỗi khi tạo đơn giao hàng' });
  }
});

// ✅ Cập nhật đơn giao hàng
router.put('/:id', async (req, res) => {
  try {
    const updatedDelivery = await Delivery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDelivery) return res.status(404).json({ error: 'Không tìm thấy đơn giao hàng để cập nhật' });
    res.json(updatedDelivery);
  } catch (err) {
    res.status(400).json({ error: 'Lỗi khi cập nhật đơn giao hàng' });
  }
});

// ✅ Xóa đơn giao hàng
router.delete('/:id', async (req, res) => {
  try {
    const deletedDelivery = await Delivery.findByIdAndDelete(req.params.id);
    if (!deletedDelivery) return res.status(404).json({ error: 'Không tìm thấy đơn giao hàng để xóa' });
    res.json({ message: 'Đã xóa đơn giao hàng thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi xóa đơn giao hàng' });
  }
});

module.exports = router;
