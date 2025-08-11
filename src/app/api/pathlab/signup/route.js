import { NextResponse } from "next/server";
import validator from "validator";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import pathLabModel from "@/models/pathLabModel";
import connectDB from "@/lib/db";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    const { labName, email, password, phone, labAddress, profilePic } = data;
    // console.log("data", data);
    if (!validator.isEmail(email)) {
      return NextResponse.json({ success: false, message: "Invalid email." });
    }

    if (password.length < 8) {
      return NextResponse.json({
        success: false,
        message: "Password must be at least 8 characters.",
      });
    }

    const existing = await pathLabModel.findOne({ email });
    // console.log("at this point");
    if (existing) {
      return NextResponse.json({
        success: false,
        message: "PathLab already exists with this email.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    let imageUrl = "";
    if (
      profilePic &&
      typeof profilePic === "object" &&
      profilePic.arrayBuffer
    ) {
      const buffer = Buffer.from(await profilePic.arrayBuffer());
      const base64 = `data:${profilePic.type};base64,${buffer.toString(
        "base64"
      )}`;

      const result = await cloudinary.uploader.upload(base64, {
        folder: "rakshaa/pathlabs",
      });
      imageUrl = result.secure_url;
    }

    const newPathLab = new pathLabModel({
      labName,
      email,
      password: hashedPassword,
      phone,
      labAddress,
      profilePic: imageUrl,
    });

    const saved = await newPathLab.save();
    const token = createToken(saved._id);
    return NextResponse.json({
      success: true,
      token,
      message: "PathLab registered successfully.",
    });
  } catch (error) {
    console.error("PathLab Signup Error:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
