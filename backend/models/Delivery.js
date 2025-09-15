const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  address: {
    recipient: String,
    phone: String,
    street: String,
    city: String,
    district: String
  },
  status: String, // "pending", "shipped", "delivered"
  deliveryDate: Date
});

module.exports = mongoose.model('Delivery', deliverySchema);