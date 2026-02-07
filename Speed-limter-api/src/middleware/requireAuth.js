import { getUserId } from "../config/sessions.js";

export function requireAuth(req, res, next) {
  const token =
    req.headers["x-session-token"] ||
    req.query.sessionToken ||
    req.body.sessionToken;

  const userId = getUserId(token);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  req.userId = userId;
  next();
}
