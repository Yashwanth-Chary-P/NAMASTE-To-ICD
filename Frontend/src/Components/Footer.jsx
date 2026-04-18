import React from 'react';
import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn,
    FaGithub
} from "react-icons/fa";
import { assets } from '../../assets/assets';

const Footer = () => {
    return (
        <footer className="relative bg-[#04130d] text-white/60 pt-20 pb-8 border-t border-white/5 overflow-hidden font-sans">

            {/* Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-emerald-900/20 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16 relative z-10">

                    {/* 1. Brand & Info */}
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => navigate("/")}
                    >
                        {/* Icon */}
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md group-hover:scale-105 transition">
                            <span className="text-white text-lg">🌿</span>
                        </div>

                        {/* Text */}
                        <div className="flex flex-col leading-tight">
                            <span className="text-white font-semibold tracking-tight text-lg">
                                AyuMap
                            </span>
                            <span className="text-[10px] text-gray-400 tracking-widest">
                                ICD PLATFORM
                            </span>
                        </div>
                    </div>

                    {/* 2. Quick Links */}
                    <div className="flex flex-col">
                        <h4 className="text-white text-lg font-semibold tracking-wide mb-6">Platform</h4>
                        <div className="flex flex-col gap-3.5">
                            <a href="/" className="text-sm hover:text-emerald-400 transition-colors duration-300 flex items-center gap-2">Home</a>
                            <a href="/mapping" className="text-sm hover:text-emerald-400 transition-colors duration-300 flex items-center gap-2">Mapping Tool</a>
                            <a href="/search" className="text-sm hover:text-emerald-400 transition-colors duration-300 flex items-center gap-2">ICD-11 Search</a>
                            <a href="/reports" className="text-sm hover:text-emerald-400 transition-colors duration-300 flex items-center gap-2">Data & Reports</a>
                            <a href="/about" className="text-sm hover:text-emerald-400 transition-colors duration-300 flex items-center gap-2">About the Project</a>
                        </div>
                    </div>

                    {/* 3. Resources */}
                    <div className="flex flex-col">
                        <h4 className="text-white text-lg font-semibold tracking-wide mb-6">Resources</h4>
                        <div className="flex flex-col gap-3.5">
                            <a href="#" className="text-sm hover:text-emerald-400 transition-colors duration-300">API Documentation</a>
                            <a href="#" className="text-sm hover:text-emerald-400 transition-colors duration-300">FHIR Integration Guide</a>
                            <a href="#" className="text-sm hover:text-emerald-400 transition-colors duration-300">NAMASTE Framework</a>
                            <a href="#" className="text-sm hover:text-emerald-400 transition-colors duration-300">Privacy Policy</a>
                            <a href="#" className="text-sm hover:text-emerald-400 transition-colors duration-300">Terms of Service</a>
                        </div>
                    </div>

                    {/* 4. Contact */}
                    <div className="flex flex-col">
                        <h4 className="text-white text-lg font-semibold tracking-wide mb-6">Contact Us</h4>
                        <div className="flex flex-col gap-4 text-sm font-light text-white/50">
                            <p className="leading-relaxed">
                                <strong className="text-white/80 font-medium">Headquarters:</strong><br />
                                Hyderabad, Telangana, India
                            </p>
                            <p>
                                <strong className="text-white/80 font-medium">Email:</strong><br />
                                <a href="mailto:support@ayurmap.in" className="hover:text-emerald-400 transition-colors">support@ayurmap.in</a>
                            </p>

                            <div className="mt-4">
                                <p className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-3">Install App</p>
                                <div className="flex gap-3">
                                    {assets.app && <img className="w-[100px] hover:opacity-80 transition-opacity cursor-pointer" src={assets.app} alt="App Store" />}
                                    {assets.play && <img className="w-[100px] hover:opacity-80 transition-opacity cursor-pointer" src={assets.play} alt="Google Play" />}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
                    <p className="text-xs text-white/40 font-light">
                        © {new Date().getFullYear()} AyurMap Registry. All Rights Reserved.
                    </p>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] uppercase tracking-[0.1em] text-white/60 font-medium">Systems Operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;