import express from "express";
import {
  searchAyurvedhaCodes,
  getAyurvedhaWithICD,
} from "../controllers/ayurvedhaController.js";

const router = express.Router();

// 🔍 Search Ayurvedha codes
router.get("/search", searchAyurvedhaCodes);

// 📄 Get by NAMC_CODE
router.get("/:code", getAyurvedhaWithICD);

export default router;
