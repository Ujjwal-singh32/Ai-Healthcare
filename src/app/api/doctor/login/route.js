import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import doctorModel from "@/models/doctorModel";

const createToken = (id, role) => {
  return jwt.sign(
    { id, role }, // include role for role-based checks
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // could be shorter for extra security
  );
};

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return NextResponse.json(
        { success: false, message: "Doctor not found" },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Incorrect password" },
        { status: 401 }
      );
    }

    // Create token with id + role
    const token = createToken(doctor._id, "doctor");

    return NextResponse.json({
      success: true,
      token,
      message: "Login successful",
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
