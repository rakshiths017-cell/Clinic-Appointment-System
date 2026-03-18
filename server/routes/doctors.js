import express from "express";
import Doctor from "../models/doctor.js";

const router = express.Router();

// GET /api/doctors
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;