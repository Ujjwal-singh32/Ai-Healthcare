// /api/medicines/search
import Medicine from "@/models/Medicine";
import dbConnect from "@/lib/dbConnect";

export default async function handler(req, res) {
  await dbConnect();

  const { q } = req.query; // search term from frontend

  try {
    const medicines = await Medicine.find({
      $or: [
        { name: { $regex: q, $options: "i" } },       // match by name
        { category: { $regex: q, $options: "i" } }    // match by category
      ]
    });

    res.status(200).json(medicines);
  } catch (err) {
    res.status(500).json({ error: "Search failed", details: err.message });
  }
}
