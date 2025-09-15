const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  items: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      quantity: Number
    }
  ],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cart', cartSchema);