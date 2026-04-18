import React from "react";

const ICDCard = ({ code, title, definition, score, entityId }) => {
  // Handle cases where score might be missing or undefined
  const roundedScore = score ? (score * 100).toFixed(1) : null;

  return (
    <div className="flex flex-col w-full h-full bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-white/[0.04] hover:border-blue-500/30 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(59,130,246,0.1)] group relative overflow-hidden text-left">
      
      {/* Subtle top border gradient accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/40 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Header Area */}
      <div className="flex justify-between items-start gap-4 mb-5">
        <h3 className="text-lg font-semibold text-white leading-snug tracking-tight">
          {title || "Untitled Concept"}
        </h3>
        {roundedScore && (
          <span className="flex-shrink-0 inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400 shadow-sm">
            {roundedScore}%
          </span>
        )}
      </div>

      {/* Details Area */}
      <div className="flex-1 space-y-4 mb-6">
        <div>
          <span className="block text-[10px] uppercase tracking-widest text-white/40 font-semibold mb-1.5">
            ICD-11 Code
          </span>
          <span className="inline-block px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-white/90">
            {code || "N/A"}
          </span>
        </div>

        <div>
          <span className="block text-[10px] uppercase tracking-widest text-white/40 font-semibold mb-1.5">
            Definition
          </span>
          <p className="text-sm text-white/60 font-light leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
            {definition || "No definition provided by the registry."}
          </p>
        </div>
      </div>

      {/* Footer Area */}
      <div className="pt-4 border-t border-white/5 mt-auto">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="text-[10px] uppercase tracking-widest text-white/30 font-semibold flex-shrink-0">
            Entity ID:
          </span>
          <span className="text-xs text-white/50 font-mono truncate">
            {entityId || "N/A"}
          </span>
        </div>
      </div>
      
    </div>
  );
};

export default ICDCard;