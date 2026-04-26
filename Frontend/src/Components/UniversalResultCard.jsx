import React from "react";
import {
  HiOutlineTranslate,
  HiOutlineChip,
  HiOutlineClipboardList,
  HiOutlineDatabase,
  HiOutlineHashtag,
  HiOutlineBookOpen
} from "react-icons/hi";

const UniversalResultCard = ({ data }) => {
  if (!data) {
    return (
      <div className="p-10 text-center text-zinc-500">
        No data available
      </div>
    );
  }

  // ✅ SYSTEM DETECTION
  const system = data.system?.toLowerCase();

  // ✅ FIELD EXTRACTION (ROBUST)
  const getField = (keys) => {
    for (let key of keys) {
      if (data[key]) return data[key];
    }
    return null;
  };

  const title = getField([
    "title",
    "Name English",
    "NAMC_term",
    "NUMC_TERM",
    "term"
  ]) || "Unnamed Entity";

  const code = getField([
    "code",
    "Code",
    "NAMC_CODE",
    "NUMC_CODE"
  ]) || "N/A";

  const description = getField([
    "description",
    "Long_definition",
    "Short_definition",
    "Name English"
  ]) || "No description available";

  const nativeTerm = getField([
    "NAMC_term_diacritical",
    "Tamil_term",
    "Arabic_term"
  ]);

  // ✅ CLEAN ATTRIBUTES
  const blacklist = [
    "_id",
    "system",
    "query",
    "search_text",
    "normalized_term"
  ];

  const attributes = Object.entries(data).filter(
    ([k, v]) =>
      !blacklist.includes(k) &&
      v &&
      typeof v !== "object" &&
      v !== "-"
  );

  // ✅ INDEX TERMS SAFE
  const indexTermsRaw =
    data.index_terms ||
    data.indexTerms ||
    data.query ||
    "";

  const indexTerms =
    typeof indexTermsRaw === "string"
      ? indexTermsRaw.split(/[;,]/)
      : Array.isArray(indexTermsRaw)
      ? indexTermsRaw
      : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="p-8 bg-[#0a0a0a] border border-white/10 rounded-3xl">
        <div className="flex justify-between items-start gap-6">

          <div>
            <div className="text-xs text-emerald-400 uppercase tracking-widest mb-2">
              {system} System
            </div>

            <h1 className="text-4xl font-bold text-white">
              {title}
            </h1>

            <div className="text-zinc-500 mt-2 font-mono text-sm">
              {code}
            </div>

            {nativeTerm && (
              <div className="mt-4 flex items-center gap-2 text-emerald-400">
                <HiOutlineTranslate />
                <span className="italic">{nativeTerm}</span>
              </div>
            )}
          </div>

          <HiOutlineDatabase className="text-3xl text-emerald-500 opacity-60" />
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
        <h3 className="text-xs uppercase text-zinc-500 mb-4">
          Description
        </h3>
        <p className="text-lg text-zinc-300 leading-relaxed">
          {description}
        </p>
      </div>

      {/* METADATA */}
      <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
        <h3 className="text-xs uppercase text-zinc-500 mb-6">
          Metadata
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {attributes.slice(0, 10).map(([key, value]) => (
            <div key={key} className="bg-black/40 p-3 rounded-xl">
              <div className="text-[10px] text-zinc-500 uppercase">
                {key.replace(/_/g, " ")}
              </div>
              <div className="text-sm text-white break-all">
                {String(value)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* INDEX TERMS */}
      {indexTerms.length > 0 && (
        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
          <div className="flex items-center gap-2 mb-4 text-zinc-500 text-xs uppercase">
            <HiOutlineClipboardList /> Index Terms
          </div>

          <div className="flex flex-wrap gap-2">
            {indexTerms.map((t, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs bg-black border border-white/10 rounded-full"
              >
                {t.trim()}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversalResultCard;