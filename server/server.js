import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

/* -------- ROUTES -------- */

//utils
import createAdmin from "./utils/createAdmin.js";

// Admin Auth
import authRoutes from "./routes/authRoutes.js";

// Admin Panel Routes
import vendorRoutes from "./routes/vendorRoutes.js";
import branchRoutes from "./routes/branchRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

// Platform Routes
import salonRoutes from "./routes/salonRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import barberRoutes from "./routes/barberRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();

//utils
connectDB();
createAdmin();

/* ---------------- DATABASE ---------------- */

connectDB();

/* ---------------- MIDDLEWARE ---------------- */

app.use(cors());
app.use(express.json());

/* ---------------- ROOT ---------------- */

app.get("/", (req, res) => {
  res.send("Salon SaaS API Running 🚀");
});

/* ---------------- AUTH ---------------- */

app.use("/api/auth", authRoutes);

/* ---------------- ADMIN PANEL ---------------- */

app.use("/api/vendors", vendorRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/analytics", analyticsRoutes);

/* ---------------- PLATFORM ---------------- */

app.use("/api/salons", salonRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/barbers", barberRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", paymentRoutes);

/* ---------------- ERROR HANDLER ---------------- */

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

/* ---------------- SERVER ---------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});