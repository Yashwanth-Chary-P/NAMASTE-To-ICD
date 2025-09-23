// siddhaRoutes.js
import express from "express";
import {
  searchSiddhaCodes,
  getSiddhaWithICD,
} from "../controllers/siddhaController.js";

const router = express.Router();

// 🔹 Search Siddha codes by term
// Example: GET /api/siddha/search?q=Vaḷarcitai
router.get("/search", searchSiddhaCodes);

// 🔹 Get Siddha code by SIDDHA_CODE with ICD mapping
// Example: GET /api/siddha/AAB1.1
router.get("/:code", getSiddhaWithICD);

export default router;
