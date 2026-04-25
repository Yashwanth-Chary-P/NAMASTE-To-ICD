const { getCollection } = require("../config/db");
const { COLLECTIONS, DEFAULT_LIMIT } = require("../config/constants");
const { getSearchFields } = require("../utils/schema");
const {
  normalizeText,
  escapeRegex,
  extractSearchTerms,
  highlightText
} = require("../utils/normalize");

function pickDisplayText(doc) {
  const candidates = [
    doc.title,
    doc.original_title,
    doc["Name English"],
    doc["NAMC_term_diacritical"],
    doc["NAMC_term"],
    doc["NUMC_TERM"],
    doc.term
  ];

  for (const value of candidates) {
    if (value !== null && value !== undefined && String(value).trim()) {
      return String(value);
    }
  }

  return "";
}

function buildSearchQuery(fields, query) {
  const terms = extractSearchTerms(query);

  if (!terms.length) return null;

  const clauses = [];
  for (const field of fields) {
    for (const term of terms) {
      clauses.push({
        [field]: {
          $regex: escapeRegex(term),
          $options: "i"
        }
      });
    }
  }

  return clauses.length ? { $or: clauses } : null;
}

async function searchInSystem(system, query, limit = DEFAULT_LIMIT, offset = 0) {
  const collectionName = COLLECTIONS[system];
  if (!collectionName) {
    const err = new Error("Invalid system");
    err.statusCode = 400;
    throw err;
  }

  const col = getCollection(collectionName);
  const fields = getSearchFields(system);
  const mongoQuery = buildSearchQuery(fields, query);

  if (!mongoQuery) {
    return { results: [], has_more: false };
  }

  const docs = await col
    .find(mongoQuery, { projection: { _id: 0 } })
    .skip(Number(offset) || 0)
    .limit((Number(limit) || DEFAULT_LIMIT) + 1)
    .toArray();

  const has_more = docs.length > (Number(limit) || DEFAULT_LIMIT);
  const results = docs.slice(0, Number(limit) || DEFAULT_LIMIT).map((doc) => {
    const display = pickDisplayText(doc);
    const candidateText = fields
      .map((field) => doc[field])
      .filter(Boolean)
      .join(" ");

    const matchedTerms = extractSearchTerms(query).filter((term) => {
      const normCandidate = normalizeText(candidateText || display);
      return normalizeText(term) && normCandidate.includes(normalizeText(term));
    });

    return {
      ...doc,
      system,
      matched_terms: matchedTerms,
      match_reason: matchedTerms.length
        ? `Matched keywords: ${matchedTerms.slice(0, 8).join(", ")}`
        : "Text match",
      highlighted_title: highlightText(display, matchedTerms.length ? matchedTerms : query)
    };
  });

  return { results, has_more };
}

async function globalSearch(query, limit = DEFAULT_LIMIT, offset = 0) {
  const systems = ["ayurveda", "siddha", "unani"];
  const response = {};

  for (const system of systems) {
    response[system] = await searchInSystem(system, query, limit, offset);
  }

  return response;
}

module.exports = {
  searchInSystem,
  globalSearch
};