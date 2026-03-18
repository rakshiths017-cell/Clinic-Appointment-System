import express from "express";
import Bill from "../models/bill.js";
import Appointment from "../models/appointment.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// POST /api/bills (Doctor Action)
router.post("/", auth('doctor'), async (req, res) => {
  const { appointmentId, amount } = req.body;
  
  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    const existingBill = await Bill.findOne({ appointment: appointmentId });
    if (existingBill) {
      return res.status(400).json({ error: "A bill for this appointment already exists." });
    }

    const newBill = new Bill({
      patient: appointment.patient,
      doctor: req.user.id, // <-- NEW
      appointment: appointmentId,
      amount,
      status: 'Pending',
    });

    await newBill.save();
    res.status(201).json(newBill);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// GET /api/bills/my (Patient Dashboard)
router.get("/my", auth('patient'), async (req, res) => {
  try {
    const bills = await Bill.find({ patient: req.user.id })
      .populate("appointment", ["date", "time"])
      .populate("doctor", ["name"]); // <-- NEW
    res.json(bills);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// PUT /api/bills/:id/pay (Patient Action)
router.put("/:id/pay", auth('patient'), async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({ error: "Bill not found" });
    }
    if (bill.patient.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not authorized" });
    }

    bill.status = 'Paid';
    await bill.save();

    res.json(bill);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;