const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  address: {
    street: { type: String, required: true },
    city:   { type: String, required: true },
    state:  { type: String, required: true },
    pincode:{ type: String, required: true }
  },
  rentAmount: {
    type: Number,
    required: true
  },
  bedrooms: {
    type: Number,
    required: true
  },
  bathrooms: {
    type: Number,
    required: true
  },
  furnished: {
    type: Boolean,
    default: false
  },
  available: {
    type: Boolean,
    default: true
  },
  images: [{ type: String }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);