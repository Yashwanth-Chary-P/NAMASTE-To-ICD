import React, { useState } from "react";
import { HiOutlineSearch, HiOutlineDatabase } from "react-icons/hi";
import { BiLoaderAlt } from "react-icons/bi";

const Mapping = () => {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("search"); // "search" or "namasteCode"
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
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
      setError("Failed to fetch data. Ensure your backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const renderMappingTable = (title, data, type) => {
    if (!data || (Array.isArray(data) && data.length === 0)) return null;

    // Show only max 5 rows
    let displayData = Array.isArray(data) ? data.slice(0, 5) : [data];

    let columns = [];
    let keyMap = {}; 

    if (type === "ayurveda") {
      columns = ["NAMC_CODE", "NAMC_term", "NAMC_term_diacritical", "NAMC_term_DEVANAGARI", "Short_definition", "Long_definition", "Ontology_branches"];
      keyMap = { NAMC_CODE: "NAMC_CODE", NAMC_term: "NAMC_term", NAMC_term_diacritical: "NAMC_term_diacritical", NAMC_term_DEVANAGARI: "NAMC_term_DEVANAGARI", Short_definition: "Short_definition", Long_definition: "Long_definition", Ontology_branches: "Ontology_branches" };
    } else if (type === "siddha") {
      columns = ["NAMC_CODE", "NAMC_TERM", "short_definition", "long_definition_with_symptoms"];
      keyMap = { NAMC_CODE: "NAMC_CODE", NAMC_TERM: "NAMC_TERM", short_definition: "short_definition", long_definition_with_symptoms: "long_definition_with_symptoms" };
    } else if (type === "unani") {
      columns = ["NUMC", "TERM_DIACRITICAL", "short_definition", "long_definition"];
      keyMap = { NUMC: "NUMC", TERM_DIACRITICAL: "TERM_DIACRITICAL", short_definition: "short_definition", long_definition: "long_definition" };
    } else if (type === "namaste") {
      columns = ["NAMC_CODE", "NAMC_TERM", "NAMC_term_diacritical", "NAMC_term_DEVANAGARI", "short_definition", "long_definition_with_symptoms"];
      displayData = [data];
      keyMap = { NAMC_CODE: "NAMC_CODE", NAMC_TERM: "NAMC_TERM", NAMC_term_diacritical: "NAMC_term_diacritical", NAMC_term_DEVANAGARI: "NAMC_term_DEVANAGARI", short_definition: "short_definition", long_definition_with_symptoms: "long_definition_with_symptoms" };
    } else if (type === "icd") {
      columns = ["icd_code", "title", "definition"];
      keyMap = { icd_code: "icd_code", title: "title", definition: "definition" };
    }

    return (
      <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <HiOutlineDatabase className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="font-semibold text-xl text-white tracking-tight">
            {title}
          </h3>
          {Array.isArray(data) && data.length > 5 && (
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-white/50 ml-2">
              Showing 5 of {data.length}
            </span>
          )}
        </div>

        <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                {columns.map(col => (
                  <th key={col} className="px-5 py-4 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    {col.replace(/_/g, " ")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {displayData.map((item, idx) => (
                <tr key={idx} className="hover:bg-white/[0.04] transition-colors duration-200">
                  {columns.map(col => (
                    <td key={col} className="px-5 py-4 text-sm text-white/70 font-light max-w-[300px] truncate hover:whitespace-normal hover:break-words">
                      {item[keyMap[col]] || <span className="text-white/20">-</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-[#04130d] text-white font-sans pt-28 pb-20 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500/30">
      
      {/* ── Ambient Background ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-emerald-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-teal-400/5 rounded-full blur-[120px]" />
        {/* <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div> */}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-bold">Data Mapper</span>
          </span>
          <h1 className="text-4xl sm:text-5xl font-light tracking-tighter text-white mb-4">
            NAMASTE <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">Integration Tool</span>
          </h1>
          <p className="text-white/50 font-light max-w-2xl">
            Map modern clinical terminology to classical traditional medicine codes across Ayurveda, Siddha, and Unani systems.
          </p>
        </div>

        {/* Search & Controls */}
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 mb-12 shadow-[0_0_40px_rgba(16,185,129,0.03)]">
          
          {/* Mode Toggle */}
          <div className="flex p-1 mb-6 bg-white/5 rounded-xl border border-white/10 w-full sm:w-fit">
            <button
              onClick={() => setMode("search")}
              className={`flex-1 sm:px-8 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                mode === "search" ? "bg-white/10 text-white shadow-sm border border-white/5" : "text-white/40 hover:text-white/80"
              }`}
            >
              General Search
            </button>
            <button
              onClick={() => setMode("namasteCode")}
              className={`flex-1 sm:px-8 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                mode === "namasteCode" ? "bg-white/10 text-white shadow-sm border border-white/5" : "text-white/40 hover:text-white/80"
              }`}
            >
              NAMASTE Code
            </button>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <HiOutlineSearch className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-white/40" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={mode === "search" ? "Enter disease, symptom, or keyword..." : "Enter NAMASTE code (e.g., NAMC-...) "}
                className="w-full pl-14 pr-6 py-4 rounded-xl bg-white/5 border border-white/10 text-base text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all duration-300"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-8 py-4 rounded-xl text-base font-medium tracking-wide text-white bg-emerald-600 hover:bg-emerald-500 hover:shadow-[0_4px_20px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center min-w-[140px]"
            >
              {loading ? <BiLoaderAlt className="w-6 h-6 animate-spin" /> : "Search"}
            </button>
          </form>
          
          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3 animate-in fade-in duration-300">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}
        </div>

        {/* Results Container */}
        {results && (
          <div className="mt-8">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-10" />
            
            {mode === "search" && (
              <>
                {renderMappingTable("Ayurveda Matches", results.ayurveda, "ayurveda")}
                {renderMappingTable("Siddha Matches", results.siddha, "siddha")}
                {renderMappingTable("Unani Matches", results.unani, "unani")}
                {results.icd && renderMappingTable("ICD-11 Correlates", results.icd, "icd")}
              </>
            )}

            {mode === "namasteCode" && (
              <>
                {renderMappingTable("NAMASTE Primary Result", results.namaste, "namaste")}
                {results.icd && renderMappingTable("ICD-11 Matches", results.icd, "icd")}
              </>
            )}

            {/* Empty State if completely empty payload */}
            {(!results.ayurveda?.length && !results.siddha?.length && !results.unani?.length && !results.namaste && !results.icd) && (
              <div className="text-center py-20 bg-white/[0.01] rounded-3xl border border-white/5 border-dashed">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <HiOutlineSearch className="w-8 h-8 text-white/30" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No results found</h3>
                <p className="text-sm text-white/50 max-w-sm mx-auto">
                  We couldn't find any corresponding data for "{query}". Try adjusting your search terms or checking the code format.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Mapping;