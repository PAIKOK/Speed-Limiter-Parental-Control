import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { getWarnings } from "../controllers/warningController.js";

const router = express.Router();

router.get("/warnings", requireAuth, getWarnings);

export default router;
