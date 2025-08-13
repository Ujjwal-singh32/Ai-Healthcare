import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Cart from "@/models/cartModel";

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const cart = await Cart.findOne({ userId }).populate("items.medicineId");
  if (!cart) {
    return NextResponse.json({ items: [], totalQuantity: 0, totalPrice: 0 });
  }

  const totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.medicineId.price * item.quantity,
    0
  );

  return NextResponse.json({
    items: cart.items.map(item => ({
      id: item.medicineId._id,
      name: item.medicineId.name,
      description: item.medicineId.description,
      price: item.medicineId.price,
      quantity: item.quantity,
      image: item.medicineId.image || "/medis.jpg"
    })),
    totalQuantity,
    totalPrice
  });
}
