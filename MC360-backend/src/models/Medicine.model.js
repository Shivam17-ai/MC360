import mongoose from 'mongoose'

const adherenceLogSchema = new mongoose.Schema({
  date:  { type: Date, default: Date.now },
  time:  { type: String },
  taken: { type: Boolean, default: false },
}, { _id: false })

const medicineSchema = new mongoose.Schema({
  patient: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
  },
  prescription: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'Prescription',
  },

  name:         { type: String, required: true, trim: true },
  dose:         { type: String },
  frequency:    { type: String },
  times:        [{ type: String }], // ['8:00 AM', '8:00 PM']
  startDate:    { type: Date },
  endDate:      { type: Date },
  instructions: { type: String },

  adherenceLog: [adherenceLogSchema],
  isActive:     { type: Boolean, default: true },
  reminderOn:   { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.model('Medicine', medicineSchema)