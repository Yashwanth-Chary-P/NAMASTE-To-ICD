import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../state/store";
import { mapData, clearMap } from "../state/features/mapSlice";
import { 
    HiOutlineLink, HiOutlineSwitchHorizontal, HiOutlineX,
    HiOutlineDocumentSearch, HiOutlineDatabase, HiOutlineClipboardCopy,
    HiOutlineBadgeCheck, HiOutlineInformationCircle, HiOutlineArrowRight
} from "react-icons/hi";

/* ════════════════════════════════════════════════════════
   SUB-COMPONENT: UNIVERSAL DETAIL MODAL
   ════════════════════════════════════════════════════════ */
const DetailModal = ({ item, system, onClose }) => {
    if (!item) return null;

    // Helper to extract data regardless of system-specific naming
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
        { label: "Native Script", val: getVal(["NAMC_term_DEVANAGARI", "Arabic_term", "Tamil_term"]) },
        { label: "Mapping Score", val: item.score ? `${(item.score * 100).toFixed(2)}%` : "Source Record" },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="absolute inset-0" onClick={onClose} />
            <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-sm flex flex-col max-h-[90vh] shadow-2xl">
                
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-[#111] border-b border-white/10">
                    <div className="flex items-center gap-4 text-[10px] font-bold tracking-[0.2em] text-emerald-500 uppercase">
                        Record Inspector | {getVal(["code", "NAMC_CODE", "NUMC_CODE"])}
                    </div>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors"><HiOutlineX size={20}/></button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-3xl font-light text-white mb-2 leading-tight">
                                {getVal(["title", "term", "NAMC_term", "NUMC_TERM"])}
                            </h2>
                            <p className="text-2xl text-emerald-500 font-serif">
                                {getVal(["NAMC_term_DEVANAGARI", "Arabic_term", "Tamil_term"])}
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] text-white/30 uppercase font-bold block mb-2">Detailed Clinical Description</label>
                                <div className="p-5 bg-white/[0.03] border-l-2 border-emerald-500 text-white/80 leading-relaxed text-sm font-light italic">
                                    {getVal(["description", "Long_definition", "Short_definition"])}
                                </div>
                            </div>

                            {item.index_terms && (
                                <div>
                                    <label className="text-[10px] text-white/30 uppercase font-bold block mb-2">Search / Index Terms</label>
                                    <div className="text-xs text-white/50 leading-relaxed max-h-32 overflow-y-auto bg-black/20 p-3">
                                        {Array.isArray(item.index_terms) ? item.index_terms.join("; ") : item.index_terms}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Technical Specs Sidebar */}
                    <div className="bg-white/[0.02] p-6 border border-white/5 space-y-6 rounded-sm">
                        <h4 className="text-[10px] uppercase text-emerald-500 font-black tracking-widest border-b border-white/10 pb-2">Technical Metadata</h4>
                        {techSpecs.map((spec, i) => (
                            <div key={i}>
                                <span className="block text-[9px] uppercase text-white/30 font-bold mb-1">{spec.label}</span>
                                <span className="text-xs text-white/80 font-mono break-all">{spec.val}</span>
                            </div>
                        ))}
                        <button 
                            onClick={() => {navigator.clipboard.writeText(JSON.stringify(item, null, 2)); alert("JSON Captured");}}
                            className="w-full py-3 mt-4 border border-emerald-500/30 text-emerald-500 text-[10px] font-bold uppercase hover:bg-emerald-500 hover:text-black transition-all"
                        >
                            <HiOutlineClipboardCopy className="inline mr-2" /> Copy Raw Node
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ════════════════════════════════════════════════════════
   MAIN MAP COMPONENT
   ════════════════════════════════════════════════════════ */
const Map = () => {
    const dispatch = useAppDispatch();
    const { source, tm2, icd11, loading, error } = useAppSelector((state) => state.map);

    const [sourceSystem, setSourceSystem] = useState("ayurveda");
    const [code, setCode] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedSys, setSelectedSys] = useState("");

    const handleRunMap = () => {
        if (!code) return;
        dispatch(mapData({ source_system: sourceSystem, code, top_k: 5 }));
    };

    return (
        <div className="min-h-screen bg-[#080808] text-white font-sans selection:bg-emerald-500/30 p-6 md:p-12">
            
            {/* Modal Activation */}
            {selectedItem && <DetailModal item={selectedItem} system={selectedSys} onClose={() => setSelectedItem(null)} />}

            <div className="max-w-[1440px] mx-auto px-6">
                
                {/* Header & Controls */}
                <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-10 mb-12 gap-8">
                    <div>
                        {/* <h1 className="text-3xl font-light tracking-tight">MAPPING<span className="font-bold text-emerald-500">WORKSTATION</span></h1>
                        <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] mt-1">Cross-Terminology Neural Bridge</p> */}
                    </div>

                    <div className="flex flex-wrap gap-2 bg-[#111] p-2 mt-10 border border-white/10 rounded-sm">
                        <select 
                            value={sourceSystem} 
                            onChange={(e) => setSourceSystem(e.target.value)}
                            className="bg-black text-[10px] font-bold uppercase tracking-widest px-4 py-2 border border-white/5 outline-none focus:border-emerald-500"
                        >
                            {["ayurveda", "siddha", "unani", "tm2", "icd11"].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <input 
                            type="text" 
                            placeholder="Source Code..." 
                            value={code} 
                            onChange={(e) => setCode(e.target.value)}
                            className="bg-black border border-white/5 px-4 py-2 text-sm outline-none focus:border-emerald-500 font-mono w-40"
                        />
                        <button onClick={handleRunMap} disabled={loading} className="bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-[10px] px-6 py-2 uppercase transition-all flex items-center gap-2">
                            {loading ? "Mapping..." : "Execute Map"} <HiOutlineSwitchHorizontal />
                        </button>
                    </div>
                </div>

                {/* Console Grid */}
                <div className="grid lg:grid-cols-12 gap-10">
                    
                    {/* LEFT: SOURCE DATA */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="flex items-center gap-2 opacity-30 mb-2">
                            <HiOutlineDocumentSearch size={16}/>
                            <span className="text-[10px] font-black uppercase tracking-widest">Active Source</span>
                        </div>
                        
                        {source ? (
                            <div 
                                onClick={() => {setSelectedItem(source); setSelectedSys(sourceSystem);}}
                                className="bg-[#0d0d0d] border border-emerald-500/30 p-8 cursor-pointer hover:bg-emerald-500/[0.02] transition-all group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] font-mono text-emerald-500 font-bold border border-emerald-500/20 px-2 py-0.5 uppercase tracking-tighter">
                                        {source.code}
                                    </span>
                                    <HiOutlineInformationCircle className="text-white/20 group-hover:text-emerald-500 transition-colors" size={20}/>
                                </div>
                                <h2 className="text-2xl font-medium text-white mb-4 leading-tight">{source.title || source.term}</h2>
                                <p className="text-[11px] text-white/40 leading-relaxed font-light italic line-clamp-4 italic border-l border-white/10 pl-4">
                                    {source.description}
                                </p>
                            </div>
                        ) : (
                            <div className="h-64 border border-white/5 border-dashed flex items-center justify-center text-white/10 text-[10px] uppercase tracking-widest">
                                Waiting for data fetch...
                            </div>
                        )}
                    </div>

                    {/* RIGHT: TARGETS */}
                    <div className="lg:col-span-7 space-y-12">
                        <MappingGroup title="TM2 Mappings" data={tm2} sys="tm2" onSelect={setSelectedItem} onSetSys={setSelectedSys} color="emerald" />
                        <MappingGroup title="ICD-11 Mappings" data={icd11} sys="icd11" onSelect={setSelectedItem} onSetSys={setSelectedSys} color="blue" />
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ════════════════════════════════════════════════════════
   REUSABLE MAPPING GROUP COMPONENT
   ════════════════════════════════════════════════════════ */
const MappingGroup = ({ title, data, sys, onSelect, onSetSys, color }) => (
    <section className="space-y-4">
        <div className="flex items-center gap-3 opacity-30 px-2">
            <div className={`w-1 h-1 rounded-full ${color === 'blue' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{title}</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
            {data.map((item, idx) => (
                <div 
                    key={idx} 
                    onClick={() => {onSelect(item); onSetSys(sys);}}
                    className="p-5 bg-[#0a0a0a] border border-white/5 hover:border-emerald-500/50 cursor-pointer transition-all group"
                >
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-[9px] font-bold text-white/30 border border-white/10 px-1.5 py-0.5 uppercase tracking-tighter">{item.code}</span>
                        <span className="text-[10px] font-mono text-emerald-500/40">{(item.score * 100).toFixed(1)}%</span>
                    </div>
                    <h4 className="text-sm font-medium text-white/90 group-hover:text-emerald-400 transition-colors mb-2">{item.title}</h4>
                    <HiOutlineArrowRight className="text-white/0 group-hover:text-emerald-500 transition-all float-right" />
                </div>
            ))}
            {data.length === 0 && <div className="col-span-full py-10 text-center text-white/10 text-[10px] uppercase tracking-widest">No target records found</div>}
        </div>
    </section>
);

export default Map;