const express = require("express");
const { lookupByCode } = require("../services/lookup.service");

const router = express.Router();

router.get("/lookup/:system/:code", async (req, res, next) => {
  try {
    const { system, code } = req.params;
    const result = await lookupByCode(system.toLowerCase(), code);

    if (!result) {
      return res.status(404).json({ error: "Code not found" });
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;