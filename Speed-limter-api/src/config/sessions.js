import crypto from "crypto";

// token → userId
export const sessions = new Map();

export function createSession(userId) {
  const token = crypto.randomBytes(24).toString("hex");
  sessions.set(token, userId.toString());
  return token;
}

export function getUserId(token) {
  if (!token) return null;
  return sessions.get(token) || null;
}

export function hashPassword(pw) {
  return crypto.createHash("sha256").update(pw).digest("hex");
}
