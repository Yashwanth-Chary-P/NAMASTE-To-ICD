function normalizeText(text) {
  if (text === null || text === undefined) return "";

  return String(text)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegex(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function uniqueKeepOrder(items) {
  const seen = new Set();
  const out = [];

  for (const item of items) {
    if (!item) continue;
    if (!seen.has(item)) {
      seen.add(item);
      out.push(item);
    }
  }

  return out;
}

function extractSearchTerms(query) {
  const raw = String(query || "").trim();
  const normalized = normalizeText(raw);

  const terms = [];
  if (raw) terms.push(raw);
  if (normalized) terms.push(normalized);

  for (const token of normalized.split(" ")) {
    if (token.length >= 2) terms.push(token);
  }

  return uniqueKeepOrder(terms);
}

function highlightText(text, terms) {
  if (!text) return "";

  const termList = Array.isArray(terms)
    ? uniqueKeepOrder(terms.map((t) => String(t).trim()).filter(Boolean))
    : extractSearchTerms(terms);

  let result = String(text);

  for (const term of termList.sort((a, b) => b.length - a.length)) {
    const safe = escapeRegex(term);
    const re = new RegExp(`(${safe})`, "gi");
    result = result.replace(re, "<mark>$1</mark>");
  }

  return result;
}

module.exports = {
  normalizeText,
  escapeRegex,
  extractSearchTerms,
  highlightText,
  uniqueKeepOrder
};