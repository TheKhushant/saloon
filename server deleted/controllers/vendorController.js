import Vendor from "../models/Vendor.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

/* ---------------- REGISTER ---------------- */

export const registerVendor = async (req, res) => {

  try {

    const { name, email, phone, password } = req.body;

    const vendorExists = await Vendor.findOne({ email });

    if (vendorExists) {
      return res.status(400).json({ message: "Vendor already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const vendor = await Vendor.create({
      name,
      email,
      phone,
      password: hashedPassword
    });

    res.status(201).json({
      _id: vendor._id,
      name: vendor.name,
      email: vendor.email,
      token: generateToken(vendor._id)
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


/* ---------------- LOGIN ---------------- */

export const loginVendor = async (req, res) => {

  try {

    const { email, password } = req.body;

    const vendor = await Vendor.findOne({ email });

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const isMatch = await bcrypt.compare(password, vendor.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.json({
      _id: vendor._id,
      name: vendor.name,
      email: vendor.email,
      token: generateToken(vendor._id)
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};