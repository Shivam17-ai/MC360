import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
    date: Date,
    status: String,
  },
  { timestamps: true }
);

const Appointment = mongoose.model(
  "Appointment",
  AppointmentSchema
);

export default Appointment;