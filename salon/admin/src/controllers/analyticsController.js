import Booking from "../models/Booking.js";

export const getAnalytics = async (req,res)=>{

  const totalBookings = await Booking.countDocuments();

  const completedBookings = await Booking.countDocuments({
    status:"completed"
  });

  res.json({
    totalBookings,
    completedBookings
  });

};