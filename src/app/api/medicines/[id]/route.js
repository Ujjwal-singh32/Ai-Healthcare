import connectDB from "@/lib/db"; // your DB connection file
import Medicine from "@/models/medicineModel";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid medicine ID" }, { status: 400 });
    }

    const medicine = await Medicine.findById(id);

    if (!medicine) {
      return NextResponse.json({ error: "Medicine not found" }, { status: 404 });
    }

    return NextResponse.json(medicine);
  } catch (error) {
    console.error("Error fetching medicine:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
