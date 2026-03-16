import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({

  name: String,

  email: String,

  phone: String,

  salonName: String,

  password: String,

  status: {
    type: String,
    default: "active"
  }

}, { timestamps: true });

export default mongoose.model("Vendor", vendorSchema);