const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Lấy toàn bộ người dùng
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách người dùng' });
  }
});

// ✅ Lấy chi tiết người dùng theo ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server khi lấy người dùng' });
  }
});

// ✅ Tạo người dùng mới
router.post('/', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ error: 'Lỗi khi tạo người dùng' });
  }
});

// ✅ Cập nhật người dùng
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ error: 'Không tìm thấy người dùng để cập nhật' });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: 'Lỗi khi cập nhật người dùng' });
  }
});

// ✅ Xóa người dùng
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: 'Không tìm thấy người dùng để xóa' });
    res.json({ message: 'Đã xóa người dùng thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi xóa người dùng' });
  }
});

module.exports = router;
