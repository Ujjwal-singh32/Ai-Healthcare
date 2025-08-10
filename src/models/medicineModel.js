// models/Medicine.js
import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  image: { type: String }, // Image URL
}, { timestamps: true });

export default mongoose.models.Medicine || mongoose.model("Medicine", medicineSchema);
