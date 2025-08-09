import connectDB from "@/lib/db";
import LabReport from "@/models/labReportModel";
import PathlabBooking from "@/models/labBookingModel";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();

    const { bookingId, tests } = await request.json();

    if (!bookingId || !tests || !Array.isArray(tests)) {
      return NextResponse.json(
        { success: false, message: "bookingId and tests array are required" },
        { status: 400 }
      );
    }

    // Find the booking by ID
    const booking = await PathlabBooking.findById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    // Check if a report already exists for this booking
    let report = await LabReport.findOne({ bookingId });

    if (report) {
      // Update existing report's tests and mark completed
      report.tests = tests;
      report.status = "completed";
      await report.save();
    } else {
      // Create a new report using booking info + tests
      report = new LabReport({
        patientId: booking.patientId,
        labId: booking.labId,
        bookingId: booking._id,
        tests,
        status: "completed",
        fee: booking.fee,
        paymentMode: booking.paymentMode,
      });

      await report.save();
    }

    // Update booking status to completed
    booking.status = "completed";
    await booking.save();

    return NextResponse.json(
      {
        success: true,
        message: "Report created/updated and booking marked completed",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in creating/updating report:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
