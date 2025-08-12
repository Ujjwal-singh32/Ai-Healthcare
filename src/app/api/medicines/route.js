import connectDB from "@/lib/db";
import Medicine from "@/models/medicineModel";

// GET /api/medicines - fetch all medicines
export async function GET() {
  try {
    await connectDB();
    const medicines = await Medicine.find({});
    return new Response(JSON.stringify(medicines), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch medicines", details: error.message }), { status: 500 });
  }
}
