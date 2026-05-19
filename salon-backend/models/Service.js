const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  icon: { type: String },
  description: String
});

module.exports = mongoose.model('Service', serviceSchema);