import Branch from "../models/Branch.js";

/* GET ALL BRANCHES */

export const getBranches = async (req, res) => {
  try {

    const branches = await Branch.find().populate("vendorId");

    res.json(branches);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};


/* CREATE BRANCH */

export const createBranch = async (req, res) => {
  try {

    const branch = await Branch.create(req.body);

    res.status(201).json(branch);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};


/* UPDATE BRANCH */

export const updateBranch = async (req, res) => {
  try {

    const branch = await Branch.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(branch);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};


/* DELETE BRANCH */

export const deleteBranch = async (req, res) => {
  try {

    await Branch.findByIdAndDelete(req.params.id);

    res.json({ message: "Branch deleted" });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};