import mongoose from "mongoose";

const salonSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  address: String,

  city: String,

  phone: String,

  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor"
  },

  openingTime: String,

  closingTime: String,

  rating: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

export default mongoose.model("Salon", salonSchema);