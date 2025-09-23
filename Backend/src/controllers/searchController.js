import AyurvedhaCode from "../models/AyurvedhaCode.js";
import SiddhaCode from "../models/SiddhaCode.js";
import UnaniCode from "../models/UnaniCode.js";
import { fetchICDDataAdvanced } from "../services/icdService.js";

/**
 * @desc Search all NAMASTE systems (Ayurveda, Siddha, Unani) and ICD
 * @route GET /api/namaste/search?q=...
 */
export const searchAllNamaste = async (req, res) => {
  try {
    let { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
    }
    q = q.trim();

    // 1️⃣ Search Ayurveda
    const ayurvedaResults =
      (await AyurvedhaCode.find({
        $or: [
          { NAMC_term: { $regex: q, $options: "i" } },
          { NAMC_term_diacritical: { $regex: q, $options: "i" } },
          { NAMC_term_DEVANAGARI: { $regex: q, $options: "i" } },
          { Short_definition: { $regex: q, $options: "i" } },
          { Long_definition: { $regex: q, $options: "i" } },
        ],
      })) || [];

    // 2️⃣ Search Siddha
    const siddhaResults =
      (await SiddhaCode.find({
        $or: [
          { NAMC_TERM: { $regex: q, $options: "i" } },
          { short_definition: { $regex: q, $options: "i" } },
          { long_definition_with_symptoms: { $regex: q, $options: "i" } },
        ],
      })) || [];

    // 3️⃣ Search Unani
    const unaniResults =
      (await UnaniCode.find({
        $or: [
          { TERM: { $regex: q, $options: "i" } },
          { TERM_DIACRITICAL: { $regex: q, $options: "i" } },
          { short_definition: { $regex: q, $options: "i" } },
          { long_definition: { $regex: q, $options: "i" } },
        ],
      })) || [];

    // 4️⃣ Fetch ICD results
    const icdResult = await fetchICDDataAdvanced(q);

    // 5️⃣ Return combined response
    return res.json({
      query: q,
      ayurveda: ayurvedaResults,
      siddha: siddhaResults,
      unani: unaniResults,
      icd: icdResult,
      counts: {
        ayurveda: ayurvedaResults.length,
        siddha: siddhaResults.length,
        unani: unaniResults.length,
      },
    });
  } catch (error) {
    console.error("❌ NAMASTE Search Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};




// New: Fetch by NAMASTE Code
export const getNamasteWithICD = async (req, res) => {
  try {
    const { code } = req.params;

    if (!code) {
      return res.status(400).json({ error: "NAMC_CODE is required" });
    }

    // 1️⃣ Find NAMASTE document
    const namasteDoc = await NamasteCode.findOne({ NAMC_CODE: code }).lean();

    if (!namasteDoc) {
      return res.status(404).json({ error: "NAMASTE code not found" });
    }

    // 2️⃣ Prepare terms to search ICD
    // Use NAMC_TERM and short_definition (split by commas, semicolons, or "and")
    const terms = [];
    if (namasteDoc.NAMC_TERM) terms.push(namasteDoc.NAMC_TERM);
    if (namasteDoc.short_definition) {
      // Split short_definition into keywords
      const splitTerms = namasteDoc.short_definition
        .split(/,|;| and /i)
        .map(t => t.trim())
        .filter(Boolean);
      terms.push(...splitTerms);
    }

    // 3️⃣ Search ICD API for each term
    const icdResults = [];
    for (const term of terms) {
      const result = await fetchICDDataAdvanced(term);
      if (result) icdResults.push(result);
    }

    // 4️⃣ Return NAMASTE doc + all ICD matches
    return res.json({
      namaste: namasteDoc,
      icd: icdResults.length ? icdResults : null,
    });

  } catch (error) {
    console.error("Error in getNamasteWithICD:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
