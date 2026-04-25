const express = require("express");
const { proxyMapRequest } = require("../services/mlProxy.service");

const router = express.Router();

router.post("/map", async (req, res, next) => {
  try {
    const { source_system, code, target = "both", top_k = 5 } = req.body;

    if (!source_system || !code) {
      return res.status(400).json({
        error: "ValidationError",
        message: "source_system and code are required"
      });
    }

    const result = await proxyMapRequest({
      source_system,
      code,
      target,
      top_k
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;