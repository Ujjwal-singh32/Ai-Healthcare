import { NextResponse } from "next/server";
import pathLabModel from "@/models/pathLabModel";
import connectDB from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(req) {
  try {
    await connectDB();
    const formData = await req.formData();
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    const { id, labName, phone, labAddress, profilePic } = data;
    let imageUrl = "";

    if (profilePic && typeof profilePic === "object" && profilePic.arrayBuffer) {
      const buffer = Buffer.from(await profilePic.arrayBuffer());
      const base64 = `data:${profilePic.type};base64,${buffer.toString("base64")}`;

      const result = await cloudinary.uploader.upload(base64, {
        folder: "rakshaa/pathlabs",
      });

      imageUrl = result.secure_url;
    }

    const updatedLab = await pathLabModel.findByIdAndUpdate(
      id,
      {
        labName,
        phone,
        labAddress,
        ...(imageUrl && { profilePic: imageUrl }),
      },
      { new: true }
    );

    return NextResponse.json({ success: true, updatedLab, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}