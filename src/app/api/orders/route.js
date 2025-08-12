import { NextResponse } from "next/server";
import ConnectDB from "@/lib/db";
import MedicineOrder from "@/models/medicineOrderModel";
import Cart from "@/models/cartModel";

export async function POST(req) {
  try {
    await ConnectDB();
    const { userId, address } = await req.json();

    if (!userId || !address) {
      return NextResponse.json(
        { error: "User ID and address are required" },
        { status: 400 }
      );
    }

    // Get user's cart
    const cart = await Cart.findOne({ userId }).populate("items.medicineId");

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Prepare order items
    const orderItems = cart.items.map((item) => ({
      medicineId: item.medicineId._id,
      name: item.medicineId.name,
      price: item.medicineId.price,
      qty: item.quantity,
      image: item.medicineId.image?.[0] || "",
    }));

    // Calculate total
    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    // Create order
    const newOrder = await MedicineOrder.create({
      userId,
      items: orderItems,
      shippingAddress: address,
      totalAmount,
    });

    // Clear cart
    await Cart.findOneAndDelete({ userId });

    return NextResponse.json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Order placement error:", error);
    return NextResponse.json(
      { error: "Failed to place order" },
      { status: 500 }
    );
  }
}
