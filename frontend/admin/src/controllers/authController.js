import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const loginAdmin = async(req,res)=>{

  const {email,password} = req.body;

  const admin = await Admin.findOne({email});

  if(!admin){
    return res.status(404).json({message:"Admin not found"});
  }

  const match = await bcrypt.compare(password,admin.password);

  if(!match){
    return res.status(401).json({message:"Invalid password"});
  }

  res.json({
    id:admin._id,
    email:admin.email,
    token:generateToken(admin._id)
  });

};