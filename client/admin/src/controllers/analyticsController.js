import Booking from "../models/Booking.js";
import Vendor from "../models/Vendor.js";

export const getAnalytics = async (req,res)=>{

  const totalVendors = await Vendor.countDocuments();

  const totalBookings = await Booking.countDocuments();

  const completedBookings = await Booking.countDocuments({
    status:"completed"
  });

  res.json({
    totalVendors,
    totalBookings,
    completedBookings
  });

};