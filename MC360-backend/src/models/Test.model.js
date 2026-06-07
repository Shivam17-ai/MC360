import mongoose from 'mongoose'

const testItemSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  category: { type: String },
  price:    { type: Number, default: 0 },
}, { _id: false })

const testSchema = new mongoose.Schema({
  patient: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
  },

  tests:          [testItemSchema],
  totalAmount:    { type: Number, default: 0 },

  collectionType: { type: String, enum: ['home', 'lab'], default: 'lab' },
  collectionDate: { type: String },
  collectionTime: { type: String },

  address: {
    street:  String,
    city:    String,
    pincode: String,
  },

  status: {
    type:    String,
    enum:    ['booked', 'sample_collected', 'processing', 'completed', 'cancelled'],
    default: 'booked',
  },

  reportUrl:  { type: String },
  isPaid:     { type: Boolean, default: false },
  notes:      { type: String },
}, { timestamps: true })

export default mongoose.model('Test', testSchema)