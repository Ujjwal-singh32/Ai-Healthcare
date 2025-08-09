import connectDB from "@/lib/db";
import ChatModel from "@/models/chatModel";

export async function POST(req) {
    try {
        const body = await req.json();
        const { bookingId, senderId, senderType, receiverId, receiverType, text } = body;

        // Validate required fields
        if (!bookingId || !senderId || !senderType || !receiverId || !receiverType || !text) {
            return new Response(JSON.stringify({ success: false, message: "Missing required fields" }), { status: 400 });
        }

        await connectDB();

        const newMessage = {
            text,
            senderId,
            senderType,
            receiverId,
            receiverType,
            timestamp: new Date(),
        };

        let chat = await ChatModel.findOne({ bookingId });

        if (!chat) {
            // Create new chat with the first message
            chat = new ChatModel({
                bookingId,
                messages: [newMessage],
            });
            await chat.save();
        } else {
            // Push new message into existing chat
            await ChatModel.updateOne(
                { _id: chat._id },
                { $push: { messages: newMessage } }
            );
        }

        return new Response(JSON.stringify({
            success: true,
            message: "Message saved",
            newMessage,
        }), { status: 200 });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, message: "Server error" }), { status: 500 });
    }
}
