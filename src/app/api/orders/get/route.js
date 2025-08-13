import { NextResponse } from "next/server";
import ConnectDB from "@/lib/db";
import orderModel from "@/models/orderModel";

export async function GET(req) {
  try {
    await ConnectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    // console.log("userId:", userId);

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const orders = await orderModel.find({ patientId: userId })
      .populate("items.medicineId");

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching pharmacy orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
