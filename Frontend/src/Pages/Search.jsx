import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import ICDCard from "../Components/ICD_Output";
import AyurvedhaCard from "../Components/AyurvedhaCard";
import SiddhaCard from "../Components/SiddhaCard";
import UnaniCard from "../Components/UnaniCard";

export default function SearchFilterSidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchType, setSearchType] = useState("term"); // term/code
    const [selectedSystems, setSelectedSystems] = useState([]);
    const [query, setQuery] = useState("");
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

    const handleSearch = async () => {
        if (!query.trim()) return alert("Enter a term");
        if (selectedSystems.length === 0) return alert("Select at least one system");

        const newResults = { ICD: [], Ayurvedha: [], Siddha: [], Unani: [], UnaniICD: [] };

        try {
            // 🔹 ICD Search
            if (selectedSystems.includes("ICD")) {
                const tokenResp = await fetch("http://localhost:5000/api/icd/token", {
                    method: "POST",
                });
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
                        newResults.Ayurvedha = [
                            {
                                ...data.ayurvedha,
                                ICDMappings: data.icd || [],
                                entityId: data.ayurvedha.NAMC_CODE,
                                title: data.ayurvedha.NAMC_term || data.ayurvedha.Short_definition,
                                code: data.ayurvedha.NAMC_CODE,
                                definition: data.ayurvedha.Short_definition || data.ayurvedha.Long_definition,
                                score: 1,
                            },
                        ];
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
                        newResults.Ayurvedha = [
                            {
                                ...data.ayurvedha,
                                ICDMappings: data.icd || [],
                                entityId: data.ayurvedha.NAMC_CODE,
                                title: data.ayurvedha.NAMC_term || data.ayurvedha.Short_definition,
                                code: data.ayurvedha.NAMC_CODE,
                                definition: data.ayurvedha.Short_definition || data.ayurvedha.Long_definition,
                                score: 1,
                            },
                        ];
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
                    newResults.Siddha = [
                        {
                            code: data.siddha.NAMC_CODE,
                            title: data.siddha.NAMC_TERM,
                            definition: data.siddha.short_definition || data.siddha.long_definition_with_symptoms,
                            ICDMappings: data.icd || [],
                            entityId: data.siddha._id,
                        },
                    ];
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

                    // ICD mappings for Unani (one section)
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

                    newResults.Unani = [
                        {
                            entityId: data.unani._id,
                            code: data.unani.NUMC,
                            title: data.unani.TERM_DIACRITICAL,
                            definition: data.unani.short_definition || data.unani.long_definition,
                        },
                    ];

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
            alert("Failed to fetch data");
        }
    };

    return (
        <div className="flex h-screen">
            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-white text-black p-4 shadow-lg z-50 transform transition-transform ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <h2 className="text-lg font-bold mb-4">Filters</h2>

                <label className="block text-sm mb-2">Search By:</label>
                <select
                    className="w-full border rounded-lg p-2 mb-4"
                    value={searchType}
                    onChange={(e) => {
                        setSearchType(e.target.value);
                        setSelectedSystems([]);
                    }}
                >
                    <option value="term">Term (Multiple Allowed)</option>
                    <option value="code">Code (One Only, ICD Disabled)</option>
                </select>

                <label className="block text-sm mb-2">Select System:</label>
                <div className="space-y-2">
                    {systems.map((system) => (
                        <div key={system} className="flex items-center">
                            <input
                                type={searchType === "code" ? "radio" : "checkbox"}
                                name="system"
                                value={system}
                                disabled={isDisabled(system)}
                                checked={selectedSystems.includes(system)}
                                onChange={() => handleSystemChange(system)}
                                className="mr-2"
                            />
                            <span className={isDisabled(system) ? "text-gray-400" : ""}>
                                {system} {isDisabled(system) && "(term only)"}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col bg-gray-200">
                {/* Top bar */}
                <div className="flex items-center bg-gray-100 p-4 shadow-md">
                    <button onClick={toggleSidebar} className="mr-4 text-2xl text-gray-700">
                        <FiMenu />
                    </button>
                    <input
                        type="text"
                        placeholder={`Search by ${searchType}`}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 border rounded-lg p-2 mr-2"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Search
                    </button>
                </div>

                {/* Results area */}
                <div className="overflow-y-auto gap-4 p-2">
                    {/* ICD Results */}
                    {selectedSystems.includes("ICD") && results.ICD.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold mb-2">ICD Results</h2>
                            <div className="grid grid-cols-3 gap-4">
                                {results.ICD.map((item) => (
                                    <ICDCard key={item.entityId} {...item} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Ayurvedha Results */}
                    {selectedSystems.includes("Ayurvedha") && results.Ayurvedha.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold mb-2">Ayurvedha Results</h2>
                            <div className="grid grid-cols-3 gap-4">
                                {results.Ayurvedha.map((item) => (
                                    <AyurvedhaCard key={item.entityId} {...item} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Siddha Results */}
                    {selectedSystems.includes("Siddha") && results.Siddha.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold mb-2">Siddha Results</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {results.Siddha.map((item) => (
                                    <SiddhaCard key={item.entityId} {...item} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Unani Results */}
                    {selectedSystems.includes("Unani") && results.Unani.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold mb-2">Unani Results</h2>
                            <div className="grid grid-cols-4 gap-4">
                                {results.Unani.map((item) => (
                                    <UnaniCard key={item.entityId} {...item} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Unani ICD Mappings (one section below) */}
                    {selectedSystems.includes("Unani") && results.UnaniICD.length > 0 && (
                        <div className="mt-4">
                            <h2 className="text-xl font-bold mb-2">ICD Mappings</h2>
                            <div className="grid grid-cols-3 gap-4">
                                {results.UnaniICD.map((item) => (
                                    <ICDCard key={item.entityId} {...item} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
