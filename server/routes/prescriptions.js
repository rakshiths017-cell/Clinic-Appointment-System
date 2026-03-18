import express from "express";
import Prescription from "../models/prescription.js";
import Appointment from "../models/appointment.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// POST /api/prescriptions (Doctor Action)
router.post("/", auth('doctor'), async (req, res) => {
  const { appointmentId, medication, dosage, notes } = req.body;
  
  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Check if appointment belongs to this doctor
    if (appointment.doctor.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not authorized for this appointment" });
    }

    const newPrescription = new Prescription({
      patient: appointment.patient,
      doctor: req.user.id, // The logged-in doctor
      appointment: appointmentId,
      medication,
      dosage,
      notes,
    });

    await newPrescription.save();
    res.status(201).json(newPrescription);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// GET /api/prescriptions/my (Patient Dashboard)
router.get("/my", auth('patient'), async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user.id })
      .populate("appointment", ["date", "time"])
      .populate("doctor", ["name", "specialty"]); // Populates doctor info
    res.json(prescriptions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;