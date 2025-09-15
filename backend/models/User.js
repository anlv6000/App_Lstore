const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role:     { type: String, enum: ['customer', 'admin'], default: 'customer' }, // ✅ phân quyền
  phone:    { type: String }, // nếu cần xác thực SMS
  address:  { type: String }, // địa chỉ giao hàng
  createdAt:{ type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
