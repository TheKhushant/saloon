import Barber from "../models/Barber.js";

export const createBarber = async (req, res) => {
  try {

    const barber = await Barber.create(req.body);

    res.status(201).json(barber);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getBarbers = async (req, res) => {
  try {

    const barbers = await Barber.find();

    res.json(barbers);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};