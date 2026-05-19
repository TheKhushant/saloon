const mongoose = require('mongoose');

const barberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  available: { type: Boolean, default: true }
});

module.exports = mongoose.model('Barber', barberSchema);