import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../state/store";
import { searchData, clearSearch } from "../state/features/searchSlice";
import { globalSearch, clearGlobalSearch } from "../state/features/globalSearchSlice";
import { 
    HiOutlineSearch, HiOutlineX, HiOutlineArrowRight,
    HiOutlineDatabase, HiOutlineFilter, HiOutlineClipboardCopy,
    HiOutlineGlobeAlt, HiOutlineInformationCircle
} from "react-icons/hi";

/* ════════════════════════════════════════════════════════
   VARIABLE MAPPING ENGINE (Maps all important API keys)
   ════════════════════════════════════════════════════════ */
const getField = (item, keys) => {
    for (let key of keys) {
        if (item[key] !== undefined && item[key] !== null && item[key] !== "-") return item[key];
    }
    return null;
};

/* ════════════════════════════════════════════════════════
   SUB-COMPONENT: CLINICAL DETAIL MODAL
   ════════════════════════════════════════════════════════ */
const DetailModal = ({ item, system, onClose }) => {
    if (!item) return null;

    // Mapping important variables from your provided JSON structure
    const dataFields = [
        { label: "Standard Code", val: getField(item, ["NAMC_CODE", "NUMC_CODE", "code"]) },
        { label: "Native Term", val: getField(item, ["NAMC_term", "NAMC_TERM", "NUMC_TERM", "Tamil_term", "Arabic_term"]) },
        { label: "English Name", val: getField(item, ["Name English", "Name_English", "title", "term"]) },
        { label: "Internal ID", val: getField(item, ["NAMC_ID", "NUMC_ID"]) },
        { label: "Ontology", val: getField(item, ["Ontology_branches"]) },
        { label: "Reference", val: getField(item, ["Reference", "chapter"]) },
    ];

    return (
        <div className=" fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-sm flex flex-col max-h-[90vh] shadow-2xl">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#111]">
                    <div className="flex items-center gap-4">
                        <span className="text-emerald-500 font-mono text-xs font-bold uppercase tracking-widest">{system} System Record</span>
                        <div className="h-4 w-px bg-white/10" />
                        <span className="text-white/40 font-mono text-[10px]">{getField(item, ["NAMC_CODE", "NUMC_CODE", "code"])}</span>
                    </div>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors"><HiOutlineX size={20}/></button>
                </div>

                {/* Modal Content */}
                <div className="p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Left: Primary Clinical Data */}
                    <div className="md:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-3xl font-medium text-white mb-2">{getField(item, ["NAMC_term_diacritical", "NAMC_term", "title", "term"])}</h2>
                            <p className="text-emerald-400 font-mono text-lg">{item.NAMC_term_DEVANAGARI || item.Arabic_term || item.Tamil_term}</p>
                        </div>

                        <div className="space-y-4">
                            <div className="p-5 bg-white/[0.03] border-l-2 border-emerald-500">
                                <span className="block text-[10px] uppercase text-white/30 font-bold mb-2">Long Definition / Clinical Description</span>
                                <p className="text-white/80 leading-relaxed text-sm font-light italic">
                                    {item.Long_definition || item.description || "Data definition pending."}
                                </p>
                            </div>
                            
                            {item.Short_definition && item.Short_definition !== "-" && (
                                <div className="p-4 bg-white/[0.02] border border-white/5 rounded">
                                    <span className="block text-[10px] uppercase text-white/30 font-bold mb-1">Observation Summary</span>
                                    <p className="text-white/60 text-sm">{item.Short_definition}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Technical Metadata Sidebar */}
                    <div className="bg-white/[0.02] p-6 border border-white/5 space-y-6">
                        <h4 className="text-[10px] uppercase text-emerald-500 font-black tracking-widest border-b border-white/10 pb-2">Technical Specs</h4>
                        {dataFields.map((f, i) => f.val && (
                            <div key={i}>
                                <span className="block text-[9px] uppercase text-white/30 font-bold mb-1">{f.label}</span>
                                <span className="text-xs text-white/80 font-mono break-all">{f.val}</span>
                            </div>
                        ))}
                        <button 
                            onClick={() => {navigator.clipboard.writeText(JSON.stringify(item, null, 2)); alert("Copied Raw JSON");}}
                            className="w-full py-3 mt-4 border border-emerald-500/30 text-emerald-500 text-[10px] font-bold uppercase hover:bg-emerald-500 hover:text-black transition-all"
                        >
                            <HiOutlineClipboardCopy className="inline mr-2" /> Copy Full Node
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════ */
const Search = () => {
    const dispatch = useAppDispatch();
    const single = useAppSelector((state) => state.search);
    const global = useAppSelector((state) => state.globalSearch);

    const [isGlobal, setIsGlobal] = useState(true);
    const [system, setSystem] = useState("icd11");
    const [query, setQuery] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedSystem, setSelectedSystem] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!query.trim()) { dispatch(clearSearch()); dispatch(clearGlobalSearch()); return; }
            isGlobal ? dispatch(globalSearch({ q: query })) : dispatch(searchData({ system, q: query }));
        }, 500);
        return () => clearTimeout(timer);
    }, [query, system, isGlobal, dispatch]);

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500/30">
            {selectedItem && <DetailModal item={selectedItem} system={selectedSystem} onClose={() => setSelectedItem(null)} />}

            <div className="max-w-[1400px] mx-auto px-6 py-12">
                
                {/* CLEAN HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-white/10 pb-8 gap-6">
                    <div>
                        <h1 className="text-3xl font-light tracking-tight">KNOWLEDGE<span className="font-bold text-emerald-500">EXPLORER</span></h1>
                        <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] mt-1">Cross-Terminology Intelligence Engine</p>
                    </div>

                    <div className="flex bg-[#111] p-1 mt-10 border border-white/10">
                        <button onClick={() => setIsGlobal(true)} className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest ${isGlobal ? 'bg-emerald-600 text-white' : 'text-white/40'}`}>All Systems</button>
                        <button onClick={() => setIsGlobal(false)} className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest ${!isGlobal ? 'bg-emerald-600 text-white' : 'text-white/40'}`}>Focused</button>
                    </div>
                </div>

                {/* SEARCH INPUT */}
                <div className="relative max-w-4xl mx-auto mb-16">
                    <HiOutlineSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-5 h-5" />
                    <input
                        type="text"
                        placeholder={isGlobal ? "Querying Ayurveda, Siddha, Unani, ICD-11..." : `Searching ${system.toUpperCase()}...`}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-white/10 py-5 pl-16 pr-8 outline-none focus:border-emerald-500/50 transition-all text-xl font-light"
                    />
                </div>

                {!isGlobal && (
                    <div className="flex justify-center gap-2 mb-12">
                        {["ayurveda", "siddha", "unani", "tm2", "icd11"].map(s => (
                            <button key={s} onClick={() => setSystem(s)} className={`px-4 py-2 text-[10px] uppercase border font-bold ${system === s ? 'border-emerald-500 text-emerald-500' : 'border-white/10 text-white/30'}`}>{s}</button>
                        ))}
                    </div>
                )}

                {/* RESULTS GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {isGlobal ? (
                        Object.keys(global.data).filter(k => global.data[k]?.results?.length > 0).map(sys => (
                            <div key={sys} className="space-y-4">
                                <div className="flex items-center gap-2 mb-6">
                                    <HiOutlineDatabase className="text-emerald-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{sys} Results</span>
                                </div>
                                {global.data[sys].results.map((item, i) => (
                                    <CompactCard key={i} item={item} sys={sys} onClick={() => {setSelectedItem(item); setSelectedSystem(sys);}} />
                                ))}
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full max-w-4xl mx-auto w-full space-y-4">
                            {single.results.map((item, i) => (
                                <CompactCard key={i} item={item} sys={system} onClick={() => {setSelectedItem(item); setSelectedSystem(system);}} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* COMPACT DATA CARD */
const CompactCard = ({ item, sys, onClick }) => (
    <div onClick={onClick} className="group p-5 bg-[#0a0a0a] border border-white/10 hover:border-emerald-500/50 cursor-pointer transition-all">
        <div className="flex justify-between items-start mb-3">
            <span className="text-[9px] font-mono text-emerald-500/60 border border-emerald-500/20 px-1.5 py-0.5">{getField(item, ["NAMC_CODE", "NUMC_CODE", "code"])}</span>
            <HiOutlineArrowRight className="text-white/0 group-hover:text-emerald-500 transition-all" />
        </div>
        <h3 className="text-sm font-medium text-white/90 group-hover:text-emerald-400 transition-colors leading-tight mb-2">
            {getField(item, ["NAMC_term", "NUMC_TERM", "title", "term"])}
        </h3>
        <p className="text-[11px] text-white/30 font-light line-clamp-2 leading-relaxed italic">
            {getField(item, ["Long_definition", "description", "Short_definition"]) || "View detailed record..."}
        </p>
    </div>
);

export default Search;