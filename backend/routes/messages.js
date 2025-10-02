const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// ✅ Lấy toàn bộ tin nhắn theo conversationId (username của user)
router.get('/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId }).sort({ timestamp: 1 }); // sắp xếp theo thời gian
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy tin nhắn' });
  }
});

// ✅ Gửi tin nhắn mới
router.post('/', async (req, res) => {
  try {
    const { from, to, message, conversationId } = req.body;

    if (!from || !to || !message || !conversationId) {
      return res.status(400).json({ error: 'Thiếu thông tin tin nhắn' });
    }

    const newMessage = new Message({
      from,
      to,
      message,
      conversationId,
      read: false
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi gửi tin nhắn' });
  }
});

// ✅ (Tuỳ chọn) Lấy danh sách các conversationId đã từng nhắn với admin
router.get('/conversations/list', async (req, res) => {
  try {
    const conversations = await Message.distinct('conversationId');
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách hội thoại' });
  }
});

module.exports = router;