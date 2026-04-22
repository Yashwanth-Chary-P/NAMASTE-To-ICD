import React, { useState } from "react";
import axios from "axios";
import { HiOutlineSearch, HiOutlineGlobeAlt } from "react-icons/hi";
import { BiLoaderAlt } from "react-icons/bi";

const IcdSearch = () => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    if (e) e.preventDefault(); // Handle form submission
    if (!query) return;

    setLoading(true);
    setError("");
    setData([]);

    try {
      // 1️⃣ Get token first
      const tokenRes = await axios.post(
        "http://localhost:5000/api/icd/token"
      );

      const token = tokenRes.data.access_token;

      // 2️⃣ Call search API with token
      const res = await axios.get(
        `http://localhost:5000/api/icd/search/${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(res.data.entities);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch ICD data. Please check your connection or API.");
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-[#04130d] text-white font-sans pt-24 pb-20 px-4 sm:px-6 lg:px-8 selection:bg-blue-500/30">
      
      {/* ── Ambient Background ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-blue-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-teal-400/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold">WHO Database</span>
          </span>
          <h1 className="text-4xl sm:text-5xl font-light tracking-tighter text-white mb-4">
            ICD-11 <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">Search Engine</span>
          </h1>
          <p className="text-white/50 font-light max-w-2xl">
            Directly query the official WHO International Classification of Diseases database for standard codes and definitions.
          </p>
        </div>

        {/* Search Controls */}
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 mb-12 shadow-[0_0_40px_rgba(59,130,246,0.03)] animate-in fade-in zoom-in-95 duration-500">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <HiOutlineSearch className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-white/40" />
              <input
                type="text"
                placeholder="Enter term (e.g. fever, diabetes, asthma)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-xl bg-white/5 border border-white/10 text-base text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-8 py-4 rounded-xl text-base font-semibold tracking-wide text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center min-w-[140px]"
            >
              {loading ? <BiLoaderAlt className="w-6 h-6 animate-spin" /> : "Search"}
            </button>
          </form>

          {/* ❌ ERROR */}
          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3 animate-in fade-in duration-300">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}
        </div>

        {/* 📊 TABLE / RESULTS AREA */}
        <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700">
          {!loading && data.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <HiOutlineGlobeAlt className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-semibold text-xl text-white tracking-tight">
                  Search Results
                </h3>
                <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-white/50 ml-2">
                  Found {data.length} records
                </span>
              </div>

              <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="px-6 py-4 text-xs font-semibold text-blue-400 uppercase tracking-wider w-[150px]">ICD Code</th>
                      <th className="px-6 py-4 text-xs font-semibold text-blue-400 uppercase tracking-wider w-[250px]">Title</th>
                      <th className="px-6 py-4 text-xs font-semibold text-blue-400 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {data.map((item, index) => (
                      <tr key={index} className="hover:bg-white/[0.04] transition-colors duration-200 group">
                        <td className="px-6 py-4">
                          <span className="inline-block px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-xs font-mono font-medium text-blue-300 shadow-sm">
                            {item.code || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-white/90 whitespace-normal">
                          {item.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-white/60 font-light max-w-[400px] truncate group-hover:whitespace-normal group-hover:break-words transition-all duration-300">
                          {item.definition || item.description || <span className="text-white/20 italic">No description available</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && data.length === 0 && !error && (
            <div className="text-center py-20 bg-white/[0.01] rounded-3xl border border-white/5 border-dashed">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <HiOutlineSearch className="w-8 h-8 text-white/30" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                {query ? "No results found" : "Ready to search"}
              </h3>
              <p className="text-sm text-white/50 max-w-sm mx-auto">
                {query 
                  ? `We couldn't find any ICD records matching "${query}". Try a different medical term.` 
                  : "Enter a disease, symptom, or keyword above to fetch official ICD-11 classification data."}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default IcdSearch;