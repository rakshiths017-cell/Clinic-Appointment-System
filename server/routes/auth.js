import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Doctor from "../models/doctor.js"; // <-- Import Doctor model

const router = express.Router();

// === PATIENT ROUTES ===

// POST /api/auth/register (For Patients)
router.post("/register", async (req, res) => {
  const { name, email, phone, password, confirmPassword } = req.body;

  if (!name || !email || !phone || !password || !confirmPassword) {
    return res.status(400).json({ error: "Please enter all fields" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists with that email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await user.save();

    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// POST /api/auth/login (For Patients)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please enter all fields" });
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ 
      token, 
      user: { 
        id: user.id,
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


// === DOCTOR LOGIN ROUTE (NEW) ===

// POST /api/auth/doctor/login (For Doctors)
router.post("/doctor/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please enter all fields" });
  }

  try {
    // 1. Find doctor in the 'doctors' collection
    let doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // 3. Create payload with "doctor" role
    const payload = { 
      user: { 
        id: doctor.id, 
        role: 'doctor' // <-- Manually assign doctor role
      } 
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // 4. Send back token and user info
    res.json({ 
      token, 
      user: { 
        id: doctor.id,
        name: doctor.name, // Use doctor's name
        email: doctor.email, 
        role: 'doctor' 
      } 
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


export default router;