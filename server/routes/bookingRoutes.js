import express from "express";
import {
  createBooking,
  getBookings,
  updateBookingStatus
} from "../controllers/bookingController.js";
import protectVendor from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/vendor", protectVendor, getBookings);
router.get("/", getBookings);

router.put("/:id", updateBookingStatus);

export default router;