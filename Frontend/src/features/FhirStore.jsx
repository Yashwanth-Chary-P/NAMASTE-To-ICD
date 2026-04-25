import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../state/store";
import { storeMapping, clearFhir } from "../state/features/fhirSlice";
import { 
    HiOutlineCloudUpload, HiOutlineCheckCircle, 
    HiOutlineShieldCheck, HiOutlineDocumentText,
    HiOutlineLink, HiOutlineCalendar, HiOutlineFingerPrint,
    HiOutlineChevronRight, HiOutlineExternalLink
} from "react-icons/hi";

const FhirStore = () => {
    const dispatch = useAppDispatch();
    const { record, loading, message } = useAppSelector((state) => state.fhir);

    // Form States
    const [sourceSystem, setSourceSystem] = useState("icd11");
    const [targetSystem, setTargetSystem] = useState("tm2");
    const [sourceCode, setSourceCode] = useState("");
    const [sourceTitle, setSourceTitle] = useState("");
    const [targetCode, setTargetCode] = useState("");
    const [targetTitle, setTargetTitle] = useState("");
    const [tag, setTag] = useState("Equivalent");
    const [score, setScore] = useState(0.45);

    const handleCommit = () => {
        dispatch(storeMapping({
            source_system: sourceSystem,
            target_system: targetSystem,
            source_doc: { code: sourceCode, title: sourceTitle },
            target_doc: { code: targetCode, title: targetTitle },
            tag,
            score: parseFloat(score)
        }));
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500/30 p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                
                <header className="flex justify-between items-end border-b border-white/10 pb-8 mb-12">
                    <div>
                        <div className="flex items-center gap-2 text-emerald-500 mb-2">
                            <HiOutlineShieldCheck className="animate-pulse" />
                            {/* <span className="text-[10px] font-black uppercase tracking-[0.3em]">Neural Mapping Workstation</span> */}
                        </div>
                        {/* <h1 className="text-4xl font-light tracking-tighter uppercase font-serif">Concept<span className="font-bold text-white">Registry</span></h1> */}
                    </div>
                </header>

                {!record ? (
                    /* ── INPUT INTERFACE ── */
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="grid lg:grid-cols-2 gap-8">
                            <MappingInputPanel title="Source" system={sourceSystem} setSystem={setSourceSystem} code={sourceCode} setCode={setSourceCode} desc={sourceTitle} setDesc={setSourceTitle} color="emerald" />
                            <MappingInputPanel title="Target" system={targetSystem} setSystem={setTargetSystem} code={targetCode} setCode={setTargetCode} desc={targetTitle} setDesc={setTargetTitle} color="blue" />
                        </div>
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 p-8 bg-[#0a0a0a] border border-white/5">
                                <label className="text-[10px] text-white/30 uppercase font-black block mb-6 tracking-widest">Relationship Tag</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {["Equivalent", "Related", "Narrower", "Broader"].map(t => (
                                        <button key={t} onClick={() => setTag(t)} className={`py-3 text-[10px] font-bold border transition-all ${tag === t ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-white/5 text-white/20'}`}>{t}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="p-8 bg-[#111] border border-white/10 flex flex-col justify-center">
                                <button onClick={handleCommit} disabled={loading} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-black font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2">
                                    {loading ? "Storing..." : "Store Mapping"} <HiOutlineCloudUpload />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ── SUCCESSFUL REGISTRY CERTIFICATE ── */
                    <div className="animate-in slide-in-from-bottom-10 duration-700 space-y-10">
                        
                        {/* 1. Official Receipt Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-sm gap-6">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-emerald-500 text-black rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                                    <HiOutlineCheckCircle size={32} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-emerald-400 uppercase tracking-tight">{message}</h2>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Registry ID:</span>
                                        <code className="text-xs text-white/80 font-mono bg-white/5 px-2 py-0.5 rounded">{record.mappingKey}</code>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => dispatch(clearFhir())} className="px-6 py-2 border border-white/20 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">New Entry</button>
                        </div>

                        {/* 2. Visual Semantic Bridge */}
                        <div className="grid grid-cols-1 lg:grid-cols-7 items-center gap-0 bg-[#0a0a0a] border border-white/5 rounded-sm overflow-hidden shadow-2xl">
                            
                            {/* Source Side */}
                            <div className="lg:col-span-3 p-10 space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{record.sourceSystem}</span>
                                </div>
                                <div>
                                    <div className="text-emerald-400 font-mono text-sm font-bold mb-1 tracking-tighter">{record.sourceDocument.code}</div>
                                    <h3 className="text-3xl font-light text-white leading-tight">{record.sourceDocument.title}</h3>
                                </div>
                            </div>

                            {/* Center Interaction Logic */}
                            <div className="lg:col-span-1 flex flex-col items-center justify-center bg-white/[0.02] h-full py-8 lg:py-0 border-y lg:border-y-0 lg:border-x border-white/5">
                                <div className="h-12 w-px bg-gradient-to-b from-transparent via-emerald-500/50 to-transparent mb-4 hidden lg:block" />
                                <div className="flex flex-col items-center gap-2">
                                    <HiOutlineLink className="text-emerald-500 text-2xl" />
                                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{tag}</span>
                                    <div className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[9px] font-mono border border-emerald-500/20">{(score * 100).toFixed(0)}% MATCH</div>
                                </div>
                                <div className="h-12 w-px bg-gradient-to-b from-transparent via-blue-500/50 to-transparent mt-4 hidden lg:block" />
                            </div>

                            {/* Target Side */}
                            <div className="lg:col-span-3 p-10 space-y-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{record.targetSystem}</span>
                                    <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                </div>
                                <div>
                                    <div className="text-blue-400 font-mono text-sm font-bold mb-1 tracking-tighter">{record.targetDocument.code}</div>
                                    <h3 className="text-3xl font-light text-white leading-tight">{record.targetDocument.title}</h3>
                                </div>
                            </div>
                        </div>

                        {/* 3. Detailed Metadata Matrix */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <StatCard icon={<HiOutlineFingerPrint />} label="Resource Model" val={record.resourceType} />
                            <StatCard icon={<HiOutlineCalendar />} label="Sync Date" val={new Date(record.date).toLocaleDateString()} />
                            <StatCard icon={<HiOutlineDocumentText />} label="Mapping Status" val={record.status.toUpperCase()} />
                            <StatCard icon={<HiOutlineExternalLink />} label="FHIR Element" val={record.group[0].element[0].target[0].equivalence} color="text-emerald-400" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

/* ── REUSABLE UI BLOCKS ── */

const MappingInputPanel = ({ title, system, setSystem, code, setCode, desc, setDesc, color }) => (
    <div className="p-8 bg-[#0a0a0a] border border-white/5 rounded-sm space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className={`text-[10px] font-black uppercase tracking-widest ${color === 'emerald' ? 'text-emerald-500' : 'text-blue-500'}`}>{title} CONTEXT</span>
            <select value={system} onChange={(e) => setSystem(e.target.value)} className="bg-black text-[10px] font-bold uppercase border border-white/10 px-2 py-1 outline-none">
                {["ayurveda", "siddha", "unani", "tm2", "icd11"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
        </div>
        <div className="space-y-4">
            <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Standard Code" className="w-full bg-black border border-white/10 p-3 text-sm font-mono focus:border-emerald-500 outline-none" />
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Official Terminology Label" rows="2" className="w-full bg-black border border-white/10 p-3 text-sm focus:border-emerald-500 outline-none resize-none" />
        </div>
    </div>
);

const StatCard = ({ icon, label, val, color = "text-white/60" }) => (
    <div className="bg-[#0d0d0d] border border-white/5 p-6 rounded-sm">
        <div className="flex items-center gap-3 mb-3 text-white/20">
            {icon}
            <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
        </div>
        <div className={`text-xs font-mono font-bold ${color} break-all`}>{val}</div>
    </div>
);

export default FhirStore;