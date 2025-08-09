// /app/api/pathlab/all/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import pathLabModel from "@/models/pathLabModel";

export async function GET() {
  try {
    await connectDB();

    const labs = await pathLabModel.find({}, {
      labName: 1,
      email: 1,
      phone: 1,
      labAddress: 1,
      profilePic: 1,
      test: 1, // includes testname, price, _id
    });

    return NextResponse.json({
      success: true,
      labs
    });
  } catch (error) {
    console.error("Fetch all pathlabs error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
