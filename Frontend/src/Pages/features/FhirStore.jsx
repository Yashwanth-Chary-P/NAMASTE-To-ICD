import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../state/store";
import { storeMapping, clearFhir, fetchFhirHistory, fetchFhirByKey } from "../../state/features/fhirSlice";
import {
  HiOutlineShieldCheck,
  HiOutlineChevronRight,
  HiOutlineDatabase,
  HiOutlineClock,
  HiOutlinePlusCircle,
  HiOutlineInformationCircle,
  HiOutlineHashtag,
  HiOutlineAdjustments
} from "react-icons/hi";

const SYSTEMS = ["ayurveda", "siddha", "unani", "tm2", "icd11"];
const TAGS = ["Equivalent", "Related", "Narrower", "Broader"];

const FhirStore = () => {
  const dispatch = useAppDispatch();
  const { record, loading, message, error, history } = useAppSelector((state) => state.fhir);
  
  const [activeTab, setActiveTab] = useState("create"); // 'create' | 'history'

  // Form State
  const [sourceSystem, setSourceSystem] = useState("icd11");
  const [targetSystem, setTargetSystem] = useState("tm2");
  const [sourceCode, setSourceCode] = useState("");
  const [sourceTitle, setSourceTitle] = useState("");
  const [targetCode, setTargetCode] = useState("");
  const [targetTitle, setTargetTitle] = useState("");
  const [tag, setTag] = useState("Equivalent");
  const [score, setScore] = useState(0.95);
  const [confidence, setConfidence] = useState("high");
  const [matchReason, setMatchReason] = useState("User selected mapping");

  const isValid = sourceCode.trim() && targetCode.trim() && sourceSystem !== targetSystem;

  useEffect(() => {
    if (activeTab === "history") dispatch(fetchFhirHistory({ limit: 10, offset: 0 }));
  }, [activeTab, dispatch]);

  const handleCommit = () => {
    if (!isValid) return;
    dispatch(storeMapping({
      source_system: sourceSystem,
      target_system: targetSystem,
      source_doc: { code: sourceCode, title: sourceTitle },
      target_doc: { code: targetCode, title: targetTitle },
      tag,
      score: parseFloat(score),
      confidence,
      match_reason: matchReason
    }));
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        
        {/* TOP NAVIGATION */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-8 mb-8">
          <div>
            <div className="flex items-center gap-2 text-emerald-500 mb-1">
              <HiOutlineShieldCheck className="text-xl" />
              {/* <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Interoperability Layer</span> */}
            </div>
            {/* <h1 className="text-2xl font-light text-white">FHIR <span className="text-emerald-500 font-medium">ConceptMapper</span></h1> */}
          </div>

          <nav className=" mt-10 flex bg-white/5 p-1 rounded-lg border border-white/10">
            <button 
              onClick={() => setActiveTab("create")}
              className={`flex items-center gap-2 px-4 py-2 text-xs transition-all ${activeTab === 'create' ? 'bg-emerald-600 text-white rounded-md shadow-lg' : 'hover:text-white'}`}
            >
              <HiOutlinePlusCircle /> Create Mapping
            </button>
            <button 
              onClick={() => setActiveTab("history")}
              className={`flex items-center gap-2 px-4 py-2 text-xs transition-all ${activeTab === 'history' ? 'bg-emerald-600 text-white rounded-md shadow-lg' : 'hover:text-white'}`}
            >
              <HiOutlineClock /> History Log
            </button>
          </nav>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border-l-2 border-red-500 text-red-400 text-sm animate-pulse">
            {error}
          </div>
        )}

        {activeTab === "create" ? (
          !record ? (
            <div className="grid lg:grid-cols-12 gap-8">
              
              {/* LEFT: MAPPING INPUTS */}
              <div className="lg:col-span-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <MappingPanel
                    label="Source Concept"
                    system={sourceSystem}
                    setSystem={setSourceSystem}
                    code={sourceCode}
                    setCode={setSourceCode}
                    title={sourceTitle}
                    setTitle={setSourceTitle}
                    accentColor="blue"
                  />
                  <div className="hidden md:flex items-center justify-center -mx-4 z-10">
                    <div className="bg-[#050505] p-2 border border-white/10 rounded-full">
                      <HiOutlineChevronRight className="text-emerald-500" />
                    </div>
                  </div>
                  <MappingPanel
                    label="Target Concept"
                    system={targetSystem}
                    setSystem={setTargetSystem}
                    code={targetCode}
                    setCode={setTargetCode}
                    title={targetTitle}
                    setTitle={setTargetTitle}
                    accentColor="emerald"
                  />
                </div>

                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                  <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <HiOutlineAdjustments /> Logic & Metadata
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <label className="text-[10px] uppercase text-zinc-500 mb-2 block">Relationship Tag</label>
                      <div className="flex flex-wrap gap-2">
                        {TAGS.map(t => (
                          <button 
                            key={t} 
                            onClick={() => setTag(t)}
                            className={`px-4 py-2 text-[11px] border transition-all ${tag === t ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-white/10 text-zinc-500 hover:border-white/20'}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-zinc-500 mb-2 block">Confidence Level</label>
                      <select 
                        value={confidence} 
                        onChange={(e) => setConfidence(e.target.value)}
                        className="w-full bg-black border border-white/10 p-2 text-sm focus:border-emerald-500 outline-none"
                      >
                        <option value="high">High Confidence</option>
                        <option value="medium">Medium Confidence</option>
                        <option value="low">Low Confidence</option>
                      </select>
                    </div>
                    <div className="md:col-span-3">
                      <label className="text-[10px] uppercase text-zinc-500 mb-2 block">Match Rationale</label>
                      <textarea 
                        value={matchReason} 
                        onChange={(e) => setMatchReason(e.target.value)}
                        className="w-full bg-black border border-white/10 p-3 text-sm focus:border-emerald-500 outline-none min-h-[80px]"
                        placeholder="Explain why these concepts match..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: ACTION PANEL */}
              <div className="lg:col-span-4">
                <div className="sticky top-8 p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                  <h3 className="text-white font-medium mb-2">Ready to Commit?</h3>
                  <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
                    This will generate a FHIR ConceptMap resource and store it in the persistent registry.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Validation Status</span>
                      <span className={isValid ? "text-emerald-500" : "text-amber-500"}>{isValid ? "Passed" : "Incomplete"}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Match Score</span>
                      <input 
                        type="number" step="0.01" value={score} 
                        onChange={(e) => setScore(e.target.value)}
                        className="bg-transparent text-right border-b border-white/10 w-16 outline-none text-emerald-400"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleCommit}
                    disabled={!isValid || loading}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-bold transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
                  >
                    {loading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <HiOutlineDatabase />}
                    {loading ? "Processing..." : "Store in Registry"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ENHANCED SUCCESS VIEW */
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-2xl mb-8 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-10">
                    <HiOutlineShieldCheck className="text-9xl text-emerald-500" />
                 </div>
                 <h2 className="text-2xl text-white mb-2">{message || "Record Created"}</h2>
                 <p className="font-mono text-xs text-emerald-400 mb-6">{record.mappingKey}</p>
                 
                 <div className="grid md:grid-cols-3 gap-6">
                    <OutputField label="Equivalence" value={record.group[0].element[0].target[0].equivalence} icon={<HiOutlineInformationCircle />} />
                    <OutputField label="System Date" value={new Date(record.date).toLocaleDateString()} icon={<HiOutlineClock />} />
                    <OutputField label="Auth ID" value="Verified" icon={<HiOutlineShieldCheck />} />
                 </div>

                 <button
                    onClick={() => dispatch(clearFhir())}
                    className="mt-8 px-6 py-2 bg-white/5 border border-white/10 text-xs hover:bg-white/10 transition-all"
                  >
                    Create Another Mapping
                  </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                 <ResultCard type="Source" system={record.sourceSystem} code={record.sourceCode} title={sourceTitle} />
                 <ResultCard type="Target" system={record.targetSystem} code={record.targetCode} title={targetTitle} />
              </div>
            </div>
          )
        ) : (
          /* HISTORY TABLE VIEW */
          <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-[10px] uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Mapping Key / Date</th>
                  <th className="px-6 py-4 font-medium">Source Concept</th>
                  <th className="px-6 py-4 font-medium">Target Concept</th>
                  <th className="px-6 py-4 font-medium">Rel</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {history.map((item) => (
                  <tr key={item.mappingKey} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-white font-mono text-[11px] mb-1">{item.mappingKey.substring(0, 12)}...</div>
                      <div className="text-[10px] text-zinc-500">{new Date(item.date).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-zinc-400 text-xs bg-white/5 px-2 py-1 rounded mr-2">{item.sourceSystem}</span>
                      <span className="text-white">{item.sourceCode}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-zinc-400 text-xs bg-white/5 px-2 py-1 rounded mr-2">{item.targetSystem}</span>
                      <span className="text-white">{item.targetCode}</span>
                    </td>
                    <td className="px-6 py-4 text-[10px]">
                       <span className="border border-emerald-500/30 text-emerald-500 px-2 py-0.5 rounded">
                         {item.group?.[0]?.element?.[0]?.target?.[0]?.equivalence || "Equivalent"}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => {
                          dispatch(fetchFhirByKey(item.mappingKey));
                          setActiveTab("create");
                        }}
                        className="text-emerald-500 hover:text-emerald-400"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {history.length === 0 && <div className="p-20 text-center text-zinc-600 text-xs italic">No history found.</div>}
          </div>
        )}
      </div>
    </div>
  );
};

// ========================
// SUB-COMPONENTS
// ========================

const MappingPanel = ({ label, system, setSystem, code, setCode, title, setTitle, accentColor }) => (
  <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-all group">
    <div className="flex justify-between items-center mb-6">
      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300 transition-colors">{label}</span>
      <select 
        value={system} 
        onChange={(e) => setSystem(e.target.value)}
        className="bg-transparent text-xs text-emerald-500 outline-none border-b border-transparent focus:border-emerald-500 cursor-pointer"
      >
        {SYSTEMS.map(s => <option key={s} className="bg-[#0a0a0a]">{s}</option>)}
      </select>
    </div>
    <div className="space-y-4">
      <div className="relative">
        <HiOutlineHashtag className="absolute left-3 top-3 text-zinc-600" />
        <input
          placeholder="Code ID (e.g. 1A22.1)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/10 rounded-lg text-sm focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all text-white"
        />
      </div>
      <textarea
        placeholder="Concept Title or Description"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-4 bg-black/50 border border-white/10 rounded-lg text-sm focus:border-emerald-500/50 outline-none min-h-[100px] resize-none text-zinc-400"
      />
    </div>
  </div>
);

const OutputField = ({ label, value, icon }) => (
  <div className="bg-black/20 p-3 rounded-lg border border-white/5">
    <div className="text-[10px] uppercase text-zinc-500 flex items-center gap-1 mb-1">
      {icon} {label}
    </div>
    <div className="text-sm text-white font-medium capitalize">{value}</div>
  </div>
);

const ResultCard = ({ type, system, code, title }) => (
  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
    <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-4">{type} Resource</div>
    <div className="text-2xl font-mono text-white mb-1">{code}</div>
    <div className="text-xs text-emerald-500 uppercase mb-4">{system}</div>
    <p className="text-sm text-zinc-400 leading-relaxed italic">"{title || 'No description provided.'}"</p>
  </div>
);

export default FhirStore;