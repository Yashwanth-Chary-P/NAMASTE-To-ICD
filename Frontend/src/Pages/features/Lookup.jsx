import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from "../../state/store";
import { getLookupData, clearLookup } from "../../state/features/lookupSlice";
import { 
    HiOutlineSearch, HiOutlineDatabase, HiOutlineTrash, 
    HiOutlineClipboardCopy, HiOutlineTerminal, HiOutlineDocumentText,
    HiOutlineExclamationCircle, HiOutlineChevronRight, HiOutlineExternalLink
} from "react-icons/hi";
import UniversalResultCard from '../../Components/UniversalResultCard';

/* ════════════════════════════════════════════════════════
   UTILITIES & SUB-COMPONENTS
   ════════════════════════════════════════════════════════ */
const getField = (data, keys) => {
    const found = keys.find(key => data[key] !== undefined && data[key] !== null);
    return data[found] || "";
};

const InfoField = ({ label, value, fullWidth = false }) => {
    if (!value) return null;
    return (
        <div className={`${fullWidth ? 'col-span-full' : 'col-span-1'} p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors`}>
            <span className="block text-[10px] uppercase tracking-[0.15em] text-emerald-500/60 font-bold mb-1">{label}</span>
            <span className="text-white/90 text-sm leading-relaxed">{value}</span>
        </div>
    );
};

const Lookup = () => {
    const dispatch = useAppDispatch();
    const { current: data, loading, error } = useAppSelector((state) => state.lookup);
    const [system, setSystem] = useState("");
    const [code, setCode] = useState("");
    const [viewRaw, setViewRaw] = useState(false);

    const systemsList = ["ayurveda", "siddha", "unani", "tm2", "icd11"];

    // Dynamic field extraction based on your API samples
    const displayTitle = data ? getField(data, ["title", "NAMC_term", "NUMC_TERM", "NAMC_term_diacritical"]) : "";
    const displayEnglish = data ? getField(data, ["Name English"]) : "";
    const displayCode = data ? getField(data, ["code", "NAMC_CODE", "NUMC_CODE"]) : "";
    const displayDesc = data ? getField(data, ["Long_definition", "Short_definition", "ml_text", "description"]) : "";

    const handleCopy = () => {
        if (!data) return;
        navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        alert("JSON copied to clipboard!");
    };

    return (
        <div className="relative min-h-screen bg-[#04130d] text-white font-sans p-4 md:p-10 selection:bg-emerald-500/30">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[60vw] h-[60vw] bg-emerald-600/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-teal-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <header className="mb-12">
                    <div className="flex items-center gap-3 text-emerald-500 mb-2">
                        <HiOutlineSearch className="text-xl" />
                        {/* <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Terminology Discovery</span> */}
                    </div>
                    {/* <h1 className="text-4xl md:text-5xl font-light tracking-tighter">
                        Cross-System <span className="font-semibold text-emerald-400 italic">Lookup</span>
                    </h1> */}
                </header>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Control Panel */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="p-6 rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] shadow-2xl">
                            <div className="space-y-5">
                                <div>
                                    <label className="text-[10px] text-white/40 uppercase mb-2 block ml-1 font-bold tracking-widest">Classification System</label>
                                    <select 
                                        value={system}
                                        onChange={(e) => setSystem(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-emerald-500/50 transition-all text-sm capitalize appearance-none cursor-pointer hover:border-white/20"
                                    >
                                        <option value="">Select system...</option>
                                        {systemsList.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] text-white/40 uppercase mb-2 block ml-1 font-bold tracking-widest">Entity Code</label>
                                    <input 
                                        type="text"
                                        placeholder="Enter Code (e.g. 5A11, AYU001)"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && system && code && dispatch(getLookupData({ system, code }))}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-emerald-500/50 transition-all text-sm font-mono tracking-wider"
                                    />
                                </div>

                                <button 
                                    onClick={() => dispatch(getLookupData({ system, code }))}
                                    disabled={loading || !system || !code}
                                    className="group w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-20 text-[#04130d] font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 active:scale-[0.98]"
                                >
                                    {loading ? "Decrypting..." : "Search Records"} 
                                    <HiOutlineChevronRight className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                
                                <button 
                                    onClick={() => {
                                        dispatch(clearLookup());
                                        setSystem("");
                                        setCode("");
                                    }} 
                                    className="w-full text-white/30 text-[10px] uppercase font-bold tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2"
                                >
                                    <HiOutlineTrash /> Clear Console
                                </button>
                            </div>
                        </div>

                        {/* Helper Tip */}
                        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                            <p className="text-[10px] text-emerald-400/60 leading-relaxed uppercase tracking-tighter">
                                Tip: Use codes like <span className="text-emerald-400">5A11</span> (ICD-11) or <span className="text-emerald-400">AYU001</span> (Ayurveda) to fetch metadata.
                            </p>
                        </div>
                    </div>

                    {/* Results Display */}
                    <div className="lg:col-span-8">
                        <div className="min-h-[550px] rounded-3xl bg-white/[0.02] border border-white/[0.08] overflow-hidden flex flex-col backdrop-blur-sm">
                            {/* Toolbar */}
                            <div className="px-6 py-4 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-500 animate-pulse' : data ? 'bg-emerald-500' : 'bg-white/10'}`} />
                                    <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Registry Interface</span>
                                </div>
                                {data && (
                                    <div className="flex items-center gap-4">
                                        <button 
                                            onClick={() => setViewRaw(!viewRaw)} 
                                            className="text-[10px] uppercase font-black text-emerald-500 hover:text-emerald-300 transition-colors tracking-tighter"
                                        >
                                            {viewRaw ? "[ View Visual Report ]" : "[ View Raw Object ]"}
                                        </button>
                                        <button onClick={handleCopy} className="text-white/40 hover:text-white transition-colors">
                                            <HiOutlineClipboardCopy size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Main Content Area */}
                            <div className="p-8 flex-1 overflow-y-auto">
                                {loading && (
                                    <div className="h-full flex flex-col items-center justify-center space-y-6">
                                        <div className="relative">
                                            <div className="w-16 h-16 border-2 border-emerald-500/20 rounded-full" />
                                            <div className="absolute inset-0 w-16 h-16 border-t-2 border-emerald-500 rounded-full animate-spin" />
                                        </div>
                                        <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-emerald-500 animate-pulse">Accessing Distributed Registry...</p>
                                    </div>
                                )}

                                {error && (
                                    <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/10 text-red-400 flex gap-5 animate-in fade-in zoom-in duration-300">
                                        <HiOutlineExclamationCircle size={32} className="shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-lg tracking-tight mb-1">Entity Not Found</h4>
                                            <p className="text-sm opacity-60 leading-relaxed font-mono">
                                                {typeof error === 'string' ? error : error.message || "The requested code does not exist in our indices."}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {!data && !loading && !error && (
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-10 py-20">
                                        <HiOutlineDocumentText size={80} strokeWidth={1} />
                                        <p className="max-w-[200px] text-[10px] uppercase tracking-[0.3em] font-bold">Waiting for input signal...</p>
                                    </div>
                                )}

                                {data && !viewRaw && <UniversalResultCard data={data} />}

                                {data && viewRaw && (
                                    <div className="animate-in fade-in zoom-in duration-500">
                                        <pre className="text-xs font-mono text-emerald-400/80 leading-relaxed bg-black/40 p-8 rounded-3xl border border-white/10 overflow-x-auto shadow-inner">
                                            {JSON.stringify(data, null, 4)}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Lookup;