import mongoose from 'mongoose'

const medicineItemSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  dose:         { type: String },
  frequency:    { type: String },
  duration:     { type: String },
  instructions: { type: String },
}, { _id: false })

const prescriptionSchema = new mongoose.Schema({
  doctor: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'Doctor',
    required: true,
  },
  patient: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'Appointment',
  },

  diagnosis:    { type: String },
  medicines:    [medicineItemSchema],
  notes:        { type: String },
  followUpDate: { type: Date },

  isActive: { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.model('Prescription', prescriptionSchema)