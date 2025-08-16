// /app/api/ambulanceBooking/route.js
import connectDB from "@/lib/db";
import { NextResponse } from "next/server";
import ambulanceModel from "@/models/ambulanceModel";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      ambulanceNumber,
      driverName,
      driverNumber,
      distance,
      totalAmount,
      timeReq,
      patientId,
    } = body;

    if (!ambulanceNumber || !driverName || !driverNumber || !patientId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const booking = await ambulanceModel.create({
      ambulanceNumber,
      driverName,
      driverNumber,
      distance,
      totalAmount,
      timeReq,
      patientId,
      date: new Date(),
    });

    return NextResponse.json({
      message: "Ambulance booked successfully",
      bookingId: booking._id,
    });
  } catch (err) {
    console.error("Ambulance booking error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
