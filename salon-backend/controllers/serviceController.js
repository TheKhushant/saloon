const Service = require('../models/Service');

exports.getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createService = async (req, res) => {
  try {
    const { name, price, icon, description } = req.body;

    if (!name || typeof price !== 'number') {
      return res.status(400).json({ message: 'Service name and numeric price are required' });
    }

    const service = new Service({ name, price, icon, description });
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
