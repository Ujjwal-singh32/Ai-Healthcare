// models/RefreshCount.js
import mongoose from "mongoose";

const refreshSchema = new mongoose.Schema({
  patientRefresh: { type: Number, default: 0 },
  doctorRefresh: { type: Number, default: 0 },
  pathlabRefresh: { type: Number, default: 0 },
});

const RefreshCount =
  mongoose.models.RefreshCount || mongoose.model("RefreshCount", refreshSchema);

export default RefreshCount;
