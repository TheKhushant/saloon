// Run once: node seed.js
const connectDB = require('./config/db');
const Service = require('./models/Service');
const Barber = require('./models/Barber');

const servicesData = [ /* copy from your frontend */ ];
const barbersData = [ /* copy from your frontend */ ];

const seedDB = async () => {
  await connectDB();
  await Service.deleteMany();
  await Barber.deleteMany();
  await Service.insertMany(servicesData);
  await Barber.insertMany(barbersData);
  console.log('Data seeded');
  process.exit();
};

seedDB();