import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../state/store";
import { searchData, clearSearch } from "../../state/features/searchSlice";
import { 
    HiOutlineSearch, HiOutlineX, HiOutlineArrowRight, 
    HiOutlineDatabase, HiOutlineInformationCircle, HiOutlineViewGrid,
    HiOutlineLightningBolt
} from "react-icons/hi";

const getField = (item, keys) => {
    if (!item) return null;
    for (let key of keys) {
        if (item[key] !== undefined && item[key] !== null && item[key] !== "-") return item[key];
    }
    return null;
};

const Search = () => {
    const dispatch = useAppDispatch();
    
    // SAFE SELECTOR
    const { 
        mode, 
        results = [], 
        global = { ayurveda: [], siddha: [], unani: [] }, 
        loading, 
        error, 
        has_more, 
        offset, 
        system: activeSystem 
    } = useAppSelector((state) => state.search || {});

    const [isGlobal, setIsGlobal] = useState(true);
    const [system, setSystem] = useState("icd11"); // Default focused system
    const [query, setQuery] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);

    const systemsList = ["ayurveda", "siddha", "unani", "tm2", "icd11"];

    // 1. Debounced Search Logic
    useEffect(() => {
        const timer = setTimeout(() => {
            const cleanQuery = query?.trim();
            if (!cleanQuery) {
                dispatch(clearSearch());
                return;
            }
            // Trigger: system is null for Global, or the string name for Focused
            dispatch(searchData({ 
                system: isGlobal ? null : system, 
                q: cleanQuery, 
                offset: 0 
            }));
        }, 500);
        return () => clearTimeout(timer);
    }, [query, system, isGlobal, dispatch]);

    const handleLoadMore = () => {
        if (!query) return;
        dispatch(searchData({ 
            system: isGlobal ? null : system, 
            q: query, 
            offset: offset + 5 
        }));
    };

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans p-6 md:p-12">
            {selectedItem && (
                <DetailModal 
                    item={selectedItem} 
                    system={isGlobal ? "Global Registry" : system} 
                    onClose={() => setSelectedItem(null)} 
                />
            )}

            <div className="max-w-[1400px] mx-auto">
                
                {/* --- HEADER & MODE TOGGLE --- */}
                <header className=" flex flex-col md:flex-row justify-between items-center mb-10 border-b border-white/5 pb-8 gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                            <HiOutlineLightningBolt className="text-emerald-500 text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight uppercase">Registry<span className="text-emerald-500">Explorer</span></h1>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-black">Interoperability Intelligence</p>
                        </div>
                    </div>

                    <div className="mt-10 flex bg-white/5 p-1 border border-white/10 rounded-xl backdrop-blur-md">
                        <button 
                            onClick={() => { setIsGlobal(true); dispatch(clearSearch()); }} 
                            className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${isGlobal ? 'bg-emerald-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                        >
                            Global View
                        </button>
                        <button 
                            onClick={() => { setIsGlobal(false); dispatch(clearSearch()); }} 
                            className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${!isGlobal ? 'bg-emerald-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                        >
                            Focused View
                        </button>
                    </div>
                </header>

                {/* --- SYSTEM SELECTOR (Only shown in Focused Mode) --- */}
                {!isGlobal && (
                    <div className="flex justify-center flex-wrap gap-2 mb-8 animate-in fade-in slide-in-from-top-2 duration-500">
                        {systemsList.map(s => (
                            <button 
                                key={s} 
                                onClick={() => { setSystem(s); dispatch(clearSearch()); }} 
                                className={`px-5 py-2.5 text-[10px] uppercase font-black tracking-widest border transition-all rounded-xl ${system === s ? 'border-emerald-500 text-emerald-500 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-white/5 text-zinc-600 hover:text-zinc-400 hover:border-white/10'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )}

                {/* --- SEARCH INPUT --- */}
                <div className="relative max-w-4xl mx-auto mb-10 group">
                    <HiOutlineSearch className={`absolute left-6 top-1/2 -translate-y-1/2 text-2xl transition-colors ${loading ? 'text-emerald-500 animate-pulse' : 'text-zinc-700 group-focus-within:text-emerald-500'}`} />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={isGlobal ? "Search across all medical traditions..." : `Deep search in ${system.toUpperCase()} registry...`}
                        className="w-full bg-[#0a0a0a] border border-white/10 py-6 pl-16 pr-8 outline-none focus:border-emerald-500/50 transition-all text-xl font-light rounded-3xl shadow-2xl text-white placeholder:text-zinc-800"
                    />
                </div>

                {/* --- ERROR FEEDBACK --- */}
                {error && (
                    <div className="max-w-xl mx-auto p-4 bg-red-500/5 border border-red-500/10 text-red-400 text-xs mb-10 rounded-2xl flex items-center gap-4 font-mono animate-in zoom-in-95">
                        <HiOutlineInformationCircle className="text-xl shrink-0" />
                        <span>{typeof error === 'object' ? (error.message || "Registry Access Error") : String(error)}</span>
                    </div>
                )}

                {/* --- RESULTS DISPLAY --- */}
                <div className="mt-4">
                    {mode === "global" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
                            {global && Object.keys(global).map(sysKey => (
                                global[sysKey]?.length > 0 && (
                                    <div key={sysKey} className="space-y-6">
                                        <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                            <div className="flex items-center gap-2">
                                                <HiOutlineDatabase className="text-emerald-500" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{sysKey}</span>
                                            </div>
                                            <span className="text-[9px] font-mono text-zinc-700">{global[sysKey].length} Hits</span>
                                        </div>
                                        {global[sysKey].map((item, i) => (
                                            <ResultCard key={i} item={item} onClick={() => setSelectedItem(item)} />
                                        ))}
                                    </div>
                                )
                            ))}
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in duration-700">
                            {results && results.map((item, i) => (
                                <ResultCard key={i} item={item} onClick={() => setSelectedItem(item)} />
                            ))}
                            
                            {has_more && (
                                <button 
                                    onClick={handleLoadMore}
                                    disabled={loading}
                                    className="w-full py-5 mt-10 bg-white/[0.02] border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-emerald-600 hover:text-black transition-all disabled:opacity-20 shadow-xl"
                                >
                                    {loading ? "Decrypting Records..." : "Load more entries"}
                                </button>
                            )}
                        </div>
                    )}

                    {/* EMPTY STATE */}
                    {!loading && query && results.length === 0 && 
                     Object.values(global || {}).every(arr => !arr || arr.length === 0) && (
                        <div className="text-center py-32 opacity-10 flex flex-col items-center">
                            <HiOutlineViewGrid className="text-6xl mb-4" />
                            <p className="text-[10px] uppercase font-black tracking-[0.5em]">No matching concepts detected</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* --- SHARED RESULT CARD --- */
const ResultCard = ({ item, onClick }) => (
    <div 
        onClick={onClick} 
        className="group p-6 bg-[#0a0a0a] border border-white/5 hover:border-emerald-500/40 cursor-pointer rounded-[2rem] transition-all relative overflow-hidden shadow-sm"
    >
        <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500" />
        <div className="flex justify-between items-start mb-4">
            <span className="text-[9px] font-mono text-emerald-500/50 border border-emerald-500/20 px-2.5 py-1 rounded-lg uppercase tracking-tighter bg-emerald-500/5">
                {getField(item, ["code", "NAMC_CODE", "NUMC_CODE"])}
            </span>
            <HiOutlineArrowRight className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
        </div>
        <h3 className="text-lg font-medium text-white group-hover:text-emerald-400 mb-3 leading-tight transition-colors">
            {getField(item, ["title", "term", "NAMC_term", "NUMC_TERM", "Name English"])}
        </h3>
        <p className="text-xs text-zinc-600 line-clamp-2 italic font-light leading-relaxed">
            {getField(item, ["Long_definition", "description", "Short_definition"]) || "Deep registry metadata available in node inspector."}
        </p>
    </div>
);

/* --- DETAIL MODAL --- */
const DetailModal = ({ item, system, onClose }) => {
    const navigate = useNavigate();

    const modalCode = getField(item, ["code", "NAMC_CODE", "NUMC_CODE"]);
    const modalSystem =
        getField(item, ["system", "source", "registry", "tradition"]) ||
        (system && system !== "Global Registry" ? system : "");

    const handleLookup = () => {
        if (!modalSystem || !modalCode) return;
        navigate(`/fhir/lookup?system=${encodeURIComponent(modalSystem)}&code=${encodeURIComponent(modalCode)}`);
        onClose();
    };

    const handleMap = () => {
        if (!modalSystem || !modalCode) return;
        navigate(`/fhir/map?system=${encodeURIComponent(modalSystem)}&code=${encodeURIComponent(modalCode)}`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-500">
            <div className="absolute inset-0" onClick={onClose} />
            <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.1)] flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-8 border-b border-white/5 bg-white/[0.01]">
                    <span className="text-emerald-500 font-mono text-[10px] font-black uppercase tracking-[0.3em]">{system} Entry Detail</span>
                    <button onClick={onClose} className="p-3 text-zinc-500 hover:text-white transition-colors bg-white/5 rounded-full hover:scale-110 active:scale-95"><HiOutlineX size={20}/></button>
                </div>

                <div className="p-12 overflow-y-auto grid md:grid-cols-3 gap-12">
                    <div className="md:col-span-2 space-y-12">
                        <div>
                            <h2 className="text-5xl font-light text-white mb-4 leading-[0.9] tracking-tighter">
                                {getField(item, ["NAMC_term_diacritical", "NAMC_term", "title", "term", "Name English"])}
                            </h2>
                            <p className="text-emerald-500 font-serif text-3xl italic opacity-70">
                                {item.NAMC_term_DEVANAGARI || item.Arabic_term || item.Tamil_term}
                            </p>
                        </div>

                        <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] relative">
                            <span className="absolute -top-3 left-8 px-4 bg-[#0a0a0a] text-[9px] uppercase font-black text-zinc-600 tracking-widest">Registry Logic</span>
                            <p className="text-zinc-400 leading-relaxed text-lg italic font-light">
                                {item.Long_definition || item.description || "The conceptual definition for this record is currently undergoing semantic verification."}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-8 self-start">
                        <div className="bg-emerald-500/5 p-8 border border-emerald-500/10 space-y-6 rounded-[2.5rem]">
                            <h4 className="text-[10px] uppercase text-emerald-500 font-black tracking-widest border-b border-emerald-500/20 pb-4">Metadata</h4>
                            <MetaRow label="Standard Code" val={getField(item, ["code", "NAMC_CODE", "NUMC_CODE"])} />
                            <MetaRow label="Native Script" val={item.Arabic_term || item.Tamil_term || "N/A"} />
                            <MetaRow label="Chapter" val={item.chapter || item.Reference || "N/A"} />
                            
                            <div className="space-y-3 mt-6">
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(JSON.stringify(item, null, 2));
                                        alert("Concept Node Captured");
                                    }}
                                    className="w-full py-4 bg-emerald-600 text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-400 transition-all shadow-lg"
                                >
                                    Copy Full Node
                                </button>

                                <button
                                    onClick={handleLookup}
                                    disabled={!modalSystem || !modalCode}
                                    className="w-full py-4 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    View Lookup Details
                                </button>

                                <button
                                    onClick={handleMap}
                                    disabled={!modalSystem || !modalCode}
                                    className="w-full py-4 border border-teal-500/30 text-teal-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-teal-500/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Map This Concept
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetaRow = ({ label, val }) => (
    <div className="space-y-1">
        <span className="block text-[9px] uppercase text-zinc-600 font-black">{label}</span>
        <span className="text-xs text-white/80 font-mono break-all">{val}</span>
    </div>
);

export default Search;