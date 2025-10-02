const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  username: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  replies: [
    {
      user: { type: String },
      content: { type: String },
      repliedAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

reviewSchema.index({ username: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
