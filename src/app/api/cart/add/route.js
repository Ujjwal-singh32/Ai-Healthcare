import connectDB from "@/lib/db";
import Cart from "@/models/cartModel";

export async function POST(req) {
  try {
    await connectDB();
    const { userId, medicineId, quantity } = await req.json();

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [{ medicineId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex(item => item.medicineId.toString() === medicineId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ medicineId, quantity });
      }
    }

    await cart.save();
    return new Response(JSON.stringify(cart), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to add to cart", details: error.message }), { status: 500 });
  }
}
