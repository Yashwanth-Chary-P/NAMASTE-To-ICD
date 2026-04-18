import React, { useState } from "react";
import { HiOutlineSearch, HiOutlineFilter, HiX } from "react-icons/hi";
import { BiLoaderAlt } from "react-icons/bi";

import ICDCard from "../Components/ICD_Output";
import AyurvedhaCard from "../Components/AyurvedhaCard";
import SiddhaCard from "../Components/SiddhaCard";
import UnaniCard from "../Components/UnaniCard";

export default function SearchFilterSidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(true); // Open by default on larger screens
    const [searchType, setSearchType] = useState("term"); // term/code
    const [selectedSystems, setSelectedSystems] = useState([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [results, setResults] = useState({
        ICD: [],
        Ayurvedha: [],
        Siddha: [],
        Unani: [],
        UnaniICD: [], // ICD mappings for Unani
    });

    const systems = ["ICD", "Ayurvedha", "Siddha", "Unani"];

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const handleSystemChange = (system) => {
        if (searchType === "code") {
            setSelectedSystems([system]);
        } else {
            if (selectedSystems.includes(system)) {
                setSelectedSystems(selectedSystems.filter((s) => s !== system));
            } else {
                setSelectedSystems([...selectedSystems, system]);
            }
        }
    };

    const isDisabled = (system) => searchType === "code" && system === "ICD";

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setError("");

        if (!query.trim()) {
            setError("Please enter a search term or code.");
            return;
        }
        if (selectedSystems.length === 0) {
            setError("Please select at least one medicinal system.");
            return;
        }

        setLoading(true);
        const newResults = { ICD: [], Ayurvedha: [], Siddha: [], Unani: [], UnaniICD: [] };

        try {
            // 🔹 ICD Search
            if (selectedSystems.includes("ICD")) {
                const tokenResp = await fetch("http://localhost:5000/api/icd/token", { method: "POST" });
                const { access_token } = await tokenResp.json();

                const resp = await fetch(
                    `http://localhost:5000/api/icd/search/${encodeURIComponent(query)}`,
                    { headers: { Authorization: `Bearer ${access_token}` } }
                );
                const data = await resp.json();
                newResults.ICD = data.entities || [];
            }

            // 🔹 Ayurvedha Search
            if (selectedSystems.includes("Ayurvedha")) {
                let resp, data;
                if (/^NAMC_/i.test(query) || searchType === "code") {
                    resp = await fetch(`http://localhost:5000/api/ayurvedha/${query}`);
                    data = await resp.json();
                    if (data.ayurvedha) {
                        newResults.Ayurvedha = [{
                            ...data.ayurvedha,
                            ICDMappings: data.icd || [],
                            entityId: data.ayurvedha.NAMC_CODE,
                            title: data.ayurvedha.NAMC_term || data.ayurvedha.Short_definition,
                            code: data.ayurvedha.NAMC_CODE,
                            definition: data.ayurvedha.Short_definition || data.ayurvedha.Long_definition,
                            score: 1,
                        }];
                    }
                } else {
                    resp = await fetch(`http://localhost:5000/api/ayurvedha/search?q=${encodeURIComponent(query)}`);
                    data = await resp.json();
                    if (Array.isArray(data.ayurvedha)) {
                        newResults.Ayurvedha = data.ayurvedha.map((doc) => ({
                            ...doc,
                            ICDMappings: data.icd || [],
                            entityId: doc.NAMC_CODE,
                            title: doc.NAMC_term || doc.Short_definition,
                            code: doc.NAMC_CODE,
                            definition: doc.Short_definition || doc.Long_definition,
                            score: 1,
                        }));
                    } else if (data.ayurvedha) {
                        newResults.Ayurvedha = [{
                            ...data.ayurvedha,
                            ICDMappings: data.icd || [],
                            entityId: data.ayurvedha.NAMC_CODE,
                            title: data.ayurvedha.NAMC_term || data.ayurvedha.Short_definition,
                            code: data.ayurvedha.NAMC_CODE,
                            definition: data.ayurvedha.Short_definition || data.ayurvedha.Long_definition,
                            score: 1,
                        }];
                    }
                }
            }

            // 🔹 Siddha Search
            if (selectedSystems.includes("Siddha")) {
                let data;
                if (searchType === "term") {
                    const resp = await fetch(`http://localhost:5000/api/siddha/search?q=${encodeURIComponent(query)}`);
                    data = await resp.json();
                    newResults.Siddha = data.siddha.map((item) => ({
                        code: item.NAMC_CODE,
                        title: item.NAMC_TERM,
                        definition: item.short_definition || item.long_definition_with_symptoms,
                        ICDMappings: data.icd || [],
                        entityId: item._id,
                    }));
                } else if (searchType === "code") {
                    const resp = await fetch(`http://localhost:5000/api/siddha/${encodeURIComponent(query)}`);
                    data = await resp.json();
                    newResults.Siddha = [{
                        code: data.siddha.NAMC_CODE,
                        title: data.siddha.NAMC_TERM,
                        definition: data.siddha.short_definition || data.siddha.long_definition_with_symptoms,
                        ICDMappings: data.icd || [],
                        entityId: data.siddha._id,
                    }];
                }
            }

            // 🔹 Unani Search
            if (selectedSystems.includes("Unani")) {
                let data;
                if (searchType === "term") {
                    const resp = await fetch(`http://localhost:5000/api/unani/search?q=${encodeURIComponent(query)}`);
                    data = await resp.json();

                    if (Array.isArray(data.unani)) {
                        newResults.Unani = data.unani.map((item) => ({
                            entityId: item._id,
                            code: item.NUMC,
                            title: item.TERM_DIACRITICAL,
                            definition: item.short_definition || item.long_definition || "",
                        }));
                    }
                    // ICD mappings for Unani
                    newResults.UnaniICD = data.icd
                        ? data.icd.raw_response?.entities?.map((e) => ({
                            code: e.code,
                            title: e.title,
                            definition: e.definition || "",
                            entityId: e.entityId,
                            score: e.score || 1,
                        }))
                        : [];
                } else if (searchType === "code") {
                    const resp = await fetch(`http://localhost:5000/api/unani/${encodeURIComponent(query)}`);
                    data = await resp.json();

                    newResults.Unani = [{
                        entityId: data.unani._id,
                        code: data.unani.NUMC,
                        title: data.unani.TERM_DIACRITICAL,
                        definition: data.unani.short_definition || data.unani.long_definition,
                    }];

                    newResults.UnaniICD = data.icd
                        ? data.icd.flatMap((icdItem) =>
                            icdItem.raw_response?.entities?.map((e) => ({
                                code: e.code,
                                title: e.title,
                                definition: e.definition,
                                entityId: e.entityId,
                                score: e.score || 1,
                            })) || []
                        )
                        : [];
                }
            }

            setResults(newResults);
        } catch (err) {
            console.error("Search error:", err);
            setError("Failed to fetch data. Please ensure the server is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-30 flex min-h-screen bg-[#04130d] text-white font-sans selection:bg-emerald-500/30">
            {/* ── Mobile Overlay ── */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── Sidebar ── */}
            <div
                className={`fixed lg:relative top-0 left-0 h-full w-72 bg-[#04130d]/95 backdrop-blur-2xl border-r border-white/10 p-6 z-50 transform transition-transform duration-500 ease-in-out flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-0 lg:p-0 lg:border-none lg:overflow-hidden"
                    }`}
            >
                <div className="flex items-center justify-between mb-8 lg:mb-10 min-w-[240px]">
                    <h2 className="text-xl font-semibold tracking-tight text-white flex items-center gap-2">
                        <HiOutlineFilter className="text-emerald-400" /> Filters
                    </h2>
                    <button onClick={toggleSidebar} className="lg:hidden text-white/50 hover:text-white transition-colors">
                        <HiX size={24} />
                    </button>
                </div>

                {/* Search Type Toggle */}
                <div className="mb-8 min-w-[240px]">
                    <label className="block text-xs uppercase tracking-widest text-white/40 font-semibold mb-3">Search By</label>
                    <div className="flex p-1 bg-white/5 rounded-xl border border-white/10 relative">
                        <button
                            onClick={() => {
                                setSearchType("term");
                                setSelectedSystems([]);
                            }}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg z-10 transition-colors duration-300 ${searchType === "term" ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
                        >
                            Term
                        </button>
                        <button
                            onClick={() => {
                                setSearchType("code");
                                setSelectedSystems([]);
                            }}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg z-10 transition-colors duration-300 ${searchType === "code" ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
                        >
                            Code
                        </button>
                        {/* Animated Slider */}
                        <div
                            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white/10 border border-white/5 rounded-lg shadow-sm transition-all duration-300 ease-out ${searchType === "term" ? "left-1" : "left-[calc(50%+2px)]"}`}
                        />
                    </div>
                </div>

                {/* System Selection */}
                <div className="min-w-[240px]">
                    <label className="block text-xs uppercase tracking-widest text-white/40 font-semibold mb-3">Select System</label>
                    <div className="space-y-2">
                        {systems.map((system) => {
                            const disabled = isDisabled(system);
                            const checked = selectedSystems.includes(system);
                            return (
                                <label
                                    key={system}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${disabled ? "opacity-50 cursor-not-allowed border-transparent"
                                            : checked ? "bg-emerald-500/10 border-emerald-500/30 cursor-pointer"
                                                : "hover:bg-white/5 border-transparent hover:border-white/10 cursor-pointer"
                                        }`}
                                >
                                    <input
                                        type={searchType === "code" ? "radio" : "checkbox"}
                                        name="system"
                                        value={system}
                                        disabled={disabled}
                                        checked={checked}
                                        onChange={() => handleSystemChange(system)}
                                        className="hidden" // Hidden native input
                                    />
                                    {/* Custom Checkbox/Radio styling */}
                                    <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${searchType === "code" ? "rounded-full" : "rounded-md"
                                        } ${checked ? "bg-emerald-500 border-emerald-500" : "bg-white/5 border-white/20"
                                        }`}>
                                        {checked && (
                                            searchType === "code" ? <div className="w-1.5 h-1.5 bg-[#04130d] rounded-full" />
                                                : <svg className="w-2.5 h-2.5 text-[#04130d]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`text-sm font-medium ${checked ? "text-emerald-400" : "text-white/80"}`}>
                                            {system}
                                        </span>
                                        {disabled && <span className="text-[10px] text-white/40">Term search only</span>}
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Main Content Area ── */}
            <div className="flex-1 flex flex-col relative w-full h-full">

                {/* Global Ambient Background */}
                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-teal-400/5 rounded-full blur-[100px]" />
                </div>

                {/* Top Search Bar */}
                <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 bg-white/[0.02] backdrop-blur-xl border-b border-white/10 p-4 sm:px-6 lg:px-8">
                    {!sidebarOpen && (
                        <button
                            onClick={toggleSidebar}
                            className="hidden lg:flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all mr-2"
                        >
                            <HiOutlineFilter size={20} />
                        </button>
                    )}
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-all"
                    >
                        <HiOutlineFilter size={24} />
                    </button>

                    <form onSubmit={handleSearch} className="flex flex-1 w-full gap-3 ml-10 lg:ml-0">
                        <div className="flex-1 relative">
                            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                type="text"
                                placeholder={`Search by ${searchType === 'term' ? 'disease, symptom, or keyword' : 'exact code'}...`}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all duration-300"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3.5 rounded-xl text-sm font-semibold tracking-wide text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:shadow-[0_4px_20px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center min-w-[100px]"
                        >
                            {loading ? <BiLoaderAlt className="w-5 h-5 animate-spin" /> : "Search"}
                        </button>
                    </form>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="relative z-10 m-4 sm:mx-6 lg:mx-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 animate-in fade-in duration-300">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {error}
                    </div>
                )}

                {/* Results Area */}
                <div className="flex-1 overflow-hidden p-4 sm:p-6 lg:p-8 relative z-10">
                    <div className="max-w-7xl mx-auto space-y-12 pb-12">

                        {/* ICD Results */}
                        {selectedSystems.includes("ICD") && results.ICD.length > 0 && (
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-2 h-8 bg-blue-500 rounded-full" />
                                    <h2 className="text-2xl font-semibold tracking-tight text-white">ICD-11 Results</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {results.ICD.map((item) => (
                                        <ICDCard key={item.entityId} {...item} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Ayurvedha Results */}
                        {selectedSystems.includes("Ayurvedha") && results.Ayurvedha.length > 0 && (
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-2 h-8 bg-emerald-500 rounded-full" />
                                    <h2 className="text-2xl font-semibold tracking-tight text-white">Ayurvedha Database</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {results.Ayurvedha.map((item) => (
                                        <AyurvedhaCard key={item.entityId} {...item} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Siddha Results */}
                        {selectedSystems.includes("Siddha") && results.Siddha.length > 0 && (
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-2 h-8 bg-teal-500 rounded-full" />
                                    <h2 className="text-2xl font-semibold tracking-tight text-white">Siddha Database</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {results.Siddha.map((item) => (
                                        <SiddhaCard key={item.entityId} {...item} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Unani Results */}
                        {selectedSystems.includes("Unani") && results.Unani.length > 0 && (
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-2 h-8 bg-cyan-500 rounded-full" />
                                    <h2 className="text-2xl font-semibold tracking-tight text-white">Unani Database</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                    {results.Unani.map((item) => (
                                        <UnaniCard key={item.entityId} {...item} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Unani ICD Mappings */}
                        {selectedSystems.includes("Unani") && results.UnaniICD.length > 0 && (
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400 mt-8 pt-8 border-t border-white/10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-2 h-8 bg-white/20 rounded-full" />
                                    <h2 className="text-2xl font-semibold tracking-tight text-white">Associated ICD Mappings for Unani</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {results.UnaniICD.map((item) => (
                                        <ICDCard key={item.entityId} {...item} />
                                    ))}
                                </div>
                            </section>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}