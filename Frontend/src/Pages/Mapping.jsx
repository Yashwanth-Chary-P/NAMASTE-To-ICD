import React, { useState } from "react";

const Mapping = () => {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("search"); // "search" or "namasteCode"
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      let url = mode === "search"
        ? `http://localhost:5000/api/search?q=${encodeURIComponent(query)}`
        : `http://localhost:5000/api/search/namaste/${encodeURIComponent(query)}`;

      const res = await fetch(url);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const renderMappingTable = (title, data, type) => {
    if (!data || (Array.isArray(data) && data.length === 0)) return <p>No {title} results</p>;

    // Show only max 5 rows
    let displayData = Array.isArray(data) ? data.slice(0, 5) : [data];

    let columns = [];
    let keyMap = {}; // maps backend keys -> table columns

    if (type === "ayurveda") {
      columns = ["NAMC_CODE", "NAMC_term", "NAMC_term_diacritical", "NAMC_term_DEVANAGARI", "Short_definition", "Long_definition", "Ontology_branches"];
      keyMap = {
        NAMC_CODE: "NAMC_CODE",
        NAMC_term: "NAMC_term",
        NAMC_term_diacritical: "NAMC_term_diacritical",
        NAMC_term_DEVANAGARI: "NAMC_term_DEVANAGARI",
        Short_definition: "Short_definition",
        Long_definition: "Long_definition",
        Ontology_branches: "Ontology_branches"
      };
    } else if (type === "siddha") {
      columns = ["NAMC_CODE", "NAMC_TERM", "short_definition", "long_definition_with_symptoms"];
      keyMap = {
        NAMC_CODE: "NAMC_CODE",
        NAMC_TERM: "NAMC_TERM",
        short_definition: "short_definition",
        long_definition_with_symptoms: "long_definition_with_symptoms"
      };
    } else if (type === "unani") {
      columns = ["NUMC", "TERM_DIACRITICAL", "short_definition", "long_definition"];
      keyMap = {
        NUMC: "NUMC",
        TERM_DIACRITICAL: "TERM_DIACRITICAL",
        short_definition: "short_definition",
        long_definition: "long_definition"
      };
    } else if (type === "namaste") {
      columns = ["NAMC_CODE", "NAMC_TERM", "NAMC_term_diacritical", "NAMC_term_DEVANAGARI", "short_definition", "long_definition_with_symptoms"];
      displayData = [data];
      keyMap = {
        NAMC_CODE: "NAMC_CODE",
        NAMC_TERM: "NAMC_TERM",
        NAMC_term_diacritical: "NAMC_term_diacritical",
        NAMC_term_DEVANAGARI: "NAMC_term_DEVANAGARI",
        short_definition: "short_definition",
        long_definition_with_symptoms: "long_definition_with_symptoms"
      };
    } else if (type === "icd") {
      columns = ["icd_code", "title", "definition"];
      keyMap = {
        icd_code: "icd_code",
        title: "title",
        definition: "definition"
      };
    }

    return (
      <div className="mb-6">
        <h3 className="font-bold text-lg mb-2">
          {title} {Array.isArray(data) && data.length > 5 ? `(showing 5 of ${data.length})` : ""}
        </h3>
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr className="bg-gray-200">
              {columns.map(col => (
                <th key={col} className="border border-gray-300 px-2 py-1">{col.replace(/_/g, " ")}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayData.map((item, idx) => (
              <tr key={idx} className="even:bg-gray-50">
                {columns.map(col => (
                  <td key={col} className="border border-gray-300 px-2 py-1">
                    {item[keyMap[col]] || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">NAMASTE Mapping</h1>

      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={mode === "search" ? "Enter keyword" : "Enter NAMASTE code"}
          className="border border-gray-300 px-2 py-1 flex-1"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Search
        </button>
      </div>

      <div className="mb-4 flex gap-4">
        <label>
          <input
            type="radio"
            value="search"
            checked={mode === "search"}
            onChange={() => setMode("search")}
            className="mr-1"
          />
          General Search
        </label>
        <label>
          <input
            type="radio"
            value="namasteCode"
            checked={mode === "namasteCode"}
            onChange={() => setMode("namasteCode")}
            className="mr-1"
          />
          NAMASTE Code
        </label>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {results && mode === "search" && (
        <div>
          {renderMappingTable("Ayurveda", results.ayurveda, "ayurveda")}
          {renderMappingTable("Siddha", results.siddha, "siddha")}
          {renderMappingTable("Unani", results.unani, "unani")}
          {results.icd && renderMappingTable("ICD Result", results.icd, "icd")}
        </div>
      )}

      {results && mode === "namasteCode" && (
        <div>
          {renderMappingTable("NAMASTE Result", results.namaste, "namaste")}
          {results.icd && renderMappingTable("ICD Matches", results.icd, "icd")}
        </div>
      )}
    </div>
  );
};

export default Mapping;
