const mongoose = require('mongoose');
require('dotenv').config();

const Hospital = require('./src/models/Hospital.model');
const Doctor = require('./src/models/Doctor.model');
const Patient = require('./src/models/Patient.model');
const Appointment = require('./src/models/Appointment.model');
const QueueToken = require('./src/models/QueueToken.model');

async function check() {
    console.log("Connecting to:", process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected successfully!");

    const hospitals = await Hospital.find();
    console.log(`\nHospitals found: ${hospitals.length}`);
    for (const h of hospitals) {
        console.log(`- ${h.name} (${h._id}): totalBeds=${h.totalBeds}, availableBeds=${h.availableBeds}, doctorsCount=${h.doctors.length}`);
    }

    const doctors = await Doctor.find();
    console.log(`\nDoctors found: ${doctors.length}`);
    for (const d of doctors) {
        console.log(`- Doctor ID: ${d._id}, Specialization: ${d.specialization}, Hospital: ${d.hospital}`);
    }

    const patients = await Patient.find();
    console.log(`\nPatients found: ${patients.length}`);
    for (const p of patients) {
        console.log(`- Patient ID: ${p._id}, Hospital: ${p.hospital}`);
    }

    const appointments = await Appointment.find();
    console.log(`\nAppointments found: ${appointments.length}`);
    for (const a of appointments) {
        console.log(`- Appointment: ${a._id}, Hospital: ${a.hospital}, Doctor: ${a.doctor}, Date: ${a.date}`);
    }

    const tokens = await QueueToken.find();
    console.log(`\nQueueTokens found: ${tokens.length}`);
    for (const t of tokens) {
        console.log(`- Token: ${t._id}, Hospital: ${t.hospital}, Doctor: ${t.doctor}, Status: ${t.status}, calledAt: ${t.calledAt}, date: ${t.date}`);
    }

    await mongoose.disconnect();
}

check().catch(console.error);
