import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import pathLabModel from "@/models/pathLabModel";

export async function PUT(req) {
  try {
    await connectDB();

    const { pathlabId, testname, price } = await req.json();
    
    // console.log(pathlabId , testname , price)
    if (!pathlabId || !testname || !price) {
      return NextResponse.json(
        { success: false, message: "labId, testname, and price are required" },
        { status: 400 }
      );
    }
    const updatedLab = await pathLabModel.findByIdAndUpdate(
      pathlabId,
      {
        $push: {
          test: {
            testname,
            price,
          },
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
      message: "Test added successfully",
      updatedLab,
    });
  } catch (error) {
    console.error("Add test error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
