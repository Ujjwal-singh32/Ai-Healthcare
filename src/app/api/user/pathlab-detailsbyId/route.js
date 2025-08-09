import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import pathLabModel from "@/models/pathLabModel";

export async function POST(req) {
  try {
    await connectDB();

    const { pathlabId } = await req.json();

    if (!pathlabId) {
      return NextResponse.json(
        { success: false, message: "pathlabId is required" },
        { status: 400 }
      );
    }

    const lab = await pathLabModel.findById(pathlabId).lean();

    if (!lab) {
      return NextResponse.json(
        { success: false, message: "PathLab not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      labId: lab._id,
      labName: lab.labName,
      address: lab.labAddress || "",
      phone: lab.phone || "",
      email: lab.email || "",
      tests: lab.test || [],
      image:lab.profilePic
    });
  } catch (error) {
    console.error("Get PathLab error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
