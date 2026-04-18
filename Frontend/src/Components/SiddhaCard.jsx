import React from "react";

export default function SiddhaCard({ code, title, definition }) {
  return (
    <div className="flex flex-col w-full h-full bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-white/[0.04] hover:border-teal-500/30 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(20,184,166,0.1)] group relative overflow-hidden text-left">
      
      {/* Subtle top border gradient accent (Teal for Siddha) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500/40 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Header Area */}
      <div className="mb-4">
        {/* Siddha Code Badge */}
        <span className="inline-block px-2.5 py-1 rounded-md bg-teal-500/10 border border-teal-500/20 text-xs font-medium text-teal-400 shadow-sm mb-3">
          {code || "Unknown Code"}
        </span>
        
        {/* Title */}
        <h3 className="text-lg font-semibold text-white leading-snug tracking-tight">
          {title || "Siddha Concept"}
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