import mongoose from 'mongoose'

const videoSessionSchema = new mongoose.Schema({
  appointment: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'Appointment',
    required: true,
  },
  patient: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
  },
  doctor: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'Doctor',
    required: true,
  },

  sessionId:  { type: String, unique: true, required: true },
  roomName:   { type: String },

  status: {
    type:    String,
    enum:    ['scheduled', 'active', 'ended', 'missed'],
    default: 'scheduled',
  },

  startedAt:      { type: Date },
  endedAt:        { type: Date },
  durationSeconds:{ type: Number },

  patientJoined:  { type: Boolean, default: false },
  doctorJoined:   { type: Boolean, default: false },

  recordingUrl:   { type: String },
  notes:          { type: String },
}, { timestamps: true })

export default mongoose.model('VideoSession', videoSessionSchema)