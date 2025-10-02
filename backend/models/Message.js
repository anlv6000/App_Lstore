const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  from: { type: String, required: true },         // username người gửi
  to:   { type: String, required: true },         // username người nhận
  message: { type: String, required: true },      // nội dung tin nhắn
  timestamp: { type: Date, default: Date.now },   // thời gian gửi
  conversationId: { type: String, required: true }, // gom hội thoại theo user
  read: { type: Boolean, default: false }         // trạng thái đã đọc
});

// Tạo index để tối ưu truy vấn theo hội thoại và thời gian
messageSchema.index({ conversationId: 1, timestamp: -1 });

module.exports = mongoose.model('Message', messageSchema);