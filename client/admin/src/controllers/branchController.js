import Branch from "../models/Branch.js";

export const getBranches = async (req,res)=>{
  const branches = await Branch.find().populate("vendorId");
  res.json(branches);
};

export const createBranch = async (req,res)=>{
  const branch = await Branch.create(req.body);
  res.json(branch);
};

export const updateBranch = async (req,res)=>{
  const branch = await Branch.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new:true }
  );

  res.json(branch);
};

export const deleteBranch = async (req,res)=>{
  await Branch.findByIdAndDelete(req.params.id);
  res.json({message:"Branch removed"});
};