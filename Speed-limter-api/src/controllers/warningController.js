import Vehicle from "../models/Vehicle.js";

export async function getWarnings(req, res) {
  try {
    const alerts = await Vehicle.find({
      userId: req.userId,
      isOverSpeed: true,
    })
      .sort({ timestamp: -1 })
      .limit(100);

    res.json(alerts);
  } catch {
    res.status(500).json({ error: "Unable to fetch warnings" });
  }
}
