const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  barber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Barber',
    required: true
  },
  date: { type: String, required: true }, // YYYY-MM-DD
  time: { type: String, required: true },
  extras: [{
    name: String,
    price: Number
  }],
  specialInstructions: String,
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true }
  },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  bookingId: { type: String, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);