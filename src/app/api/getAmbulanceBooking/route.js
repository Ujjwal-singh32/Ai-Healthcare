// /app/api/ambulanceBooking/route.js
import connectDB from "@/lib/db";
import { NextResponse } from "next/server";
import ambulanceModel from "@/models/ambulanceModel";
import patientModel from "@/models/patientModel";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { patientId } = body;

    if (!patientId) {
      return NextResponse.json(
        { error: "Missing patientId in request body" },
        { status: 400 }
      );
    }

    // Fetch all bookings for the patient and populate patient name
    const bookings = await ambulanceModel
      .find({ patientId })
      .populate({ path: "patientId", select: "name" })
      .sort({ date: -1 })
      .lean();

    return NextResponse.json({ bookings });
  } catch (err) {
    console.error("Error fetching ambulance bookings:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
