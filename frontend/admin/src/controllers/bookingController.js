import Booking from "../models/Booking.js";

export const getBookings = async (req,res)=>{
  const bookings = await Booking.find()
    .populate("vendorId")
    .populate("branchId");

  res.json(bookings);
};

export const updateBookingStatus = async (req,res)=>{
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new:true }
  );

  res.json(booking);
};