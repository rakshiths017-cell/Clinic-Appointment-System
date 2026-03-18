import express from "express";
import Appointment from "../models/appointment.js";
import Doctor from "../models/doctor.js";
import User from "../models/user.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// POST /api/appointments (Patient action)
router.post("/", auth('patient'), async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;
    const patientId = req.user.id;

    if (!doctorId || !date || !time) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const patient = await User.findById(patientId);
    if (!patient) return res.status(404).json({ error: "Patient user not found" });

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(400).json({ error: "Doctor not found" });

    const exists = await Appointment.findOne({ doctor: doctorId, date, time });
    if (exists) return res.status(400).json({ error: "Slot already booked" });

    const appointment = new Appointment({
      patient: patient.id,
      patientName: patient.name,
      patientEmail: patient.email,
      doctor: doctorId, // This is now a ref to the 'doctor' model
      date,
      time,
      status: 'Upcoming',
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/appointments/my (Patient Dashboard)
router.get("/my", auth('patient'), async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate('doctor', 'name specialty') // <-- Populate doctor's name
      .sort({ date: 1 });
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/appointments/doctor (Doctor Dashboard)
router.get("/doctor", auth('doctor'), async (req, res) => {
  try {
    // This is now simple and secure. req.user.id IS the doctor's ID.
    const appointments = await Appointment.find({ doctor: req.user.id }).sort({ date: 1 });
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/appointments/:id/complete (Doctor Action)
router.put("/:id/complete", auth('doctor'), async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    
    // Security check: Does this appointment belong to this doctor?
    if (appointment.doctor.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not authorized" });
    }

    appointment.status = 'Completed';
    await appointment.save();
    
    res.json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;