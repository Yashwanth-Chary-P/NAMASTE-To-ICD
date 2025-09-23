// src/controllers/siddhaController.js
import SiddhaCode from "../models/SiddhaCode.js";
import { fetchICDDataAdvanced } from "../services/icdService.js";

/**
 * @desc Search Siddha codes with ICD-11 mapping
 * @route GET /api/siddha/search?q=...
 */
export const searchSiddhaCodes = async (req, res) => {
  try {
    let { q } = req.query;

    // 1️⃣ Validate input
    if (!q || !q.trim()) {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
    }
    q = q.trim();

    // 2️⃣ Try full-text search first
    let localResults = [];
    try {
      localResults = await SiddhaCode.find({ $text: { $search: q } });
    } catch (err) {
      console.warn("⚠️ Text search not available for Siddha, using regex fallback...");
    }

    // 3️⃣ Regex fallback search
    if (!localResults.length) {
      localResults = await SiddhaCode.find({
        $or: [
          { SIDDHA_TERM: { $regex: q, $options: "i" } },
          { SIDDHA_term_diacritical: { $regex: q, $options: "i" } },
          { SIDDHA_term_DEVANAGARI: { $regex: q, $options: "i" } },
          { short_definition: { $regex: q, $options: "i" } },
          { long_definition_with_symptoms: { $regex: q, $options: "i" } },
        ],
      });
    }

    // 4️⃣ Always call ICD advanced fetch
    const icdResult = await fetchICDDataAdvanced(q);

    // 5️⃣ Return combined response
    return res.json({
      query: q,
      siddha: localResults,
      localCount: localResults.length,
      icd: icdResult,
      method: "advanced",
    });

  } catch (error) {
    console.error("❌ Siddha Search Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


/**
 * @desc Get Siddha code by ID + ICD mappings
 * @route GET /api/siddha/:code
 */
export const getSiddhaWithICD = async (req, res) => {
  try {
    const { code } = req.params;

    if (!code) {
      return res.status(400).json({ error: "NAMC_CODE is required" });
    }

    // 1️⃣ Find Siddha document using NAMC_CODE
    const siddhaDoc = await SiddhaCode.findOne({ NAMC_CODE: code }).lean();

    if (!siddhaDoc) {
      return res.status(404).json({ error: "Siddha code not found" });
    }

    // 2️⃣ Prepare terms for ICD search (only short_definition is used)
    const terms = [];
    if (siddhaDoc.short_definition) {
      const splitTerms = siddhaDoc.short_definition
        .split(/,|;| and /i)
        .map(t => t.trim())
        .filter(Boolean);
      terms.push(...splitTerms);
    }

    console.log(siddhaDoc.short_definition);

    // 3️⃣ Fetch ICD results for each term
    const icdResults = [];
    for (const term of terms) {
      try {
        const result = await fetchICDDataAdvanced(term);
        if (result) icdResults.push(result);
      } catch (err) {
        console.warn(`⚠️ ICD fetch failed for term: ${term}`, err.message);
      }
    }

    // 4️⃣ Return Siddha + ICD results
    return res.json({
      siddha: siddhaDoc,
      icd: icdResults.length ? icdResults : null,
    });

  } catch (error) {
    console.error("❌ Error in getSiddhaWithICD:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};