import mongoose from "mongoose";

const barberSchema = new mongoose.Schema({

  salonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Salon"
  },

  name: String,

  specialty: String,

  experience: Number,

  available: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

export default mongoose.model("Barber", barberSchema);