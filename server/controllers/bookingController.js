import Booking from "../models/Booking.js";

export const createBooking = async (req, res) => {
  try {

    const booking = await Booking.create(req.body);

    res.status(201).json(booking);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getBookings = async (req, res) => {
  try {

    const bookings = await Booking.find();

    res.json(bookings);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateBookingStatus = async (req, res) => {
  try {

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(booking);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};