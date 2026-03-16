import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  salonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Salon"
  },

  barberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Barber"
  },

  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service"
  },

  date: String,

  time: String,

  totalPrice: Number,

  specialInstructions: String,

  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending"
  }

}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);