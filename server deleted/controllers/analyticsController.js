import Vendor from "../models/Vendor.js";
import Booking from "../models/Booking.js";
import Customer from "../models/Customer.js";

export const getAnalytics = async (req, res) => {

  try {

    const totalVendors = await Vendor.countDocuments();

    const totalBookings = await Booking.countDocuments();

    const totalCustomers = await Customer.countDocuments();

    const completedBookings = await Booking.countDocuments({
      status: "completed"
    });

    res.json({
      totalVendors,
      totalBookings,
      totalCustomers,
      completedBookings
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};