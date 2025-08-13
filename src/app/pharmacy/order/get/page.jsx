// src/app/api/orders/route.js
import connectDB from "@/lib/db";
import Order from "@/models/orderModel";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { userId, items, totalAmount, address } = body;

    if (!userId || !items || items.length === 0) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const order = new Order({
      userId,
      items,
      totalAmount,
      address,
      status: "Pending",
    });

    await order.save();
    return new Response(JSON.stringify(order), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: 400,
      });
    }

    const orders = await Order.find({ userId }).populate("items.medicineId");
    return new Response(JSON.stringify(orders), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
