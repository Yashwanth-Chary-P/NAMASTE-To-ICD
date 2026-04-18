import React from "react";

const AyurvedhaCard = ({ NAMC_CODE, Short_definition, Long_definition, Ontology_branches }) => {
  return (
    <div className="flex flex-col w-full h-full bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-white/[0.04] hover:border-emerald-500/30 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(16,185,129,0.1)] group relative overflow-hidden text-left">
      
      {/* Subtle top border gradient accent (Emerald for Ayurvedha) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/40 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Header Area */}
      <div className="mb-4">
        {/* NAMC Code Badge */}
        <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400 shadow-sm mb-3">
          {NAMC_CODE || "Unknown Code"}
        </span>
        
        {/* Short Definition / Title */}
        <h3 className="text-lg font-semibold text-white leading-snug tracking-tight">
          {Short_definition || "Ayurvedic Concept"}
        </h3>
      </div>

      {/* Body / Details Area */}
      <div className="flex-1 mb-6">
        <p className="text-sm text-white/60 font-light leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
          {Long_definition || "No detailed definition provided by the registry."}
        </p>
      </div>

      {/* Footer Area (Ontology) */}
      <div className="pt-4 border-t border-white/5 mt-auto">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="text-[10px] uppercase tracking-widest text-white/30 font-semibold flex-shrink-0">
            Ontology:
          </span>
          <span className="text-xs text-white/50 font-mono truncate hover:whitespace-normal transition-all duration-300">
            {Ontology_branches || "N/A"}
          </span>
        </div>
      </div>
      
    </div>
  );
};

export default AyurvedhaCard;