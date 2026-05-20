import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({

  salonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Salon"
  },

  name: String,

  price: Number,

  duration: Number,

  category: String

}, { timestamps: true });

export default mongoose.model("Service", serviceSchema);