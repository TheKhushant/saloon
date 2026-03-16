import express from "express";
import { createBarber, getBarbers } from "../controllers/barberController.js";

const router = express.Router();

router.post("/", createBarber);

router.get("/", getBarbers);

export default router;