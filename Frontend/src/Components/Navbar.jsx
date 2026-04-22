import React, { useState, useEffect } from "react";
import { LuMenu, LuX } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ added
import { assets } from '../../assets/assets';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const { currentUser } = useAuth(); // ✅ added

  // Add glass effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Mapping Tool", path: "/mapping" },
    { name: "Search", path: "/search" },
    { name: "ICD-Search", path: "/icd-search" },
    { name: "Reports", path: "/reports" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#04130d]/80 backdrop-blur-xl border-b border-white/10 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">

        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <span className="text-emerald-400 text-lg">🌿</span>
          </div>

          <h1 className="text-lg font-semibold text-white tracking-tight">
            AyuMap
          </h1>
        </div>

        {/* Center Nav Links (Desktop only) */}
        <div className="hidden lg:flex items-center gap-8 bg-white/[0.03] px-8 py-3 rounded-full border border-white/5 backdrop-blur-md">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              className="text-sm font-medium text-white/70 hover:text-emerald-400 transition-colors duration-300"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* 🔥 Right Section (ONLY logic changed) */}
        <div className="hidden lg:flex items-center gap-4">

          {currentUser ? (
            <button
              onClick={() => navigate("/profile")}
              className="text-sm font-medium tracking-wide text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 rounded-full px-6 py-2.5 transition-all duration-300"
            >
              Profile
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-medium tracking-wide text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 rounded-full px-6 py-2.5 transition-all duration-300"
            >
              Login
            </button>
          )}

        </div>

        {/* Mobile Menu Icon */}
        <div
          className="lg:hidden flex items-center cursor-pointer text-white/80 hover:text-white transition-colors p-2 rounded-lg bg-white/5 border border-white/10"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <LuX size={24} /> : <LuMenu size={24} />}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full overflow-hidden transition-all duration-500 ease-in-out ${
          menuOpen
            ? "max-h-[500px] border-b border-white/10 opacity-100"
            : "max-h-0 opacity-0"
        } bg-[#04130d]/95 backdrop-blur-2xl`}
      >
        <div className="flex flex-col px-6 py-6 gap-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              className="text-base font-medium text-white/80 hover:text-emerald-400 hover:bg-white/5 px-4 py-3 rounded-xl transition-all duration-300"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}

          <div className="h-px bg-white/10 my-2" />

          {/* 🔥 Mobile Login/Profile */}
          {currentUser ? (
            <button
              onClick={() => {
                navigate("/profile");
                setMenuOpen(false);
              }}
              className="text-center text-base font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-500 rounded-xl px-4 py-3 mt-2 shadow-[0_4px_15px_rgba(16,185,129,0.2)]"
            >
              Profile
            </button>
          ) : (
            <button
              onClick={() => {
                navigate("/login");
                setMenuOpen(false);
              }}
              className="text-center text-base font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-500 rounded-xl px-4 py-3 mt-2 shadow-[0_4px_15px_rgba(16,185,129,0.2)]"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;