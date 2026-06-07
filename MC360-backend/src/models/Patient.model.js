import mongoose from 'mongoose'

const patientSchema = new mongoose.Schema({
  user: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
    unique:   true,
  },
  dob:         { type: Date },
  gender:      { type: String, enum: ['male', 'female', 'other'] },
  bloodGroup:  { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  height:      { type: Number }, // cm
  weight:      { type: Number }, // kg

  address: {
    street:  String,
    city:    String,
    state:   String,
    pincode: String,
    country: { type: String, default: 'India' },
  },

  emergencyContact: {
    name:         String,
    phone:        String,
    relationship: String,
  },

  allergies:      [{ type: String }],
  medicalHistory: [{ type: String }],
  currentMeds:    [{ type: String }],

  insurance: {
    provider:   String,
    policyNo:   String,
    expiresAt:  Date,
  },

  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'Hospital',
  },
}, { timestamps: true })

export default mongoose.model('Patient', patientSchema)