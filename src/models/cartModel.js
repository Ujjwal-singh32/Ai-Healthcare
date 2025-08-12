// models/cartModel.js
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  items: [
    {
      medicineId: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine", required: true },
      quantity: { type: Number, default: 1 }
    }
  ]
});

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);
