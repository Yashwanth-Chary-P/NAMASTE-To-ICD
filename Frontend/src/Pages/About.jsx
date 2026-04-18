import React from "react";
import { 
    HiOutlineDatabase, 
    HiOutlineCode, 
    HiOutlineGlobeAlt, 
    HiOutlineShieldCheck,
    HiArrowRight
} from "react-icons/hi";

export default function AboutPage() {
    return (
        <div className="relative min-h-screen bg-[#04130d] text-white font-sans overflow-hidden selection:bg-emerald-500/30">
            
            {/* ── Global Ambient Background ── */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-emerald-500/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-teal-400/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-24 sm:py-32 flex flex-col items-center">
                
                {/* Heading Area */}
                <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[11px] uppercase tracking-[0.2em] text-emerald-400 font-bold">Who We Are</span>
                    </span>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tighter text-white mb-6">
                        Bridging <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">Heritage & Modernity</span>
                    </h1>
                    <p className="max-w-3xl mx-auto text-white/60 text-lg sm:text-xl font-light leading-relaxed">
                        We are building digital healthcare solutions to seamlessly integrate Ayurveda, Siddha, and Unani systems with global ICD-11 standards, making traditional medicine interoperable.
                    </p>
                </div>

                {/* Mission & Vision Grid */}
                <div className="grid md:grid-cols-2 gap-6 w-full max-w-5xl mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
                    {/* Mission Card */}
                    <div className="relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 transition-all duration-500 hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(16,185,129,0.08)] group overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <h2 className="text-2xl font-semibold text-white tracking-tight mb-4">Our Mission</h2>
                        <p className="text-white/60 font-light leading-relaxed">
                            To make healthcare more <strong className="text-emerald-400 font-medium">accessible, interoperable, and inclusive</strong> by digitizing ancient traditional systems and structuring them for modern EMR/EHR platform integration.
                        </p>
                    </div>

                    {/* Vision Card */}
                    <div className="relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 transition-all duration-500 hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(20,184,166,0.08)] group overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <h2 className="text-2xl font-semibold text-white tracking-tight mb-4">Our Vision</h2>
                        <p className="text-white/60 font-light leading-relaxed">
                            A world where <strong className="text-teal-400 font-medium">traditional knowledge and modern medicine</strong> work synchronously to deliver holistic, affordable, and universally recognized healthcare solutions.
                        </p>
                    </div>
                </div>

                {/* What We Do Section */}
                <div className="w-full max-w-5xl mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-light tracking-tight text-white">What We Do</h2>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-5 text-white/80">
                        {[
                            { icon: HiOutlineDatabase, color: "emerald", text: "Mapping NAMASTE Codes to ICD-11 standards" },
                            { icon: HiOutlineCode, color: "teal", text: "Building APIs & integration tools for EMR/EHR" },
                            { icon: HiOutlineGlobeAlt, color: "cyan", text: "Digitizing & promoting Ayurveda, Siddha, Unani" },
                            { icon: HiOutlineShieldCheck, color: "blue", text: "Creating awareness on Health & Corporate Insurance" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-5 bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-2xl hover:border-white/15 hover:bg-white/[0.04] transition-all duration-300 group">
                                <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/10 border border-${item.color}-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                                    <item.icon className={`w-6 h-6 text-${item.color}-400`} />
                                </div>
                                <span className="font-light text-sm sm:text-base">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Why It Matters */}
                <div className="max-w-3xl text-center mb-20 animate-in fade-in duration-700 delay-500">
                    <h2 className="text-2xl font-semibold text-white mb-6">Why It Matters</h2>
                    <p className="text-white/50 text-lg font-light leading-relaxed">
                        With the rapid rise of digital health records, it is essential to bridge traditional and modern systems. This dual integration ensures <strong className="text-white/90 font-medium">global recognition, superior patient care, and future-ready healthcare innovation</strong> that honors centuries of knowledge.
                    </p>
                </div>

                {/* Themed CTA Button */}
                <div className="flex justify-center animate-in fade-in zoom-in-95 duration-700 delay-700">
                    <button className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-base font-semibold tracking-wide text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                        <span className="absolute inset-0 w-full h-full -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        <span className="relative z-10 flex items-center gap-2">
                            Explore Our Work
                            <HiArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                    </button>
                </div>

            </div>
        </div>
    );
}