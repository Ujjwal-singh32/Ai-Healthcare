import { NextResponse } from "next/server";
import mongoose from "mongoose";
import ConnectDB from "@/lib/db";
import medicineOrderModel from "@/models/medicineOrderModel";

export async function GET(req) {
  try {
    await ConnectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }

    const orders = await medicineOrderModel.find({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .populate({
        path: "items.medicineId",
        model: "Medicine",
        select: "name price image", 
      })
      .sort({ createdAt: -1 });

    // Transform items to match frontend expectations
    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      createdAt: order.createdAt,
      totalAmount: order.totalAmount,
      shippingAddress: order.shippingAddress,
      status: order.status,
      items: order.items.map((item) => ({
        name: item.name || item.medicineId?.name || "Unknown",
        price: item.price || item.medicineId?.price || 0,
        quantity: item.qty || 1,
        image: item.image?.length ? item.image : item.medicineId?.image || [],
      })),
    }));
    console.log("formatted orders" , formattedOrders)
    return NextResponse.json(formattedOrders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
