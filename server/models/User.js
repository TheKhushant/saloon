import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String
  },

  password: {
    type: String
  },

  role: {
    type: String,
    enum: ["user", "vendor", "admin"],
    default: "user"
  }

}, { timestamps: true });

export default mongoose.model("User", userSchema);