import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from "../state/store";
import { getLookupData, clearLookup } from "../state/features/lookupSlice";
import { 
    HiOutlineSearch, HiOutlineDatabase, HiOutlineCode, HiOutlineTrash, 
    HiOutlineClipboardCopy, HiOutlineTerminal, HiOutlineDocumentText,
    HiOutlineExclamationCircle, HiOutlineChevronRight
} from "react-icons/hi";

/* ════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ════════════════════════════════════════════════════════ */
const InfoField = ({ label, value, fullWidth = false }) => {
    if (!value) return null;
    return (
        <div className={`${fullWidth ? 'col-span-full' : 'col-span-1'} p-4 rounded-2xl bg-white/[0.03] border border-white/5`}>
            <span className="block text-[10px] uppercase tracking-[0.15em] text-emerald-500/60 font-bold mb-1">{label}</span>
            <span className="text-white/90 text-sm leading-relaxed">{value}</span>
        </div>
    );
};

const Lookup = () => {
    const dispatch = useAppDispatch();
    const { data, loading, error } = useAppSelector((state) => state.lookup);
    const [system, setSystem] = useState("");
    const [code, setCode] = useState("");
    const [viewRaw, setViewRaw] = useState(false);

    const systemsList = ["ayurveda", "siddha", "unani", "tm2", "icd11"];

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        alert("JSON copied to clipboard!");
    };

    return (
        <div className="relative min-h-screen bg-[#04130d] text-white font-sans p-4 md:p-10">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[60vw] h-[60vw] bg-emerald-600/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-teal-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <header className="mb-12">
                    {/* <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                        System Interoperability
                    </span>
                    <h1 className="text-5xl font-light tracking-tighter mt-4">Terminology <span className="font-semibold text-emerald-400">Lookup</span></h1> */}
                </header>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Control Panel */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="p-6 rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] shadow-2xl">
                            <div className="space-y-5">
                                <div>
                                    <label className="text-[10px] text-white/40 uppercase mb-2 block ml-1">Classification System</label>
                                    <select 
                                        value={system}
                                        onChange={(e) => setSystem(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-emerald-500/50 transition-all text-sm capitalize"
                                    >
                                        <option value="">Select system...</option>
                                        {systemsList.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] text-white/40 uppercase mb-2 block ml-1">Entity Code</label>
                                    <input 
                                        type="text"
                                        placeholder="Enter Code (e.g. 5A11)"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-emerald-500/50 transition-all text-sm"
                                    />
                                </div>

                                <button 
                                    onClick={() => dispatch(getLookupData({ system, code }))}
                                    disabled={loading || !system || !code}
                                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 text-[#04130d] font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"
                                >
                                    {loading ? "Searching..." : "Fetch Records"} <HiOutlineChevronRight />
                                </button>
                                
                                <button onClick={() => dispatch(clearLookup())} className="w-full text-white/30 text-xs hover:text-white transition-colors flex items-center justify-center gap-2">
                                    <HiOutlineTrash /> Reset Interface
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results Display */}
                    <div className="lg:col-span-8">
                        <div className="min-h-[500px] rounded-3xl bg-white/[0.02] border border-white/[0.08] overflow-hidden flex flex-col">
                            {/* Toolbar */}
                            <div className="px-6 py-4 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <HiOutlineTerminal className="text-emerald-500" />
                                    <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Response Console</span>
                                </div>
                                {data && (
                                    <div className="flex gap-4">
                                        <button onClick={() => setViewRaw(!viewRaw)} className="text-[10px] uppercase font-bold text-emerald-500 hover:text-emerald-400">
                                            {viewRaw ? "[ View Report ]" : "[ View Raw JSON ]"}
                                        </button>
                                        <button onClick={handleCopy} className="text-white/40 hover:text-white transition-colors">
                                            <HiOutlineClipboardCopy size={18} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Main Content Area */}
                            <div className="p-8 flex-1">
                                {loading && (
                                    <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-50">
                                        <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                        <p className="text-xs font-mono uppercase tracking-[0.3em]">Querying Database...</p>
                                    </div>
                                )}

                                {error && (
                                    <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20 text-red-400 flex gap-4">
                                        <HiOutlineExclamationCircle size={24} className="shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-sm uppercase mb-1">Server Exception</h4>
                                            <p className="text-xs opacity-80 leading-relaxed font-mono">{error.message || "Failed to reach service."}</p>
                                        </div>
                                    </div>
                                )}

                                {!data && !loading && !error && (
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-20">
                                        <HiOutlineDocumentText size={64} />
                                        <p className="max-w-[200px] text-sm uppercase tracking-widest">No active record selected</p>
                                    </div>
                                )}

                                {data && !viewRaw && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <div className="flex items-start justify-between mb-8">
                                            <div>
                                                <h2 className="text-3xl font-semibold text-white tracking-tight">{data.title || data.term}</h2>
                                                <div className="flex gap-2 mt-3">
                                                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">CODE: {data.code}</span>
                                                    <span className="px-2 py-0.5 rounded bg-white/5 text-white/50 text-[10px] font-mono border border-white/10 uppercase">{system}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <InfoField label="Description" value={data.description} fullWidth />
                                            <InfoField label="Index Terms" value={data.index_terms} fullWidth />
                                            <InfoField label="Inclusions" value={data.inclusions} />
                                            <InfoField label="Exclusions" value={data.exclusions} />
                                            <InfoField label="Chapter" value={data.chapter} />
                                            <InfoField label="Normalized Title" value={data.normalized_title} />
                                        </div>
                                    </div>
                                )}

                                {data && viewRaw && (
                                    <pre className="text-xs font-mono text-emerald-400/80 leading-relaxed bg-black/20 p-6 rounded-2xl border border-white/5 overflow-x-auto">
                                        {JSON.stringify(data, null, 4)}
                                    </pre>
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