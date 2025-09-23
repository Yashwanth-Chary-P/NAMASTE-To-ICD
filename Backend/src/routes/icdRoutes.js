// src/routes/icdRoutes.js
import express from "express";
import { getAccessToken } from "../services/icdAuthService.js";
import { searchICDEntities } from "../services/icdAuthService.js";

const router = express.Router();

// 🔹 Generate access token endpoint
router.post("/token", async (req, res) => {
  try {
    const token = await getAccessToken();
    console.log("Token generated successfully!");
    res.status(200).json({ 
      access_token: token,
      message: "Token generated successfully"
    });
  } catch (error) {
    console.error("Error generating token:", error.message);
    res.status(500).json({ 
      message: "Failed to generate access token",
      error: error.message
    });
  }
});

// 🔹 Search ICD entities with detailed information
router.get("/search/:term", async (req, res) => {
  const { term } = req.params;
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({ 
      message: "Access token required in Authorization header",
      example: "Authorization: Bearer YOUR_TOKEN"
    });
  }

  console.log(`Searching ICD term: ${term}`);

  try {
    const entities = await searchICDEntities(term, accessToken);
    res.json({
      query: term,
      totalResults: entities.length,
      entities: entities
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ 
      message: "Error fetching ICD data",
      error: error.message
    });
  }
});

export default router;
