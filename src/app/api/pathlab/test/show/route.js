// /app/api/pathlab/test/get/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import pathLabModel from "@/models/pathLabModel";

export async function POST(req) {
  try {
    await connectDB();

    const { pathlabId } = await req.json();

    if (!pathlabId) {
      return NextResponse.json(
        { success: false, message: "labId is required" },
        { status: 400 }
      );
    }

    // Fetch lab with only required fields
    const lab = await pathLabModel.findById(pathlabId, {
      labName: 1,
      test: 1, // includes _id, testname, and price
    });

    if (!lab) {
      return NextResponse.json(
        { success: false, message: "PathLab not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      labName: lab.labName,
      tests: lab.test || [], // Each test will have _id, testname, price
    });
  } catch (error) {
    console.error("Fetch tests error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
