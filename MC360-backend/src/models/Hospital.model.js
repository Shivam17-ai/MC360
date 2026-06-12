const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    hospitalId: { type: String, unique: true },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["government", "private", "clinic", "diagnostic", "multispecialty"],
      default: "private",
    },
    registrationNumber: { type: String },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      pincode: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    phone: [String],
    email: String,
    website: String,
    logo: String,
    logoPublicId: String,
    facilities: [String],
    specializations: [String],
    totalBeds: { type: Number, default: 0 },
    availableBeds: { type: Number, default: 0 },
    emergencyAvailable: { type: Boolean, default: false },
    emergencyPhone: String,
    ambulanceAvailable: { type: Boolean, default: false },
    icuAvailable: { type: Boolean, default: false },
    bloodBank: { type: Boolean, default: false },
    pharmacy: { type: Boolean, default: false },
    diagnosticsLab: { type: Boolean, default: false },
    operatingHours: {
      open: String,
      close: String,
      is24Hours: { type: Boolean, default: false },
    },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
    doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }],
  },
  { timestamps: true }
);

hospitalSchema.pre("save", async function (next) {
  if (!this.hospitalId) {
    const count = await mongoose.model("Hospital").countDocuments();
    this.hospitalId = `MC360-H-${String(count + 1).padStart(5, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Hospital", hospitalSchema);