import connectDB from "@/lib/db";
import LabReport from "@/models/labReportModel";
export async function POST(request) {
  await connectDB();

  try {
    const { bookingId } = await request.json();

    if (!bookingId) {
      return new Response(
        JSON.stringify({ success: false, message: "bookingId is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find report by bookingId, selecting only tests field
    const report = await LabReport.findOne({ bookingId }, "tests");

    const tests = report ? report.tests : [];

    return new Response(JSON.stringify({ success: true, tests }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching tests:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
