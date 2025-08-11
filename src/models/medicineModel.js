import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: [
      "Antibiotic",
      "Painkiller",
      "Antipyretic",
      "Vaccine",
      "Antiseptic",
      "Antifungal",
      "Antiviral",
      "Antidepressant",
      "Antihistamine",
      "Antacid",
      "Antimalarial",
      "Cough & Cold",
      "Diabetes Medication",
      "Blood Pressure Medication",
      "Cardiac Medication",
      "Vitamins & Supplements",
      "Eye Drops",
      "Skin Ointment",
      "Hormonal Therapy",
      "Immunosuppressant",
      "Respiratory Medication"
    ],
    required: true
  },
  description: { type: [String] }, // array of strings
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  image: { type: [String] }, // array of image URLs
}, { timestamps: true });

export default mongoose.models.Medicine || mongoose.model("Medicine", medicineSchema);
