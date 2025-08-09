import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PathlabBooking from "@/models/labBookingModel";
export async function POST(req) {
  try {
    await connectDB();

    const { labId, patientId, date, tests, fee } = await req.json();

    // Validate required fields
    if (!labId || !patientId || !date || !tests || tests.length === 0 || !fee) {
      return NextResponse.json(
        { success: false, message: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // Create the booking
    const booking = await PathlabBooking.create({
      labId,
      patientId,
      date,
      tests,
      fee,
    });

    return NextResponse.json({
      success: true,
      message: "Pathlab booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
