import AyurvedhaCode from "../models/AyurvedhaCode.js";
import { fetchICDDataAdvanced } from "../services/icdService.js";

/**
 * @desc Search Ayurvedha codes with ICD-11 mapping
 * @route GET /api/ayurvedha/search?q=...
 */
export const searchAyurvedhaCodes = async (req, res) => {
  try {
    let { q } = req.query;
    if (!q || !q.trim()) {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
    }
    q = q.trim();

    // 1️⃣ Try text search
    let localResults = [];
    try {
      localResults = await AyurvedhaCode.find({ $text: { $search: q } });
    } catch (err) {
      console.warn("⚠️ Text search not available, falling back to regex...");
    }

    // 2️⃣ Regex fallback
    if (!localResults.length) {
      localResults = await AyurvedhaCode.find({
        $or: [
          { Short_definition: { $regex: q, $options: "i" } },
          { Long_definition: { $regex: q, $options: "i" } },
          { Ontology_branches: { $regex: q, $options: "i" } },
        ],
      });
    }

    // 3️⃣ Fetch ICD result
    const icdResult = await fetchICDDataAdvanced(q);

    return res.json({
      query: q,
      ayurvedha: localResults,
      localCount: localResults.length,
      icd: icdResult,
      method: "advanced",
    });

  } catch (error) {
    console.error("❌ Ayurvedha Search Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * @desc Get Ayurvedha code by NAMC_CODE + ICD mappings
 * @route GET /api/ayurvedha/:code
 */
export const getAyurvedhaWithICD = async (req, res) => {
  try {
    const { code } = req.params;
    if (!code) {
      return res.status(400).json({ error: "NAMC_CODE is required" });
    }

    const ayurvedhaDoc = await AyurvedhaCode.findOne({ NAMC_CODE: code }).lean();
    if (!ayurvedhaDoc) {
      return res.status(404).json({ error: "Ayurvedha code not found" });
    }

    // Prepare terms from Short_definition only
    const terms = [];
    if (ayurvedhaDoc.Short_definition) {
      const splitTerms = ayurvedhaDoc.Short_definition
        .split(/,|;| and or /i)
        .map(t => t.trim())
        .filter(Boolean);
      terms.push(...splitTerms);
    }
    console.log(ayurvedhaDoc.Short_definition);

    // Fetch ICD data for each term
    const icdResults = [];
    for (const term of terms) {
      try {
        console.log(term);
        const result = await fetchICDDataAdvanced(term);
        if (result) icdResults.push(result);
      } catch (err) {
        console.warn(`⚠️ ICD fetch failed for term: ${term}`, err.message);
      }
    }

    return res.json({
      ayurvedha: ayurvedhaDoc,
      icd: icdResults.length ? icdResults : null,
    });

  } catch (error) {
    console.error("❌ Error in getAyurvedhaWithICD:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
