import express from "express";
import {
getBookings,
updateBookingStatus
} from "../controllers/bookingController.js";

const router = express.Router();

router.get("/",getBookings);
router.put("/:id",updateBookingStatus);

export default router;