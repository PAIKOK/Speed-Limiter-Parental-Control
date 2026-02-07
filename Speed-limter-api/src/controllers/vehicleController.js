import Vehicle from "../models/Vehicle.js";

export async function getHistory(req, res) {
  try {
    const records = await Vehicle.find({ userId: req.userId })
      .sort({ timestamp: -1 })
      .limit(100);

    res.json(records);
  } catch {
    res.status(500).json({ error: "Unable to fetch history" });
  }
}
