// app/api/refresh/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import RefreshCount from "@/models/refreshCountModel";


export async function POST(req) {
  try {
    await connectDB();

    const { role } = await req.json(); 

    // Ensure we always have one doc to track counts
    let counter = await RefreshCount.findOne();
    if (!counter) {
      counter = await RefreshCount.create({});
    }

    if (role === "patient") counter.patientRefresh += 1;
    if (role === "doctor") counter.doctorRefresh += 1;
    if (role === "lab") counter.pathlabRefresh += 1;

    await counter.save();

    return NextResponse.json({ success: true, data: counter });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    let counter = await RefreshCount.findOne();
    if (!counter) {
      counter = await RefreshCount.create({});
    }

    return NextResponse.json({ success: true, data: counter });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
