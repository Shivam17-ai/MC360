import mongoose from 'mongoose'

const slotSchema = new mongoose.Schema({
  day:       { type: String, enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] },
  startTime: String,
  endTime:   String,
  isActive:  { type: Boolean, default: true },
}, { _id: false })

const doctorSchema = new mongoose.Schema({
  user: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
    unique:   true,
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'Hospital',
  },

  specialization:  { type: String, trim: true },
  qualifications:  [{ type: String }],
  experience:      { type: Number, default: 0 }, // years
  consultationFee: { type: Number, default: 0 },
  bio:             { type: String },
  languages:       [{ type: String }],

  availableSlots: [slotSchema],
  isAvailable:    { type: Boolean, default: true },

  rating:       { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },

  registrationNo: { type: String },
  isVerified:     { type: Boolean, default: false },
}, { timestamps: true })

export default mongoose.model('Doctor', doctorSchema)