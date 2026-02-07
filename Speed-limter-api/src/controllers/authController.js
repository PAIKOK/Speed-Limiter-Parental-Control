import User from "../models/User.js";
import { createSession, hashPassword } from "../config/sessions.js";

export async function signup(req, res) {
  try {
    const { email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: "Email already used" });

    const passwordHash = hashPassword(password);

    const user = await User.create({ email, passwordHash });
    const sessionToken = createSession(user._id);

    res.json({ userId: user._id, email, sessionToken });
  } catch (e) {
    res.status(500).json({ error: "Signup failed" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid login" });

    const passwordHash = hashPassword(password);
    if (user.passwordHash !== passwordHash)
      return res.status(401).json({ error: "Invalid login" });

    const sessionToken = createSession(user._id);

    res.json({ userId: user._id, email, sessionToken });
  } catch (e) {
    res.status(500).json({ error: "Login failed" });
  }
}
