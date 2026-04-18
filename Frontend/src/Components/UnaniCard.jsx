import React from "react";

export default function UnaniCard({ code, title, definition }) {
  return (
    <div className="flex flex-col w-full h-full bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-white/[0.04] hover:border-cyan-500/30 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(6,182,212,0.1)] group relative overflow-hidden text-left">
      
      {/* Subtle top border gradient accent (Cyan for Unani) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500/40 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Header Area */}
      <div className="mb-4">
        {/* Unani Code Badge */}
        <span className="inline-block px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-xs font-medium text-cyan-400 shadow-sm mb-3">
          {code || "Unknown Code"}
        </span>
        
        {/* Title */}
        <h3 className="text-lg font-semibold text-white leading-snug tracking-tight">
          {title || "Unani Concept"}
        </h3>
      </div>

      {/* Body / Details Area */}
      <div className="flex-1 mt-2">
        <span className="block text-[10px] uppercase tracking-widest text-white/40 font-semibold mb-1.5">
          Definition
        </span>
        <p className="text-sm text-white/60 font-light leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all duration-500">
          {definition || "No detailed definition provided by the registry."}
        </p>
      </div>

    </div>
  );
}