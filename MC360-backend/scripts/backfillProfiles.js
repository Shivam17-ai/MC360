/*
Backfill missing Doctor and Patient profiles for existing users.
Run from MC360-backend folder:
  node scripts/backfillProfiles.js

This script is idempotent and will only create profiles for users that don't already have them.
*/

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

const User = require('../src/models/User.model');
const Doctor = require('../src/models/Doctor.model');
const Patient = require('../src/models/Patient.model');

const generateSlots = (startTime, endTime, durationMins) => {
  const slots = [];
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  let current = startHour * 60 + startMin;
  const end = endHour * 60 + endMin;

  while (current < end) {
    const currentHour = Math.floor(current / 60);
    const currentMin = current % 60;
    const nextMinutes = current + durationMins;
    const nextHour = Math.floor(nextMinutes / 60);
    const nextMin = nextMinutes % 60;

    slots.push({
      startTime: `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`,
      endTime: `${String(nextHour).padStart(2, '0')}:${String(nextMin).padStart(2, '0')}`,
      isBooked: false,
    });

    current = nextMinutes;
  }
  return slots;
};

const createDefaultAvailability = () => {
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
  return days.map(day => ({
    day,
    isAvailable: true,
    slots: generateSlots('09:00','17:00',30),
  }));
};

async function main(){
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI not set in environment. Aborting.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to DB');

  const doctorUsers = await User.find({ role: 'doctor' });
  const patientUsers = await User.find({ role: 'patient' });

  let createdDoctors = 0;
  for (const u of doctorUsers) {
    const exists = await Doctor.findOne({ user: u._id });
    if (!exists) {
      await Doctor.create({ user: u._id, specialization: 'General', availability: createDefaultAvailability() });
      createdDoctors++;
      console.log(`Created Doctor profile for user ${u.email} (${u._id})`);
    }
  }

  let createdPatients = 0;
  for (const u of patientUsers) {
    const exists = await Patient.findOne({ user: u._id });
    if (!exists) {
      await Patient.create({ user: u._id });
      createdPatients++;
      console.log(`Created Patient profile for user ${u.email} (${u._id})`);
    }
  }

  console.log(`Done. Doctors created: ${createdDoctors}. Patients created: ${createdPatients}`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});