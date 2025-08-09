import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PathlabBooking from "@/models/labBookingModel";
import pathLabModel from "@/models/pathLabModel";
import patientModel from "@/models/patientModel";
export async function POST(req) {
  try {
    await connectDB();

    const { labId } = await req.json();

    if (!labId) {
      return NextResponse.json(
        { success: false, message: "Lab ID is required" },
        { status: 400 }
      );
    }

    // Find all reports for this labId
    const reports = await PathlabBooking.find({ labId })
      .populate("patientId", "name email") // show patient name/email
      .populate("labId", "name address"); // show lab name/address

    return NextResponse.json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error("Fetch reports error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
