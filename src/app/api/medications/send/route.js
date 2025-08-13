import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Medication from "@/models/medicationModel";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    const body = await req.json();
    const { patientId, doctorId, bookingId, medications } = body;
    // console.log("boddy",body);

    if (
      !mongoose.Types.ObjectId.isValid(patientId) ||
      !mongoose.Types.ObjectId.isValid(doctorId) ||
      !mongoose.Types.ObjectId.isValid(bookingId)
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid patientId or doctorId" },
        { status: 400 }
      );
    }

    await connectDB();

    await Medication.create({
      patientId: new mongoose.Types.ObjectId(patientId),
      doctorId: new mongoose.Types.ObjectId(doctorId),
      bookingId: new mongoose.Types.ObjectId(bookingId),
      medications,
      date: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
