import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Doctor from "./models/doctor.js";
import Appointment from "./models/appointment.js";
import Bill from "./models/bill.js";
import Prescription from "./models/prescription.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const doctorsData = [
  { name: "Dr. Sharma", email: "sharma@clinic.com", password: "password123", specialty: "Dentist", availableSlots: ["10:00", "11:00", "15:00"] },
  { name: "Dr. Mehta", email: "mehta@clinic.com", password: "password123", specialty: "Cardiologist", availableSlots: ["09:00", "14:00", "16:00"] },
  { name: "Dr. Kapoor", email: "kapoor@clinic.com", password: "password123", specialty: "Dermatologist", availableSlots: ["12:00", "13:00", "15:30"] }
];

const run = async () => {
  if (!MONGO_URI) {
    console.error("MONGO_URI missing in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to Mongo");

    // WIPE ALL COLLECTIONS FOR A CLEAN SLATE
    await Doctor.deleteMany();
    console.log("Cleared existing doctors...");
    await Appointment.deleteMany();
    console.log("Cleared existing appointments...");
    await Bill.deleteMany();
    console.log("Cleared existing bills...");
    await Prescription.deleteMany();
    console.log("Cleared existing prescriptions...");
    // You can also clear Users if you want, but it's not required for this bug
    // await mongoose.model('User').deleteMany();
    // console.log("Cleared existing users...");

    // Hash passwords before inserting
    const salt = await bcrypt.genSalt(10);
    
    const doctors = await Promise.all(doctorsData.map(async (doc) => {
      const hashedPassword = await bcrypt.hash(doc.password, salt);
      return {
        ...doc,
        password: hashedPassword
      };
    }));

    await Doctor.insertMany(doctors);
    console.log("Doctors seeded successfully with emails and hashed passwords!");
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

run();