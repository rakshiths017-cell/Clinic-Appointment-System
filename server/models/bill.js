import mongoose from "mongoose";
const Schema = mongoose.Schema;

const BillSchema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: "User", required: true },
  doctor: { type: Schema.Types.ObjectId, ref: "doctor", required: true }, // <-- NEW
  appointment: { type: Schema.Types.ObjectId, ref: "appointment", required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
  dateIssued: { type: Date, default: Date.now }
});

export default mongoose.model("bill", BillSchema);