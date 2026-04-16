import UnaniCode from "../models/UnaniCode.js";
import { fetchICDDataAdvanced } from "../services/icdService.js";

/**
 * @desc Search Unani codes with ICD mapping
 * @route GET /api/unani/search?q=...
 */
export const searchUnaniCodes = async (req, res) => {
  try {
    let { q } = req.query;
    if (!q || !q.trim()) {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
    }
    q = q.trim();

    // 1️⃣ Full-text search
    let localResults = [];
    try {
      localResults = await UnaniCode.find({ $text: { $search: q } });
    } catch (err) {
      console.warn("⚠️ Text search failed, using regex fallback...");
    }

    // 2️⃣ Regex fallback search
    if (!localResults.length) {
      localResults = await UnaniCode.find({
        $or: [
          { short_definition: { $regex: q, $options: "i" } },
          { long_definition: { $regex: q, $options: "i" } },
        ],
      });
    }

    // 3️⃣ Fetch ICD results
    const icdResult = await fetchICDDataAdvanced(q);

    return res.json({
      query: q,
      unani: localResults,
      localCount: localResults.length,
      icd: icdResult,
      method: "advanced",
    });

  } catch (error) {
    console.error("❌ Unani Search Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * @desc Get Unani code by NUMC + ICD mapping
 * @route GET /api/unani/:code
 */
export const getUnaniWithICD = async (req, res) => {
  try {
    const { code } = req.params;
    if (!code) {
      return res.status(400).json({ error: "NUMC is required" });
    }

    const unaniDoc = await UnaniCode.findOne({ NUMC: code }).lean();
    if (!unaniDoc) {
      return res.status(404).json({ error: "Unani code not found" });
    }

    // Prepare terms for ICD search from short_definition only
    const terms = [];
    if (unaniDoc.short_definition) {
      const splitTerms = unaniDoc.short_definition
        .split(/,|;| and /i)
        .map(t => t.trim())
        .filter(Boolean);
      terms.push(...splitTerms);
    }

    // Fetch ICD results
    const icdResults = [];
    for (const term of terms) {
      try {
        const result = await fetchICDDataAdvanced(term);
        if (result) icdResults.push(result);
      } catch (err) {
        console.warn(`⚠️ ICD fetch failed for term: ${term}`, err.message);
      }
    }

    return res.json({
      unani: unaniDoc,
      icd: icdResults.length ? icdResults : null,
    });

  } catch (error) {
    console.error("❌ Error in getUnaniWithICD:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
