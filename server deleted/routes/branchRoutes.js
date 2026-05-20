import express from "express";
import {
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch
} from "../controllers/branchController.js";

const router = express.Router();

/* GET all branches */
router.get("/", getBranches);

/* CREATE branch */
router.post("/", createBranch);

/* UPDATE branch */
router.put("/:id", updateBranch);

/* DELETE branch */
router.delete("/:id", deleteBranch);

export default router;