// src/app/api/medicines/add/route.js
import connectDB from "@/lib/db";
import medicineModel from "@/models/medicineModel";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, category, description, price, stock, image } = body;

    if (!name || !category || !price) {
      return new Response(
        JSON.stringify({ error: "Name, category, and price are required" }),
        { status: 400 }
      );
    }

    const newMedicine = new medicineModel({
      name,
      category,
      description: Array.isArray(description)
        ? description
        : [description].filter(Boolean),
      price,
      stock: stock || 0,
      image: Array.isArray(image) ? image : [image].filter(Boolean)
    });

    await newMedicine.save();

    return new Response(
      JSON.stringify({
        message: "Medicine added successfully",
        medicine: newMedicine
      }),
      { status: 201 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to add medicine", details: err.message }),
      { status: 500 }
    );
  }
}
