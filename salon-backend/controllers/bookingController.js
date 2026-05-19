const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Barber = require('../models/Barber');

exports.createBooking = async (req, res) => {
  try {
    const { serviceId, barberId, date, time, extras, specialInstructions, customer, totalPrice } = req.body;

    // Check if slot is already booked
    const existingBooking = await Booking.findOne({ barber: barberId, date, time, status: 'confirmed' });
    if (existingBooking) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    const booking = new Booking({
      service: serviceId,
      barber: barberId,
      date,
      time,
      extras: extras || [],
      specialInstructions,
      customer,
      totalPrice,
      bookingId: `BOOK${Date.now()}`
    });

    await booking.save();
    res.status(201).json({ message: 'Booking successful', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('service').populate('barber');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};