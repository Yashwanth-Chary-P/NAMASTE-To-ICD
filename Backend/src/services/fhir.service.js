const { getCollection } = require("../config/db");
const { COLLECTIONS } = require("../config/constants");
const { getCodeField } = require("../utils/schema");

function firstNonEmpty(doc, keys) {
  for (const key of keys) {
    const value = doc?.[key];
    if (value !== null && value !== undefined && String(value).trim()) {
      return String(value).trim();
    }
  }
  return "";
}

function extractCode(system, doc) {
  const codeField = getCodeField(system);
  const code = firstNonEmpty(doc, [codeField, "code", "Code", "NAMC_CODE", "NUMC_CODE"]);
  if (!code) {
    const err = new Error(`Code not found for system: ${system}`);
    err.statusCode = 400;
    throw err;
  }
  return code;
}

function extractDisplay(doc) {
  return firstNonEmpty(doc, [
    "title",
    "original_title",
    "Name English",
    "NAMC_term_diacritical",
    "NAMC_term",
    "NUMC_TERM",
    "term"
  ]);
}

function buildFhirRecord({
  source_system,
  target_system,
  source_doc,
  target_doc,
  tag = "Equivalent",
  score = 0,
  confidence = "high",
  match_reason = "User selected mapping"
}) {
  const sourceCode = extractCode(source_system, source_doc);
  const targetCode = extractCode(target_system, target_doc);

  const sourceDisplay = extractDisplay(source_doc) || sourceCode;
  const targetDisplay = extractDisplay(target_doc) || targetCode;

  const mappingKey = `${source_system}:${sourceCode}:${target_system}:${targetCode}`;

  return {
    resourceType: "ConceptMap",
    mappingKey,
    status: "active",
    date: new Date().toISOString(),
    sourceSystem: source_system,
    targetSystem: target_system,
    sourceCode,
    targetCode,
    tag,
    score: Number(score) || 0,
    confidence,
    matchReason: match_reason,
    sourceDocument: source_doc,
    targetDocument: target_doc,
    group: [
      {
        source: source_system,
        target: target_system,
        element: [
          {
            code: sourceCode,
            display: sourceDisplay,
            target: [
              {
                code: targetCode,
                display: targetDisplay,
                equivalence:
                  tag === "Equivalent"
                    ? "equal"
                    : tag === "Narrower"
                    ? "narrower"
                    : tag === "Related"
                    ? "relatedto"
                    : "unmatched",
                extension: [
                  {
                    url: "urn:namaste-to-icd:score",
                    valueDecimal: Number(score) || 0
                  },
                  {
                    url: "urn:namaste-to-icd:confidence",
                    valueCode: confidence
                  },
                  {
                    url: "urn:namaste-to-icd:tag",
                    valueCode: tag
                  },
                  {
                    url: "urn:namaste-to-icd:matchReason",
                    valueString: match_reason
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };
}

async function storeFhirRecord(record) {
  const col = getCollection(COLLECTIONS.fhir_mappings);

  await col.updateOne(
    { mappingKey: record.mappingKey },
    { $set: record },
    { upsert: true }
  );

  return record.mappingKey;
}

async function getFhirRecord(mappingKey) {
  const col = getCollection(COLLECTIONS.fhir_mappings);
  return await col.findOne({ mappingKey }, { projection: { _id: 0 } });
}

async function listFhirRecords(limit = 20, offset = 0) {
  const col = getCollection(COLLECTIONS.fhir_mappings);
  return await col
    .find({}, { projection: { _id: 0 } })
    .sort({ date: -1 })
    .skip(Number(offset) || 0)
    .limit(Number(limit) || 20)
    .toArray();
}

module.exports = {
  buildFhirRecord,
  storeFhirRecord,
  getFhirRecord,
  listFhirRecords
};