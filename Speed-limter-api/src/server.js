// server.js
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import warningRoutes from "./routes/warningRoutes.js";

import { socketAuth } from "./sockets/socketAuth.js";
import Vehicle from "./models/Vehicle.js";

await connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api", vehicleRoutes);
app.use("/api", warningRoutes);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

// Attach middleware
socketAuth(io);

// VEHICLE LIMIT PER USER
const vehicleLimits = new Map();

// NEW: vehicle lock status per user
// key: `${userId}:${vehicleId}` -> true/false
const vehicleLocks = new Map();

io.on("connection", (socket) => {
  console.log("🔌 Connected:", socket.id, "user:", socket.userId);

  // ✅ join room so dashboard receives user-only data
  socket.join(socket.userId);

  // ---------------------------
  // ✅ VEHICLE UPDATE (SIMULATION)
  // ---------------------------
  socket.on("vehicleUpdate", async (data) => {
    const key = `${socket.userId}:${data.vehicleId}`;
    const limit = vehicleLimits.get(key)?.maxSpeedKmh ?? data.maxSpeed;

    const isOverSpeed = limit != null && data.speed > limit;
    const isLocked = vehicleLocks.get(key) === true;

    // store latest limit
    if (typeof data.maxSpeed === "number") {
      vehicleLimits.set(key, { maxSpeedKmh: data.maxSpeed });
    }

    const record = {
      ...data,
      userId: socket.userId,
      isOverSpeed,
      maxSpeed: limit,
      isLocked,
    };

    // ✅ Save to MongoDB
    await Vehicle.create(record);

    // ✅ Send to all dashboards for this user
    io.to(socket.userId).emit("vehicleUpdate", record);

    // if overspeed, send enforced limit info (optional)
    if (isOverSpeed) {
      socket.emit("speedLimitEnforced", {
        vehicleId: data.vehicleId,
        maxSpeedKmh: limit,
      });
    }

    // ✅ if locked, tell simulation to stop forcefully
    if (isLocked) {
      socket.emit("vehicleLockCommand", {
        vehicleId: data.vehicleId,
        action: "LOCK",
        reason: "Parent locked vehicle",
      });
    }
  });

  // ---------------------------
  // ✅ LOCK VEHICLE (DASHBOARD)
  // ---------------------------
  socket.on("lockVehicle", ({ vehicleId }) => {
    if (!vehicleId) return;

    const key = `${socket.userId}:${vehicleId}`;
    vehicleLocks.set(key, true);

    console.log("🔒 LOCKED:", key);

    // notify all clients of this user
    io.to(socket.userId).emit("vehicleLockStatus", {
      vehicleId,
      isLocked: true,
    });
  });

  // ---------------------------
  // ✅ UNLOCK VEHICLE (DASHBOARD)
  // ---------------------------
  socket.on("unlockVehicle", ({ vehicleId }) => {
    if (!vehicleId) return;

    const key = `${socket.userId}:${vehicleId}`;
    vehicleLocks.set(key, false);

    console.log("🔓 UNLOCKED:", key);

    io.to(socket.userId).emit("vehicleLockStatus", {
      vehicleId,
      isLocked: false,
    });
  });

  socket.on("disconnect", () => {
    console.log("🔌 Disconnected:", socket.id);
  });
});

const PORT = 5000;
httpServer.listen(PORT, () =>
  console.log(`🚀 Server running: http://localhost:${PORT}`),
);
