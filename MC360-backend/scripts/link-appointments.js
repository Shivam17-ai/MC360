const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Hospital = require('../src/models/Hospital.model');
const Doctor = require('../src/models/Doctor.model');
const Patient = require('../src/models/Patient.model');
const Appointment = require('../src/models/Appointment.model');

async function run() {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI not set in environment.');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB...');

        const hospital = await Hospital.findOne();
        if (!hospital) {
            console.error('No hospital found. Create one first.');
            process.exit(1);
        }

        console.log(`Setting bed capacity for hospital: ${hospital.name}`);
        hospital.totalBeds = 100;
        hospital.availableBeds = 28;
        await hospital.save();
        console.log('Hospital bed capacities updated.');

        // Link existing appointments to doctor's hospital or the main hospital
        const appointments = await Appointment.find();
        console.log(`Checking ${appointments.length} appointments...`);

        let updatedAppointments = 0;
        for (const appt of appointments) {
            if (!appt.hospital) {
                const doc = await Doctor.findById(appt.doctor);
                appt.hospital = doc?.hospital || hospital._id;
                await appt.save();
                updatedAppointments++;
                console.log(`Linked appointment ${appt._id} to hospital ${appt.hospital}`);
            }
        }
        console.log(`Finished. Linked ${updatedAppointments} appointments.`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

run();
