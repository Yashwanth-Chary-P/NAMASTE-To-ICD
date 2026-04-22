import React, { useState, useEffect, useRef } from 'react';
import { assets, homeMiddle, projectUses, traditionalSystems } from '../../assets/assets';
import { 
    HiOutlineGlobeAlt, 
    HiOutlineChartBar, 
    HiOutlineLightBulb, 
    HiOutlineDatabase, 
    HiOutlineSparkles, 
    HiArrowRight,
    HiOutlineBeaker,
    HiOutlineUserGroup,
    HiOutlineShieldCheck,
    HiOutlineSearch
} from "react-icons/hi";

/* ════════════════════════════════════════════════════════
   PLATFORM DATA
   ════════════════════════════════════════════════════════ */
const FEATURES = [
    { icon: HiOutlineDatabase, title: "Knowledge Mapping", desc: "Digitally archiving centuries of Ayurvedic, Siddha, and Unani medicinal knowledge into a structured format." },
    { icon: HiOutlineGlobeAlt, title: "ICD-11 Integration", desc: "Bridging traditional disease names with WHO's ICD-11 codes for global healthcare interoperability." },
    { icon: HiOutlineShieldCheck, title: "Verified Heritage", desc: "Sourcing formulations directly from classical texts and government-approved pharmacopoeias." },
    { icon: HiOutlineChartBar, title: "Data Visualization", desc: "Interactive dashboards revealing patterns across traditional systems and disease categories." },
    { icon: HiOutlineSparkles, title: "AI-Based Suggestions", desc: "Machine learning models suggesting potential traditional treatments for modern diagnoses." },
    { icon: HiOutlineLightBulb, title: "Global Compatibility", desc: "Making India's traditional medicine accessible and understandable to global health systems." },
];

const ECOSYSTEM = [
    { icon: HiOutlineBeaker, title: "For Researchers", desc: "Access thousands of cross-referenced data points connecting ancient herbs with modern active compounds." },
    { icon: HiOutlineUserGroup, title: "For Practitioners", desc: "Quickly map modern patient diagnoses (ICD) to classical traditional treatment protocols." },
    { icon: HiOutlineGlobeAlt, title: "For Global Health", desc: "Standardized data formatting that integrates seamlessly with international health registries." }
];

const STATS = [
    { value: 1200, suffix: "+", label: "Diseases Mapped" },
    { value: 3, suffix: "", label: "Heritage Systems" },
    { value: 4500, suffix: "+", label: "Remedies Documented" },
    { value: 100, suffix: "%", label: "Standardized Data" },
];

const STEPS = [
    { num: "01", title: "Select System", desc: "Choose between Ayurveda, Siddha, or Unani knowledge bases." },
    { num: "02", title: "Cross-Reference", desc: "The platform maps traditional terminology to WHO ICD-11 codes." },
    { num: "03", title: "Analyze Formulations", desc: "View detailed botanical ingredients and classical treatment methods." },
    { num: "04", title: "Global Integration", desc: "Export standardized data for modern clinical research and use." },
];

/* ════════════════════════════════════════════════════════
   ANIMATED COUNTER HOOK
   ════════════════════════════════════════════════════════ */
function useCountUp(target, duration = 2500, startOnView = true) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const hasStarted = useRef(false);

    useEffect(() => {
        if (!startOnView) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasStarted.current) {
                    hasStarted.current = true;
                    const startTime = performance.now();
                    const animate = (now) => {
                        const elapsed = now - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
                        setCount(Math.floor(eased * target));
                        if (progress < 1) requestAnimationFrame(animate);
                    };
                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target, duration, startOnView]);

    return { count, ref };
}

/* ════════════════════════════════════════════════════════
   UI COMPONENTS
   ════════════════════════════════════════════════════════ */
