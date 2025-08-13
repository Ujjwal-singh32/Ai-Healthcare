import connectDB from "@/lib/db";
import Medicine from "@/models/medicineModel";

export async function GET(req) {
  await connectDB();

  const { search } = Object.fromEntries(new URL(req.url).searchParams);

  let query = {};
  if (search) {
    query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } }
      ]
    };
  }

  try {
    const medicines = await Medicine.find(query);
    return new Response(JSON.stringify(medicines), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch medicines" }), { status: 500 });
  }
}
