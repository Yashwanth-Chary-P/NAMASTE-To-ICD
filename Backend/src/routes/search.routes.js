const express = require("express");
const { searchInSystem, globalSearch } = require("../services/search.service");
const { COLLECTIONS } = require("../config/constants");

const router = express.Router();

router.get("/search/:system", async (req, res, next) => {
  try {
    const { system } = req.params;
    const { q = "", limit = 5, offset = 0 } = req.query;

    if (!COLLECTIONS[system.toLowerCase()]) {
      return res.status(400).json({ error: "Invalid system" });
    }

    const result = await searchInSystem(
      system.toLowerCase(),
      q,
      Number(limit),
      Number(offset)
    );

    res.json({
      system: system.toLowerCase(),
      ...result
    });
  } catch (error) {
    next(error);
  }
});

router.get("/search", async (req, res, next) => {
  try {
    const { q = "", limit = 5, offset = 0 } = req.query;
    const result = await globalSearch(q, Number(limit), Number(offset));
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;