const mongoose = require('mongoose');

const productCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  price: {
    type: Number,
  },
  user: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
}, {
  timestamps: true
});

module.exports = mongoose.model('ProductCategory', productCategorySchema);
