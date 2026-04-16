// src/routes/searchRoutes.js
import express from "express";
import { searchAllNamaste, getNamasteWithICD } from "../controllers/searchController.js";

const router = express.Router();

router.get("/", searchAllNamaste);

router.get("/namaste/:code", getNamasteWithICD);

export default router;