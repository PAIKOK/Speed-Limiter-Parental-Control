import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err);
    process.exit(1);
  }
}
