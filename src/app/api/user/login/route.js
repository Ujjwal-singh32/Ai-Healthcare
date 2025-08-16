import { NextResponse } from "next/server";
import patientModel from "@/models/patientModel";
import connectDB from "@/lib/db";
import validator from "validator";
import bcrypt from "bcryptjs";
import { createToken } from "@/lib/jwt";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!validator.isEmail(email)) {
      return NextResponse.json({
        success: false,
        message: "Enter a valid email",
      });
    }

    const patient = await patientModel.findOne({ email });
    if (!patient) {
      return NextResponse.json({
        success: false,
        message: "Patient not found",
      });
    }

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return NextResponse.json({
        success: false,
        message: "Incorrect password",
      });
    }

    // Pass role to token
    const token = createToken(patient._id, "patient");

    return NextResponse.json({
      success: true,
      token,
      role:  "patient", 
    });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
