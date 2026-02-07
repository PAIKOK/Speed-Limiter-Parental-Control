// sockets/socketAuth.js
import { getUserId } from "../config/sessions.js";

export function socketAuth(io) {
  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.query?.token ||
      socket.handshake.headers["x-session-token"];

    console.log("🔍 Received token:", token);

    if (!token) {
      console.log("❌ No token provided");
      return next(new Error("Unauthorized"));
    }

    const userId = getUserId(token); // ✅ FIXED: USE CORRECT FUNCTION

    if (!userId) {
      console.log("❌ Invalid token:", token);
      return next(new Error("Unauthorized"));
    }

    console.log("✅ AUTH OK user =", userId);

    socket.userId = userId;

    next();
  });
}
