import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { 
    HiOutlineMail, 
    HiOutlineLockClosed, 
    HiOutlineGlobeAlt,
    HiArrowRight
} from "react-icons/hi";

const Register = () => {

  const [message, setMessage] = useState("");
  const { registerUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // 🔐 Email Registration (Logic preserved exactly)
  const onSubmit = async (data) => {
    console.log("FORM SUBMITTED", data);
    try {
      await registerUser(data.email, data.password);
      alert("User registered successfully!")
    } catch (error) {
      setMessage("Please provide a valid email and password")
      console.error(error);
    }
  }

  // 🔵 Google Registration (Logic preserved exactly)
  const handleSignInWithGoogle = async () => {
    console.log("Google button was clicked! Waiting for Firebase..."); // Add this
    try {
      await signInWithGoogle();
      alert("User registered successfully!")
      navigate("/login")
    } catch (error) {
      alert("Google sign in failed!")
      console.error(error);
    }
  }

  return (
    <div className="pt-20 pb-5 relative min-h-screen bg-[#04130d] text-white font-sans flex items-center justify-center overflow-hidden selection:bg-emerald-500/30 px-4 py-12">
      
      {/* ── Global Ambient Background ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-emerald-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-teal-400/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      {/* Back to Home Button */}
      {/* <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 z-20 flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-300 text-sm font-medium"
      >
        <HiArrowRight className="rotate-180 w-4 h-4" />
        Back to Home
      </button> */}

      {/* Main Auth Card */}
      <div className="relative w-full max-w-md z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="relative rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] shadow-[0_0_60px_rgba(16,185,129,0.05)] overflow-hidden p-8 sm:p-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-5">
                <HiOutlineGlobeAlt className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-light tracking-tight text-white mb-2">
                Create an account
              </h2>
              <p className="text-sm text-white/50 font-light">
                Join the platform to access the modern traditional medicine registry.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

              {/* EMAIL */}
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  {...register("email", { required: true })}
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all duration-300"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1.5 ml-1">Email is required</p>
                )}
              </div>

              {/* PASSWORD */}
              <div className="relative mt-1">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  {...register("password", { required: true })}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all duration-300"
                />
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1.5 ml-1">Password is required</p>
                )}
              </div>

              {/* ERROR MESSAGE */}
              {message && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 mt-2">
                  <p className="text-red-400 text-sm text-center font-medium">{message}</p>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="w-full py-3.5 mt-4 rounded-xl text-sm font-semibold tracking-wide text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
              >
                Sign Up
              </button>
            </form>

            <p className="text-center text-sm text-white/50 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                Login
              </Link>
            </p>

            {/* DIVIDER */}
            <div className="flex items-center gap-4 my-8">
              <div className="h-px bg-white/10 flex-1" />
              <span className="text-xs text-white/40 uppercase tracking-widest font-medium">OR</span>
              <div className="h-px bg-white/10 flex-1" />
            </div>

            {/* GOOGLE BUTTON */}
            <button
              onClick={handleSignInWithGoogle}
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
            >
              <FaGoogle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                Sign up with Google
              </span>
            </button>

            {/* FOOTER */}
            <p className="mt-8 text-center text-white/30 text-xs font-light">
              © {new Date().getFullYear()} AyurMap Registry. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;