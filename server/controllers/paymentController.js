import Payment from "../models/Payment.js";

/* GET PAYMENTS */

export const getPayments = async (req, res) => {
  try {

    const payments = await Payment.find().populate("bookingId");

    res.json(payments);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};


/* CREATE PAYMENT */

export const createPayment = async (req, res) => {
  try {

    const payment = await Payment.create(req.body);

    res.status(201).json(payment);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};