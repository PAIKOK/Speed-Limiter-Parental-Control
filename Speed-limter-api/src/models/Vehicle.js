import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  vehicleId: String,
  vehicleType: String,
  speed: Number,
  maxSpeed: Number,
  gps: { lat: Number, lng: Number },
  position: { x: Number, y: Number, z: Number },
  timestamp: Number,
  isOverSpeed: Boolean,
});

export default mongoose.model("Vehicle", vehicleSchema);
