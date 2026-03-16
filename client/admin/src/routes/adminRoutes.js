import express from "express";

import {
 getVendors,
 createVendor,
 updateVendor,
 deleteVendor
} from "../controllers/vendorController.js";

import {
 getBranches,
 createBranch,
 updateBranch,
 deleteBranch
} from "../controllers/branchController.js";

import { getBookings } from "../controllers/bookingController.js";
import { getAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/vendors",getVendors);
router.post("/vendors",createVendor);
router.put("/vendors/:id",updateVendor);
router.delete("/vendors/:id",deleteVendor);

router.get("/branches",getBranches);
router.post("/branches",createBranch);
router.put("/branches/:id",updateBranch);
router.delete("/branches/:id",deleteBranch);

router.get("/bookings",getBookings);

router.get("/analytics",getAnalytics);

export default router;