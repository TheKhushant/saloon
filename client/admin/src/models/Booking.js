import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({

  customerName: String,

  phone: String,

  service: String,

  date: String,

  time: String,

  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor"
  },

  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch"
  },

  status: {
    type: String,
    default: "pending"
  }

}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);