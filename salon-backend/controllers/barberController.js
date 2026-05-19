const Barber = require('../models/Barber');

exports.getBarbers = async (req, res) => {
  try {
    const barbers = await Barber.find();
    res.json(barbers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createBarber = async (req, res) => {
  try {
    const { name, specialty, available = true } = req.body;

    if (!name || !specialty) {
      return res.status(400).json({ message: 'Barber name and specialty are required' });
    }

    const barber = new Barber({ name, specialty, available });
    await barber.save();
    res.status(201).json(barber);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
