const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: false 
  },
  address: {
    recipient: { type: String, required: true },
    phone:     { type: String, required: true },
    street:    { type: String, required: true },
    city:      { type: String, required: true },
    district:  { type: String, required: true }
  },
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered'],
    default: 'pending'
  },
  deliveryDate: { type: Date },
  createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('Delivery', deliverySchema);