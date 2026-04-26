import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../state/store";
import { mapData, clearMap } from "../../state/features/mapSlice";
import { 
    HiOutlineLink, HiOutlineSwitchHorizontal, HiOutlineX,
    HiOutlineDocumentSearch, HiOutlineDatabase, HiOutlineClipboardCopy,
    HiOutlineBadgeCheck, HiOutlineInformationCircle, HiOutlineArrowRight,
    HiOutlineTerminal, HiOutlineExclamationCircle
} from "react-icons/hi";

const Map = () => {
    const dispatch = useAppDispatch();
    const { source, tm2, icd11, raw, loading, error } = useAppSelector((state) => state.map);

    // Form States
    const [sourceSystem, setSourceSystem] = useState("ayurveda");
    const [code, setCode] = useState("");
    const [target, setTarget] = useState("both");
    const [topK, setTopK] = useState(5);

    // UI States
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedSys, setSelectedSys] = useState("");
    const [showRaw, setShowRaw] = useState(false);

    const handleRunMap = () => {
        if (!code) return;
        dispatch(mapData({ 
            source_system: sourceSystem, 
            code, 
            target, 
            top_k: topK 
        }));
    };

    return (
        <div className=" min-h-screen bg-[#080808] text-zinc-300 font-sans selection:bg-emerald-500/30 p-4 md:p-10">
            
            {/* 1. DETAIL MODAL */}
            {selectedItem && (
                <DetailModal 
                    item={selectedItem} 
                    system={selectedSys} 
                    onClose={() => setSelectedItem(null)} 
                />
            )}

            <div className="max-w-[1600px] mx-auto">
                
                {/* 2. HEADER & ADVANCED CONTROLS */}
                <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end border-b border-white/5 pb-10 mb-10 gap-8">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-emerald-500 mb-2">
                            {/* <HiOutlineLink className="text-xl" /> */}
                            {/* <span className="text-[10px] font-bold tracking-[0.4em] uppercase">Neural Semantic Bridge</span> */}
                        </div>
                        <h1 className="text-3xl font-light text-white tracking-tighter">
                            {/* MAPPING<span className="font-bold text-emerald-500">WORKSTATION</span> */}
                        </h1>
                    </div>

                    <div className="mt-10 w-full xl:w-auto flex flex-wrap gap-3 bg-white/[0.02] p-3 border border-white/10 rounded-xl backdrop-blur-md">
                        <div className="flex flex-col gap-1">
                            <label className="text-[9px] uppercase text-zinc-500 font-bold ml-1">Source System</label>
                            <select 
                                value={sourceSystem} 
                                onChange={(e) => setSourceSystem(e.target.value)}
                                className="bg-black text-[11px] font-bold uppercase text-emerald-500 px-4 py-2.5 border border-white/10 rounded-lg outline-none focus:border-emerald-500"
                            >
                                {["ayurveda", "siddha", "unani", "tm2", "icd11"].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[9px] uppercase text-zinc-500 font-bold ml-1">Entity Code</label>
                            <input 
                                type="text" 
                                placeholder="Enter Code..." 
                                value={code} 
                                onChange={(e) => setCode(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleRunMap()}
                                className="bg-black border border-white/10 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 font-mono w-40 text-white rounded-lg"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[9px] uppercase text-zinc-500 font-bold ml-1">Target</label>
                            <select 
                                value={target} 
                                onChange={(e) => setTarget(e.target.value)}
                                className="bg-black text-[11px] font-bold uppercase text-zinc-400 px-4 py-2.5 border border-white/10 rounded-lg outline-none focus:border-emerald-500"
                            >
                                <option value="both">Both Systems</option>
                                <option value="tm2">TM2 Only</option>
                                <option value="icd11">ICD-11 Only</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[9px] uppercase text-zinc-500 font-bold ml-1">Results</label>
                            <input 
                                type="number" 
                                value={topK} 
                                onChange={(e) => setTopK(parseInt(e.target.value))}
                                className="bg-black border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 font-mono w-16 text-center rounded-lg"
                            />
                        </div>

                        <div className="flex items-end">
                            <button 
                                onClick={handleRunMap} 
                                disabled={loading || !code} 
                                className="h-[42px] bg-emerald-600 hover:bg-emerald-500 disabled:opacity-20 text-black font-black text-[11px] px-8 py-2 uppercase transition-all flex items-center gap-2 rounded-lg"
                            >
                                {loading ? "Computing..." : "Execute Map"} <HiOutlineSwitchHorizontal />
                            </button>
                        </div>
                    </div>
                </header>

                {/* 3. ERROR BANNER */}
                {error && (
                    <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-4 text-red-400 animate-in fade-in">
                        <HiOutlineExclamationCircle className="text-xl shrink-0" />
                        <span className="text-sm font-mono tracking-tight">{error}</span>
                    </div>
                )}

                {/* 4. CONSOLE GRID */}
                <div className="grid lg:grid-cols-12 gap-10">
                    
                    {/* LEFT: SOURCE IDENTITY */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="flex justify-between items-center px-1">
                            <div className="flex items-center gap-2 text-zinc-500">
                                <HiOutlineDocumentSearch size={14}/>
                                <span className="text-[10px] font-black uppercase tracking-widest">Active Source</span>
                            </div>
                            {raw && (
                                <button 
                                    onClick={() => setShowRaw(!showRaw)}
                                    className="text-[9px] font-bold text-emerald-500/50 hover:text-emerald-500 uppercase tracking-tighter"
                                >
                                    {showRaw ? "Hide Debug" : "Show Raw JSON"}
                                </button>
                            )}
                        </div>
                        
                        {source ? (
                            <SourceCard 
                                data={source} 
                                system={sourceSystem} 
                                onClick={() => {setSelectedItem(source); setSelectedSys(sourceSystem);}} 
                            />
                        ) : (
                            <div className="h-[300px] bg-white/[0.01] border border-white/5 border-dashed rounded-[2rem] flex flex-col items-center justify-center text-center p-10">
                                <HiOutlineDatabase className="text-white/5 mb-4 text-5xl" />
                                <p className="text-[10px] uppercase text-white/10 tracking-[0.3em]">Initialize Mapping Sequence</p>
                            </div>
                        )}

                        {showRaw && raw && (
                            <pre className="p-5 bg-black rounded-2xl border border-white/5 text-[10px] font-mono text-emerald-500/70 overflow-x-auto max-h-[400px]">
                                {JSON.stringify(raw, null, 2)}
                            </pre>
                        )}
                    </div>

                    {/* RIGHT: TARGET CANDIDATES */}
                    <div className="lg:col-span-8 space-y-12">
                        {loading ? (
                            <LoadingSkeleton />
                        ) : (
                            <>
                                {(target === "both" || target === "tm2") && (
                                    <MappingGroup 
                                        title="TM2 Logic Predictions" 
                                        data={tm2} 
                                        sys="tm2" 
                                        onSelect={setSelectedItem} 
                                        onSetSys={setSelectedSys} 
                                        color="emerald" 
                                    />
                                )}
                                
                                {(target === "both" || target === "icd11") && (
                                    <MappingGroup 
                                        title="ICD-11 Semantic Matches" 
                                        data={icd11} 
                                        sys="icd11" 
                                        onSelect={setSelectedItem} 
                                        onSetSys={setSelectedSys} 
                                        color="blue" 
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ════════════════════════════════════════════════════════
   SUB-COMPONENTS (Refactored for Cleanliness)
   ════════════════════════════════════════════════════════ */

const SourceCard = ({ data, system, onClick }) => (
    <div 
        onClick={onClick}
        className="bg-[#0d0d0d] border border-emerald-500/20 p-8 rounded-[2.5rem] cursor-pointer hover:bg-emerald-500/[0.03] hover:border-emerald-500/50 transition-all group relative overflow-hidden shadow-2xl"
    >
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
            <HiOutlineBadgeCheck size={120} />
        </div>
        <div className="flex justify-between items-start mb-6">
            <span className="text-[10px] font-mono text-emerald-500 font-black border border-emerald-500/20 px-3 py-1 rounded-md uppercase tracking-tighter bg-emerald-500/5">
                {data.code}
            </span>
            <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> {system}
            </div>
        </div>
        <h2 className="text-3xl font-light text-white mb-4 leading-tight">
            {data.title || data.term || data.NAMC_term || data.NAMC_TERM || data.NUMC_TERM}
        </h2>
        <p className="text-xs text-zinc-500 leading-relaxed font-light italic border-l-2 border-white/5 pl-4 line-clamp-6">
            {data.description || data.Long_definition || data.Short_definition || "No description available."}
        </p>
    </div>
);

const MappingGroup = ({ title, data, sys, onSelect, onSetSys, color }) => (
    <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4 px-2">
            <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${color === 'blue' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`} />
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/50">{title}</span>
            </div>
            <span className="text-[10px] text-zinc-600 font-mono">{data.length} candidates found</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
            {data.map((item, idx) => (
                <div 
                    key={idx} 
                    onClick={() => {onSelect(item); onSetSys(sys);}}
                    className="p-6 bg-white/[0.01] border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/[0.02] cursor-pointer transition-all group rounded-2xl relative"
                >
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-bold text-white/40 border border-white/10 px-2 py-0.5 rounded uppercase tracking-tighter bg-black">
                            {item.code}
                        </span>
                        <div className="flex flex-col items-end">
                            <span className="text-[11px] font-black text-emerald-500/80 tracking-tighter">{(item.score * 100).toFixed(1)}%</span>
                            <div className="w-16 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                                <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${item.score * 100}%` }} />
                            </div>
                        </div>
                    </div>
                    <h4 className="text-sm font-medium text-white/80 group-hover:text-emerald-400 transition-colors mb-2 pr-4">{item.title || item.term}</h4>
                    <HiOutlineArrowRight className="absolute bottom-6 right-6 text-white/0 group-hover:text-emerald-500 transition-all group-hover:translate-x-1" />
                </div>
            ))}
            {data.length === 0 && (
                <div className="col-span-full py-12 text-center bg-white/[0.01] rounded-2xl border border-white/5 border-dashed">
                    <p className="text-[10px] uppercase tracking-widest text-white/10 italic">Null Set Returned</p>
                </div>
            )}
        </div>
    </section>
);

const LoadingSkeleton = () => (
    <div className="space-y-12 animate-pulse">
        {[1, 2].map(g => (
            <div key={g} className="space-y-4">
                <div className="h-4 w-40 bg-white/5 rounded" />
                <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl border border-white/5" />)}
                </div>
            </div>
        ))}
    </div>
);

// DetailModal remains largely the same but used polymorphic title checks
const DetailModal = ({ item, system, onClose }) => {
    const getVal = (keys) => {
        for (let key of keys) {
            if (item[key] !== undefined && item[key] !== null && item[key] !== "-") return item[key];
        }
        return "N/A";
    };

    const techSpecs = [
        { label: "Entity Code", val: getVal(["code", "NAMC_CODE", "NUMC_CODE"]) },
        { label: "System Source", val: system },
        { label: "Internal ID", val: getVal(["NAMC_ID", "NUMC_ID", "Sr No"]) },
        { label: "Normalized Term", val: getVal(["normalized_term", "normalized_title"]) },
        { label: "Confidence Score", val: item.score ? `${(item.score * 100).toFixed(4)}%` : "N/A" },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="absolute inset-0" onClick={onClose} />
            <div className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-3xl flex flex-col max-h-[90vh] shadow-[0_0_100px_rgba(16,185,129,0.1)] overflow-hidden">
                <div className="flex items-center justify-between p-6 bg-white/[0.02] border-b border-white/5">
                    <span className="text-[10px] font-black tracking-[0.3em] text-emerald-500 uppercase flex items-center gap-2">
                        <HiOutlineTerminal /> Registry Node Inspector
                    </span>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-full text-white/40 hover:text-white transition-colors">
                        <HiOutlineX size={18}/>
                    </button>
                </div>

                <div className="p-10 overflow-y-auto grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-10">
                        <div>
                            <h2 className="text-4xl font-light text-white mb-3 leading-tight tracking-tighter">
                                {getVal(["title", "term", "NAMC_term", "NAMC_TERM", "NUMC_TERM"])}
                            </h2>
                            <p className="text-3xl font-serif text-emerald-500 italic opacity-80">
                                {getVal(["NAMC_term_diacritical", "Arabic_term", "Tamil_term"])}
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                                <label className="text-[10px] text-emerald-500 font-black uppercase tracking-widest block mb-4">Semantic Definition</label>
                                <p className="text-zinc-400 leading-relaxed text-sm font-light italic italic">
                                    {getVal(["description", "Long_definition", "Short_definition", "description"])}
                                </p>
                            </div>

                            {item.index_terms && (
                                <div>
                                    <label className="text-[10px] text-white/30 uppercase font-black tracking-widest block mb-4">Registry Synonyms</label>
                                    <div className="flex flex-wrap gap-2">
                                        {(Array.isArray(item.index_terms) ? item.index_terms : (item.index_terms || "").split(';')).map((t, i) => (
                                            <span key={i} className="px-3 py-1 bg-black border border-white/10 rounded-lg text-[11px] text-zinc-500">{t.trim()}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="p-8 bg-white/[0.02] border border-white/5 space-y-6 rounded-2xl">
                            <h4 className="text-[10px] uppercase text-emerald-500 font-black tracking-widest border-b border-white/10 pb-4">Data Context</h4>
                            {techSpecs.map((spec, i) => (
                                <div key={i} className="group">
                                    <span className="block text-[9px] uppercase text-zinc-600 font-black mb-1 group-hover:text-emerald-500/50 transition-colors">{spec.label}</span>
                                    <span className="text-xs text-zinc-300 font-mono break-all">{spec.val}</span>
                                </div>
                            ))}
                            <button 
                                onClick={() => {navigator.clipboard.writeText(JSON.stringify(item, null, 2)); alert("Data Logged to Clipboard");}}
                                className="w-full py-4 mt-6 bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-500 hover:text-black transition-all flex items-center justify-center gap-2"
                            >
                                <HiOutlineClipboardCopy size={14} /> Extract Node
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Map;