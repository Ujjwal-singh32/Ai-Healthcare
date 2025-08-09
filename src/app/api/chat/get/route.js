import connectDB from "@/lib/db";
import ChatModel from "@/models/chatModel";
import doctorModel from "@/models/doctorModel";
import patientModel from "@/models/patientModel";

export async function POST(req) {
  try {
    const body = await req.json();
    const { bookingId } = body;

    if (!bookingId) {
      return new Response(JSON.stringify({ success: false, message: "Booking ID required" }), { status: 400 });
    }

    await connectDB();

    const chat = await ChatModel.findOne({ bookingId }).lean();

    if (!chat) {
      return new Response(JSON.stringify({ success: true, messages: [] }), { status: 200 });
    }

    // Populate sender names from senderType
    const populatedMessages = await Promise.all(
      chat.messages.map(async (msg) => {
        let senderName = "Unknown";
        if (msg.senderType === "Patient") {
          const patient = await patientModel.findById(msg.senderId).select("name").lean();
          senderName = patient?.name || "Unknown Patient";
        } else if (msg.senderType === "Doctor") {
          const doctor = await doctorModel.findById(msg.senderId).select("name").lean();
          senderName = doctor?.name || "Unknown Doctor";
        }
        return { ...msg, senderName };
      })
    );

    return new Response(JSON.stringify({ success: true, messages: populatedMessages }), { status: 200 });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: "Server error" }), { status: 500 });
  }
}
