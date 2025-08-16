import mongoose from "mongoose";

const AmbulanceBookingSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
    ambulanceNumber: {
        type: String,
        required: true,
    },
    driverName: {
        type: String,
        required: true,
    },
    driverNumber: {
        type: String,
    },
    distance: {
        type: Number, 
        required: true,
    },
    totalAmount: {
        type: Number, 
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "booked", "completed", "cancelled"],
        default: "booked",
    },
    date: {
        type: Date,
        default: Date.now, 
    },
    timeReq: {
        type: Number, 
        required: true,
    },
});

export default mongoose.models.AmbulanceBooking ||
    mongoose.model("AmbulanceBooking", AmbulanceBookingSchema);
