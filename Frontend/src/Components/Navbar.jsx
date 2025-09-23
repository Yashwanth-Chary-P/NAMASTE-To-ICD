import React, { useState } from "react";
import { LuMenu } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { assets } from '../../assets/assets'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="w-full shadow-md">
      {/* Top Navbar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            className="w-[160px] h-[70px] object-contain"
            src={assets.Logo}
            alt="Logo"
          />
        </div>

        {/* Center Nav Links (Desktop only) */}
        <div className="hidden lg:flex items-center gap-8 text-[18px] font-medium text-black">
          <a href="/" className="hover:text-[#1e6089]">Home</a>
          <a href="/mapping" className="hover:text-[#1e6089]">Mapping Tool</a>
          <a href="/search" className="hover:text-[#1e6089]">Search </a>
          <a href="/reports" className="hover:text-[#1e6089]">Reports</a>
          <a href="/about" className="hover:text-[#1e6089]">About</a>
        </div>

        {/* Right Section (Login / Signup for Desktop) */}
        <div className="hidden lg:flex items-center">
          <button
            onClick={() => navigate("/login")}
            className="w-[100px] text-white bg-[#1e6089] font-medium rounded-l-lg text-sm px-6 py-2.5"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="w-[100px] text-black bg-[#f0f9ff] font-medium rounded-r-lg text-sm px-5 py-2.5"
          >
            SignUp
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <div
          className="lg:hidden flex items-center cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <LuMenu size={28} />
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="lg:hidden flex flex-col gap-4 p-4 bg-white shadow-md font-semibold">
          <a href="/" className="border-b p-2">Home</a>
          <a href="/mapping" className="border-b p-2">Mapping Tool</a>
          <a href="/search" className="border-b p-2">Search Codes</a>
          <a href="/reports" className="border-b p-2">Reports</a>
          <a href="/about" className="border-b p-2">About</a>
          <a href="/login" className="border-b p-2">Login</a>
          <a href="/signup" className="border-b p-2">Sign Up</a>
        </div>
      )}
    </div>
  );
};

export default Navbar;
