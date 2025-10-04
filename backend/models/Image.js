const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // mỗi user chỉ có 1 document
  images: [
    {
      filename: { type: String, required: true },            // tên file sau khi xử lý
      url: { type: String, required: true },                 // đường dẫn ảnh
      format: { type: String, default: 'webp' },             // định dạng ảnh đã nén
      sizeKB: { type: Number },                              // dung lượng ảnh
      resolution: { type: String },                          // ví dụ: "640x480"
      uploadedAt: { type: Date, default: Date.now }          // thời gian tải lên
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

// Tạo index để tìm kiếm nhanh theo username
imageSchema.index({ username: 1 });

module.exports = mongoose.model('Image', imageSchema);
