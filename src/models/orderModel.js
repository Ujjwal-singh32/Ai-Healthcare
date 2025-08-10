// models/PharmacyOrder.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  items: [
    {
      medicineId: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine", required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  shippingAddress: { type: String, required: true },
  paymentMethod: { type: String, enum: ["COD", "Online"], default: "COD" },
  status: { 
    type: String, 
    enum: ["Pending", "Packed", "Shipped", "Delivered"], 
    default: "Pending" 
  }
}, { timestamps: true });

export default mongoose.models.PharmacyOrder || mongoose.model("PharmacyOrder", orderSchema);
