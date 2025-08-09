import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  bookingId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "DoctorBooking", 
    required: true 
  },

  messages: [
    {
      text: { type: String, default: "" },
      timestamp: { type: Date, default: Date.now },

      // Who sent this message
      senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
      senderType: { type: String, enum: ["Patient", "Doctor"], required: true },

      // Who received this message
      receiverId: { type: mongoose.Schema.Types.ObjectId, required: true },
      receiverType: { type: String, enum: ["Patient", "Doctor"], required: true }
    },
  ],
}, { timestamps: true });

// Each booking has only one chat thread
chatSchema.index({ bookingId: 1 });

const ChatModel = mongoose.models.Chats || mongoose.model("Chats", chatSchema);

export default ChatModel;
