const mongoose = require('mongoose');
const Doctor = require('./src/models/Doctor.model');
const Patient = require('./src/models/Patient.model');
const Hospital = require('./src/models/Hospital.model');
const connectDB = require('./src/config/db');

const fixLinking = async () => {
    try {
        await connectDB();
        console.log('Connected to DB...');

        const hospital = await Hospital.findOne();
        if (!hospital) {
            console.error('No hospital found in DB. Please create a hospital first.');
            process.exit(1);
        }

        console.log(`Linking all doctors and patients to hospital: ${hospital.name} (${hospital._id})`);

        const doctorsUpdated = await Doctor.updateMany(
            { hospital: { $exists: false } },
            { $set: { hospital: hospital._id } }
        );
        console.log(`Updated ${doctorsUpdated.modifiedCount} doctors.`);

        const patientsUpdated = await Patient.updateMany(
            { hospital: { $exists: false } },
            { $set: { hospital: hospital._id } }
        );
        console.log(`Updated ${patientsUpdated.modifiedCount} patients.`);

        // Also ensure hospital has these doctors in its array
        const allDocIds = await Doctor.find({ hospital: hospital._id }).distinct('_id');
        hospital.doctors = allDocIds;
        await hospital.save();
        console.log('Hospital doctors array balanced.');

        console.log('Fix complete!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixLinking();
