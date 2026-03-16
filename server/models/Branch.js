import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({

  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor"
  },

  name: String,

  address: String,

  city: String,

  phone: String

}, { timestamps: true });

export default mongoose.model("Branch", branchSchema);