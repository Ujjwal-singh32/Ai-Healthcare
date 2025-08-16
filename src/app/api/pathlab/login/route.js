import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pathLabModel from "@/models/pathLabModel";
import connectDB from "@/lib/db";

const createToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const lab = await pathLabModel.findOne({ email });
    if (!lab) {
      return NextResponse.json({ success: false, message: "Lab not found" });
    }

    const isMatch = await bcrypt.compare(password, lab.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Invalid credentials" });
    }

    // Role is hardcoded here since it's path lab login
    const token = createToken(lab._id, "pathlab");

    return NextResponse.json({ 
      success: true, 
      token, 
      role: "pathlab", 
      message: "Login successful" 
    });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
