const CODE_FIELD_MAP = {
  ayurveda: "NAMC_CODE",
  siddha: "NAMC_CODE",
  unani: "NUMC_CODE",
  tm2: "code",
  icd11: "code"
};

const SEARCH_FIELDS_MAP = {
  ayurveda: [
    "NAMC_term",
    "NAMC_term_diacritical",
    "Name English",
    "Short_definition",
    "Long_definition",
    "query",
    "normalized_term",
    "search_text"
  ],
  siddha: [
    "NAMC_term",
    "NAMC_term_diacritical",
    "Name English",
    "Short_definition",
    "Long_definition",
    "query",
    "normalized_term",
    "search_text"
  ],
  unani: [
    "NUMC_TERM",
    "NUMC_term",
    "Name English",
    "Short_definition",
    "Long_definition",
    "query",
    "normalized_term",
    "search_text"
  ],
  tm2: [
    "title",
    "search_text",
    "ml_text",
    "index_terms_normalized"
  ],
  icd11: [
    "title",
    "search_text",
    "ml_text"
  ]
};

function getCodeField(system) {
  return CODE_FIELD_MAP[(system || "").toLowerCase()] || "code";
}

function getSearchFields(system) {
  return SEARCH_FIELDS_MAP[(system || "").toLowerCase()] || ["search_text", "title"];
}

function getCollectionName(system, collections) {
  return collections[(system || "").toLowerCase()];
}

module.exports = {
  CODE_FIELD_MAP,
  SEARCH_FIELDS_MAP,
  getCodeField,
  getSearchFields,
  getCollectionName
};