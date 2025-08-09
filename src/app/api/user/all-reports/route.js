import connectDB from "@/lib/db";
import PathlabBooking from "@/models/labBookingModel";

export async function POST(request) {
  await connectDB();

  try {
    const { patientId } = await request.json();

    if (!patientId) {
      return new Response(
        JSON.stringify({ success: false, message: "patientId is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find all bookings for patientId, populate lab name for display
    const bookings = await PathlabBooking.find({ patientId })
      .populate("labId", "labName") // get lab name
      .sort({ date: -1 });

    return new Response(JSON.stringify({ success: true, bookings }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
