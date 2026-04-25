const express = require("express");
const {
  buildFhirRecord,
  storeFhirRecord,
  listFhirRecords,
  getFhirRecord
} = require("../services/fhir.service");

const router = express.Router();

router.post("/fhir/store", async (req, res, next) => {
  try {
    const {
      source_system,
      target_system,
      source_doc,
      target_doc,
      tag = "Equivalent",
      score = 0,
      confidence = "high",
      match_reason = "User selected mapping"
    } = req.body;

    if (!source_system || !target_system || !source_doc || !target_doc) {
      return res.status(400).json({
        error: "ValidationError",
        message: "source_system, target_system, source_doc, and target_doc are required"
      });
    }

    const record = buildFhirRecord({
      source_system: source_system.toLowerCase(),
      target_system: target_system.toLowerCase(),
      source_doc,
      target_doc,
      tag,
      score,
      confidence,
      match_reason
    });

    const mappingKey = await storeFhirRecord(record);

    res.json({
      message: "Selected mapping stored successfully",
      mappingKey,
      record
    });
  } catch (error) {
    next(error);
  }
});

router.get("/fhir/history", async (req, res, next) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const records = await listFhirRecords(Number(limit), Number(offset));
    res.json({ results: records });
  } catch (error) {
    next(error);
  }
});

router.get("/fhir/:mappingKey", async (req, res, next) => {
  try {
    const { mappingKey } = req.params;
    const record = await getFhirRecord(mappingKey);

    if (!record) {
      return res.status(404).json({ error: "Mapping not found" });
    }

    res.json(record);
  } catch (error) {
    next(error);
  }
});

module.exports = router;