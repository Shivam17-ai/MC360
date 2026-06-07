import mongoose from 'mongoose'

const hospitalSchema = new mongoose.Schema({
  user: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
    unique:   true,
  },

  name:        { type: String, trim: true },
  description: { type: String },
  logo:        { type: String },

  address: {
    street:    String,
    city:      String,
    state:     String,
    pincode:   String,
    country:   { type: String, default: 'India' },
    latitude:  Number,
    longitude: Number,
  },

  phone:         [{ type: String }],
  email:         { type: String },
  website:       { type: String },

  specializations: [{ type: String }],
  facilities:      [{ type: String }],

  beds: {
    total:     { type: Number, default: 0 },
    available: { type: Number, default: 0 },
    icu:       { type: Number, default: 0 },
  },

  isVerified:  { type: Boolean, default: false },
  isActive:    { type: Boolean, default: true },

  rating:       { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.model('Hospital', hospitalSchema)