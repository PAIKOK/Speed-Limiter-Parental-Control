import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { getHistory } from "../controllers/vehicleController.js";

const router = express.Router();

router.get("/history", requireAuth, getHistory);

export default router;
