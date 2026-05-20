import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  salonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Salon"
  },

  rating: Number,

  comment: String

}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);