import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
    HiOutlineLogout, 
    HiOutlineUser, 
    HiOutlineMail,
    HiArrowLeft
} from "react-icons/hi";
import { BiLoaderAlt } from "react-icons/bi";
import { assets } from "../../assets/assets";

const Profile = () => {
  const { currentUser, logout, loading } = useAuth();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 🔄 Load user from localStorage or Firebase (Logic preserved exactly)
  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (stored) {
      setUser(JSON.parse(stored));
      return;
    }

    // fallback to firebase user (in case storage empty on first load)
    if (currentUser) {
      const userData = {
        name: currentUser.displayName || "User",
        email: currentUser.email,
        photo: currentUser.photoURL || "",
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } else if (!loading) {
      // no user at all → go to login
      navigate("/login");
    }
  }, [currentUser, loading, navigate]);

  // 🚪 Logout (Logic preserved exactly)
  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Themed Loading State
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#04130d]">
        <div className="flex flex-col items-center gap-4">
            <BiLoaderAlt className="w-8 h-8 animate-spin text-emerald-400" />
            <p className="text-white/50 text-sm font-light uppercase tracking-widest">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#04130d] text-white font-sans flex items-center justify-center overflow-hidden selection:bg-emerald-500/30 px-4 py-12">
      
      {/* ── Global Ambient Background ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-emerald-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-teal-400/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      

      {/* Main Profile Card */}
      <div className="relative w-full max-w-sm z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="relative rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] shadow-[0_0_60px_rgba(16,185,129,0.05)] overflow-hidden p-8 sm:p-10 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-bold">User Profile</span>
            </div>

            {/* PROFILE IMAGE */}
            <div className="relative mb-6 group">
                <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                <img
                    src={assets.profile}
                    alt="Profile"
                    className="relative w-28 h-28 rounded-full object-cover border-2 border-white/10 group-hover:border-emerald-400/50 transition-colors duration-500 shadow-xl"
                />
            </div>

            {/* USER INFO */}
            <h3 className="text-2xl font-semibold text-white tracking-tight mb-1 flex items-center justify-center gap-2">
                {user.name}
            </h3>
            
            <div className="flex items-center justify-center gap-2 text-white/50 mb-8 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                <HiOutlineMail className="w-4 h-4 text-emerald-400/70" />
                <p className="text-sm font-light">{user.email}</p>
            </div>

            {/* DIVIDER */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

            {/* LOGOUT BUTTON */}
            <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold tracking-wide text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white hover:shadow-[0_4px_20px_rgba(239,68,68,0.3)] transition-all duration-300 group"
            >
                <HiOutlineLogout className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Sign Out
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;     