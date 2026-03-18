import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import doctorsRoute from "./routes/doctors.js";
import appointmentsRoute from "./routes/appointments.js";
import authRoute from "./routes/auth.js";
import prescriptionRoute from "./routes/prescriptions.js"; // <-- 1. IMPORT
import billRoute from "./routes/bills.js"; // <-- 2. IMPORT

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json()); // To parse JSON bodies

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;
connectDB(MONGO_URI);

// API routes
app.use("/api/auth", authRoute);
app.use("/api/doctors", doctorsRoute);
app.use("/api/appointments", appointmentsRoute);
app.use("/api/prescriptions", prescriptionRoute); // <-- 3. USE
app.use("/api/bills", billRoute); // <-- 4. USE

// simple health check
app.get("/", (_req, res) => res.send("Clinic backend running"));

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));