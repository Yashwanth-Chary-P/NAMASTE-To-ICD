const COLLECTIONS = {
  ayurveda: "traditional_ayurveda",
  siddha: "traditional_siddha",
  unani: "traditional_unani",
  tm2: "tm2",
  icd11: "icd_codes",
  fhir_mappings: "fhir_mappings"
};

const ALLOWED_SYSTEMS = ["ayurveda", "siddha", "unani", "tm2", "icd11"];
const TRADITIONAL_SYSTEMS = ["ayurveda", "siddha", "unani"];
const ALLOWED_TARGETS = ["tm2", "icd11", "both"];

const DEFAULT_LIMIT = 5;
const DEFAULT_TOP_K = 5;
const CANDIDATE_LIMIT = 1000;

module.exports = {
  COLLECTIONS,
  ALLOWED_SYSTEMS,
  TRADITIONAL_SYSTEMS,
  ALLOWED_TARGETS,
  DEFAULT_LIMIT,
  DEFAULT_TOP_K,
  CANDIDATE_LIMIT
};