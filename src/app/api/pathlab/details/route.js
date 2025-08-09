import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import pathlabModel from "@/models/pathLabModel";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectDB();

  try {
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const pathlab = await pathlabModel.findById(decoded.id).select("-password");

    if (!pathlab) {
      return NextResponse.json({ success: false, message: "Pathlab not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, pathlab: pathlab });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}