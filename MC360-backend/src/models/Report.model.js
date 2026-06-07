import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema({
  patient: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'Doctor',
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'User',
  },

  name:     { type: String, required: true },
  type:     {
    type: String,
    enum: ['Blood Test', 'Imaging', 'Cardiac', 'Urine Test', 'Biopsy', 'Other'],
    default: 'Other',
  },

  fileUrl:  { type: String, required: true },
  fileSize: { type: Number },
  mimeType: { type: String },

  aiSummary: { type: mongoose.Schema.Types.Mixed },
  notes:     { type: String },
  isShared:  { type: Boolean, default: false },
}, { timestamps: true })

export default mongoose.model('Report', reportSchema)