const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// ✅ Tạo đánh giá mới
router.post('/', async (req, res) => {
  try {
    const { username, productId, rating, comment } = req.body;

    const newReview = new Review({
      username,
      productId,
      rating,
      comment,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const saved = await newReview.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: 'Người dùng đã đánh giá sản phẩm này rồi' });
    } else {
      res.status(500).json({ error: 'Lỗi khi tạo đánh giá' });
    }
  }
});

// ✅ Lấy tất cả đánh giá theo productId
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy đánh giá' });
  }
});

// ✅ Cập nhật đánh giá (nếu cho phép chỉnh sửa)
router.put('/:id', async (req, res) => {
  try {
    const updated = await Review.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi cập nhật đánh giá' });
  }
});
// Thêm phản hồi vào đánh giá
router.post('/reply/:id', async (req, res) => {
  try {
    const { user, content } = req.body;

    const updated = await Review.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          replies: {
            user,
            content,
            repliedAt: new Date()
          }
        },
        updatedAt: new Date()
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi thêm phản hồi' });
  }
});

// ✅ Xóa đánh giá
router.delete('/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa đánh giá thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi xóa đánh giá' });
  }
});

module.exports = router;
