import Vendor from "../models/Vendor.js";

export const getVendors = async (req,res)=>{
  const vendors = await Vendor.find();
  res.json(vendors);
};

export const createVendor = async (req,res)=>{
  const vendor = await Vendor.create(req.body);
  res.json(vendor);
};

export const updateVendor = async (req,res)=>{
  const vendor = await Vendor.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new:true }
  );

  res.json(vendor);
};

export const deleteVendor = async (req,res)=>{
  await Vendor.findByIdAndDelete(req.params.id);
  res.json({message:"Vendor deleted"});
};