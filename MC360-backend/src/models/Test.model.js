const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    testId: { type: String, unique: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
    orderedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    testName: { type: String, required: true },
    testCode: { type: String },
    category: {
      type: String,
      enum: ["blood", "urine", "imaging", "biopsy", "microbiology", "cardiology", "other"],
      default: "other",
    },
    status: {
      type: String,
      enum: ["ordered", "sample-collected", "processing", "completed", "cancelled"],
      default: "ordered",
    },
    scheduledDate: { type: Date },
    completedDate: { type: Date },
    results: [
      {
        parameter: String,
        value: String,
        unit: String,
        normalRange: String,
        isAbnormal: { type: Boolean, default: false },
      },
    ],
    report: { type: mongoose.Schema.Types.ObjectId, ref: "Report" },
    fee: { type: Number, default: 0 },
    isPaid: { type: Boolean, default: false },
    notes: String,
    sampleCollected: { type: Boolean, default: false },
    sampleCollectedAt: Date,
  },
  { timestamps: true }
);

testSchema.pre("save", async function (next) {
  if (!this.testId) {
    const count = await mongoose.model("Test").countDocuments();
    this.testId = `MC360-T-${String(count + 1).padStart(6, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Test", testSchema);