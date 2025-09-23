import express from "express";
import {
  searchUnaniCodes,
  getUnaniWithICD,
} from "../controllers/unaniController.js";

const router = express.Router();

// 🔍 Search Unani codes
router.get("/search", searchUnaniCodes);

// 📄 Get Unani code by NUMC
router.get("/:code", getUnaniWithICD);

export default router;
