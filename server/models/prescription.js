import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PrescriptionSchema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: "User", required: true },
  doctor: { type: Schema.Types.ObjectId, ref: "doctor", required: true }, // <-- CHANGED
  appointment: { type: Schema.Types.ObjectId, ref: "appointment", required: true },
  medication: { type: String, required: true },
  dosage: { type: String, default: "" },
  notes: { type: String, default: "" },
  dateIssued: { type: Date, default: Date.now }
});

export default mongoose.model("prescription", PrescriptionSchema);