import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";

const createAdmin = async () => {

  const adminExists = await Admin.findOne({ email: "admin@gmail.com" });

  if (!adminExists) {

    const hashedPassword = await bcrypt.hash("123456", 10);

    await Admin.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword
    });

    console.log("Default admin created");
  }

};

export default createAdmin;