import mongoose from 'mongoose';

const pathlabBookingSchema = new mongoose.Schema({
  labId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PathLab',
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  tests: {
    type: [String],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'started', 'completed'],
    default: 'pending',
  },
  fee: {
    type: Number,
    required: true,
  },
  paymentMode: {
    type: String,
    enum: ['cash', 'card', 'upi', 'online'],
    default: 'cash',
  },
}, { timestamps: true });

const PathlabBooking = mongoose.models.PathlabBooking || mongoose.model('PathlabBooking', pathlabBookingSchema);

export default PathlabBooking;