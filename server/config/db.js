import mongoose from "mongoose";

const connectDB = async (mongoUri) => {
  if (!mongoUri) throw new Error("MONGO_URI not provided.");

  try {
    // Mongoose 6+ doesn't need these options
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectDB;