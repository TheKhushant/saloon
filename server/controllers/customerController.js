import Customer from "../models/Customer.js";

/* GET ALL CUSTOMERS */

export const getCustomers = async (req, res) => {
  try {

    const customers = await Customer.find();

    res.json(customers);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};


/* CREATE CUSTOMER */

export const createCustomer = async (req, res) => {
  try {

    const customer = await Customer.create(req.body);

    res.status(201).json(customer);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};


/* DELETE CUSTOMER */

export const deleteCustomer = async (req, res) => {
  try {

    await Customer.findByIdAndDelete(req.params.id);

    res.json({ message: "Customer deleted" });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};