function RevealSection({ children, className = "", delay = 0 }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

function Badge({ children }) {
    return (
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-emerald-400 font-bold">{children}</span>
        </span>
    );
}

function GlassCard({ children, className = "", glow = false }) {
    return (
        <div className={`relative rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] transition-all duration-500 ${glow ? 'shadow-[0_0_40px_rgba(16,185,129,0.08)] hover:shadow-[0_0_60px_rgba(16,185,129,0.15)] hover:border-emerald-500/30' : 'hover:bg-white/[0.04]'} ${className}`}>
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10">{children}</div>
        </div>
    );
}

/* ════════════════════════════════════════════════════════
   MAIN HOME PAGE
   ════════════════════════════════════════════════════════ */
const Home = () => {
    const [currentTS, setCurrentTS] = useState(0);
    const systemNames = ["Ayurveda", "Siddha", "Unani"];

    // Auto-rotate traditional systems tabs
    useEffect(() => {
        const t = setInterval(() => setCurrentTS((p) => (p + 1) % systemNames.length), 5000);
        return () => clearInterval(t);
    }, [systemNames.length]);

    // Counters for Stats section
    const stat1 = useCountUp(STATS[0].value);
    const stat2 = useCountUp(STATS[1].value);
    const stat3 = useCountUp(STATS[2].value);
    const stat4 = useCountUp(STATS[3].value);

    return (
        <div className="relative min-h-screen bg-[#04130d] text-white font-sans overflow-x-hidden selection:bg-emerald-500/30">
            
            {/* ── Global Ambient Background ── */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-emerald-500/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-teal-400/5 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[50vh] bg-emerald-900/10 rounded-[100%] blur-[200px]" />
                {/* Subtle grid overlay */}
                {/* <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div> */}
            </div>

            {/* ════════════════════════════════════════════
               1. HERO SECTION
               ════════════════════════════════════════════ */}
            <section className="relative z-10 min-h-[90vh] flex flex-col justify-center pt-24 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto text-center">
                    <RevealSection>
                        <Badge>Traditional Medicine × Modern Tech</Badge>
                    </RevealSection>

                    <RevealSection delay={100}>
                        <h1 className="mt-8 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tighter leading-[1.05]">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-500 font-semibold drop-shadow-sm">
                                Digitizing India's
                            </span>
                            <br />
                            <span className="text-white/90">Healing Heritage</span>
                        </h1>
                    </RevealSection>

                    <RevealSection delay={200}>
                        <p className="mt-8 text-base sm:text-lg lg:text-xl text-white/60 font-light max-w-3xl mx-auto leading-relaxed">
                            A unified platform bridging Ayurveda, Siddha &amp; Unani with WHO's ICD-11 classification — making ancient healing wisdom accessible and interoperable for modern global healthcare.
                        </p>
                    </RevealSection>

                    <RevealSection delay={300}>
                        <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center items-center">
                            <a
                                href="#traditional-systems"
                                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4.5 rounded-full text-base font-semibold tracking-wide text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:-translate-y-1 transition-all duration-300 overflow-hidden w-full sm:w-auto"
                            >
                                <span className="absolute inset-0 w-full h-full -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                <span className="relative z-10 flex items-center gap-2">
                                    Explore the Database
                                    <HiArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                                </span>
                            </a>
                            {/* Changed this button to point to your separate search page route instead of an anchor link */}
                            <a
                                href="/search" 
                                className="inline-flex items-center justify-center gap-3 px-8 py-4.5 rounded-full text-base font-medium tracking-wide text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-300 w-full sm:w-auto"
                            >
                                Launch Application
                            </a>
                        </div>
                    </RevealSection>
                </div>
            </section>

            {/* ════════════════════════════════════════════
               2. FEATURES GRID
               ════════════════════════════════════════════ */}
            <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-black/20">
                <div className="max-w-7xl mx-auto">
                    <RevealSection>
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                            <div className="max-w-2xl">
                                <Badge>Platform Capabilities</Badge>
                                <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-light tracking-tighter text-white">
                                    Bridging Two Eras of Medicine
                                </h2>
                            </div>
                            <p className="text-white/50 font-light max-w-sm md:text-right">
                                A comprehensive toolkit designed to translate ancient texts into standardized clinical data.
                            </p>
                        </div>
                    </RevealSection>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FEATURES.map((feat, i) => (
                            <RevealSection key={i} delay={i * 100}>
                                <GlassCard className="p-8 h-full group">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 flex items-center justify-center mb-8 border border-emerald-500/20 group-hover:scale-110 group-hover:border-emerald-400/40 transition-all duration-500">
                                        <feat.icon className="w-7 h-7 text-emerald-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-4 tracking-tight">{feat.title}</h3>
                                    <p className="text-base text-white/50 font-light leading-relaxed">{feat.desc}</p>
                                </GlassCard>
                            </RevealSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
               3. IMPACT & STATS (NEW DESIGN)
               ════════════════════════════════════════════ */}
            <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/40 to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <RevealSection>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {[
                                { ref: stat1.ref, count: stat1.count, data: STATS[0] },
                                { ref: stat2.ref, count: stat2.count, data: STATS[1] },
                                { ref: stat3.ref, count: stat3.count, data: STATS[2] },
                                { ref: stat4.ref, count: stat4.count, data: STATS[3] },
                            ].map((stat, i) => (
                                <div key={i} ref={stat.ref} className="text-center p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
                                    <div className="text-4xl sm:text-5xl md:text-6xl font-light text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-2 font-mono">
                                        {stat.count}{stat.data.suffix}
                                    </div>
                                    <div className="text-sm sm:text-base text-emerald-400 font-medium tracking-wide">
                                        {stat.data.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </RevealSection>
                </div>
            </section>

            {/* ════════════════════════════════════════════
               4. THE ECOSYSTEM (NEW COMPONENT)
               ════════════════════════════════════════════ */}
            <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <RevealSection>
                        <div className="text-center mb-16 max-w-3xl mx-auto">
                            <Badge>Who is this for?</Badge>
                            <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-light tracking-tighter text-white">
                                Powering a Modern Healthcare Ecosystem
                            </h2>
                        </div>
                    </RevealSection>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {ECOSYSTEM.map((item, i) => (
                            <RevealSection key={i} delay={i * 150}>
                                <div className="flex flex-col items-center text-center p-8">
                                    <div className="w-20 h-20 rounded-full bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400">
                                        <item.icon className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-2xl font-semibold text-white mb-4">{item.title}</h3>
                                    <p className="text-base text-white/60 font-light leading-relaxed">{item.desc}</p>
                                </div>
                            </RevealSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
               5. HOW IT WORKS
               ════════════════════════════════════════════ */}
            <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-black/20 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <RevealSection>
                        <div className="text-center mb-20">
                            <Badge>Process Workflow</Badge>
                            <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-light tracking-tighter text-white">
                                How the Integration Works
                            </h2>
                        </div>
                    </RevealSection>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                        {/* Connecting Line */}
                        <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
                        
                        {STEPS.map((step, i) => (
                            <RevealSection key={i} delay={i * 150}>
                                <div className="relative text-center group z-10">
                                    <div className="relative w-24 h-24 mx-auto mb-8">
                                        <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="relative w-full h-full rounded-2xl bg-[#04130d] border-2 border-white/10 group-hover:border-emerald-400 flex items-center justify-center transition-all duration-500 group-hover:-translate-y-2">
                                            <span className="text-3xl font-light text-emerald-500 group-hover:text-emerald-300 transition-colors duration-500">
                                                {step.num}
                                            </span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                                    <p className="text-base text-white/50 font-light leading-relaxed max-w-[250px] mx-auto">{step.desc}</p>
                                </div>
                            </RevealSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
               6. TRADITIONAL SYSTEMS TABS
               ════════════════════════════════════════════ */}
            <section id="traditional-systems" className="relative z-10 py-32 px-4 sm:px-6 lg:px-8 border-t border-white/5">
                <div className="max-w-6xl mx-auto">
                    <RevealSection>
                        <div className="text-center mb-16">
                            <Badge>Knowledge Bases</Badge>
                            <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-light tracking-tighter text-white">
                                The Heritage Systems
                            </h2>
                            <p className="mt-4 text-base text-white/50 font-light max-w-2xl mx-auto">
                                Deep dive into the distinct philosophies and treatments of India's recognized traditional medical sciences.
                            </p>
                        </div>
                    </RevealSection>

                    <RevealSection delay={100}>
                        <GlassCard className="overflow-hidden" glow>
                            <div className="flex flex-col lg:flex-row">
                                {/* Navigation Tabs */}
                                <div className="lg:w-[300px] flex-shrink-0 p-6 lg:p-8 lg:border-r border-white/10 bg-white/[0.01]">
                                    <nav className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
                                        {systemNames.map((name, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentTS(index)}
                                                className={`relative flex items-center gap-4 px-6 py-5 rounded-2xl text-left whitespace-nowrap transition-all duration-500 w-full ${
                                                    index === currentTS
                                                        ? 'bg-emerald-500/15 border border-emerald-500/30 shadow-inner'
                                                        : 'hover:bg-white/5 border border-transparent'
                                                }`}
                                            >
                                                <span className={`w-3 h-3 rounded-full transition-all duration-500 flex-shrink-0 ${index === currentTS ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)] scale-110' : 'bg-white/20'}`} />
                                                <span className={`text-base font-medium transition-colors duration-300 ${index === currentTS ? 'text-emerald-300' : 'text-white/60'}`}>{name} Base</span>
                                            </button>
                                        ))}
                                    </nav>
                                </div>

                                {/* Content View */}
                                <div className="flex-1 p-8 lg:p-14 flex flex-col items-center justify-center min-h-[500px]">
                                    {traditionalSystems?.map((item, id) =>
                                        id === currentTS ? (
                                            <div key={id} className="flex flex-col w-full animate-in fade-in zoom-in duration-700">
                                                
                                                <div className="relative w-full rounded-3xl overflow-hidden border border-white/10 mb-10 group bg-white/5 aspect-video sm:aspect-[21/9]">
                                                    <img 
                                                        src={item.image} 
                                                        alt={`${systemNames[id]} Illustration`}
                                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 mix-blend-overlay" 
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-[#04130d] via-[#04130d]/50 to-transparent" />
                                                </div>

                                                <div className="text-left w-full max-w-3xl mx-auto">
                                                    <h3 className="text-3xl sm:text-4xl font-semibold text-white mb-6">
                                                        The {systemNames[id]} System
                                                    </h3>
                                                    <p className="text-white/60 text-lg leading-relaxed">
                                                        {item.text || `Detailed documentation and cross-referencing for the ${systemNames[id]} traditional medicine system, seamlessly integrated with modern clinical coding structures to ensure standardized data capture and analysis.`}
                                                    </p>
                                                    
                                                    <button className="mt-8 text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-2 group transition-colors">
                                                        Explore {systemNames[id]} Codes 
                                                        <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                                    </button>
                                                </div>

                                            </div>
                                        ) : null
                                    )}
                                </div>
                            </div>
                        </GlassCard>
                    </RevealSection>
                </div>
            </section>

            {/* ════════════════════════════════════════════
               7. FINAL CTA (NEW COMPONENT)
               ════════════════════════════════════════════ */}
            <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8 overflow-hidden border-t border-emerald-900/30">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-950/80 pointer-events-none" />
                
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <RevealSection>
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tighter text-white mb-8">
                            Ready to explore the <br className="hidden sm:block"/>
                            <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">Unified Knowledge Base?</span>
                        </h2>
                        <p className="text-lg text-white/60 font-light mb-12 max-w-2xl mx-auto">
                            Access thousands of classical formulations perfectly mapped to modern ICD-11 standards. Search by symptom, disease, or traditional terminology.
                        </p>
                        <a
                            href="/search" // Link to your separate search page
                            className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full text-lg font-semibold tracking-wide text-[#04130d] bg-white hover:bg-emerald-50 hover:scale-105 hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] transition-all duration-300"
                        >
                            Open Search Application
                            <HiOutlineSearch className="w-6 h-6" />
                        </a>
                    </RevealSection>
                </div>
            </section>

        </div>
    );
}

export default Home;