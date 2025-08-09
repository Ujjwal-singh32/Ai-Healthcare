import mongoose from "mongoose";

const testResultSchema = new mongoose.Schema({
  name: { type: String, required: true },
  result: { type: String, default: "" },
  normalRange: { type: String, default: "" },
  units: { type: String, default: "" },
  remarks: { type: String, default: "" },
});

const labReportSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    labId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PathLab",
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId, 
      required: true,
      unique: true,
    },
    tests: {
      type: [testResultSchema],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    fee: Number,
    paymentMode: String,
  },
  { timestamps: true }
);

const LabReport =
  mongoose.models.LabReport || mongoose.model("LabReport", labReportSchema);

export default LabReport;
