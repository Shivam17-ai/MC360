const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reportId: { type: String, unique: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "lab-report",
        "prescription",
        "discharge-summary",
        "imaging",
        "vaccination",
        "insurance",
        "other",
      ],
      default: "other",
    },
    fileUrl: { type: String, required: true },
    filePublicId: { type: String },
    fileType: { type: String }, // pdf, jpg, png
    fileSize: { type: Number },
    description: { type: String },
    date: { type: Date, default: Date.now },
    tags: [String],
    aiSummary: { type: String },
    isSharedWithDoctor: { type: Boolean, default: false },
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reportSchema.pre("save", async function (next) {
  if (!this.reportId) {
    const lastDoc = await mongoose.model("Report")
      .findOne({}, { reportId: 1 })
      .sort({ reportId: -1 });
    let nextNum = 1;
    if (lastDoc && lastDoc.reportId) {
      const match = lastDoc.reportId.match(/MC360-R-(\d+)/);
      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }
    this.reportId = `MC360-R-${String(nextNum).padStart(6, "0")}`;
  }
  next();
});

reportSchema.index({ patient: 1, createdAt: -1 });

module.exports = mongoose.model("Report", reportSchema);