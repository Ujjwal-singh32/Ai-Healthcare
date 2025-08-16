import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import pathLabModel from "@/models/pathLabModel";

export async function PUT(req) {
  try {
    await connectDB();

    const { pathlabId, testId } = await req.json();
    // console.log(pathlabId, testId);
    if (!pathlabId || !testId) {
      return NextResponse.json(
        { success: false, message: "labId and testId are required" },
        { status: 400 }
      );
    }

    const updatedLab = await pathLabModel.findByIdAndUpdate(
      pathlabId,
      {
        $pull: {
          test: { _id: testId },
        },
      },
      { new: true }
    );

    if (!updatedLab) {
      return NextResponse.json(
        { success: false, message: "PathLab not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Test deleted successfully",
      updatedLab,
    });
  } catch (error) {
    console.error("Delete test error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
