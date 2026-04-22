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

const Login = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // 🔐 Email Login (Logic preserved exactly)
  const onSubmit = async (data) => {
    setMessage("");
    setLoading(true);

    try {
      const user = await loginUser(data.email, data.password);
      console.log("✅ Login successful:", user);
      navigate("/profile");
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔵 Google Login (Logic preserved exactly)
  const handleGoogleSignIn = async () => {
    setMessage("");
    setLoading(true);

    try {
      const user = await signInWithGoogle();
      console.log("✅ Google login:", user);
      navigate("/profile");
    } catch (error) {
      console.error(error);
      setMessage("Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 pb-5 relative min-h-screen bg-[#04130d] text-white font-sans flex items-center justify-center overflow-hidden selection:bg-emerald-500/30 px-4">
      
      {/* ── Global Ambient Background ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-emerald-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-teal-400/5 rounded-full blur-[120px]" />
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
                Welcome back
              </h2>
              <p className="text-sm text-white/50 font-light">
                Enter your details to access your dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

              {/* EMAIL */}
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  {...register("email", { required: "Email is required" })}
                  type="email"
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all duration-300"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.email.message}</p>
                )}
              </div>

              {/* PASSWORD */}
              <div className="relative mt-1">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  {...register("password", { required: "Password is required" })}
                  type="password"
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all duration-300"
                />
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.password.message}</p>
                )}
              </div>

              {/* ERROR */}
              {message && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 mt-2">
                  <p className="text-red-400 text-sm text-center">{message}</p>
                </div>
              )}

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-4 rounded-xl text-sm font-semibold tracking-wide text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="text-center text-sm text-white/50 mt-6">
              Don’t have an account?{" "}
              <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                Register
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
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group"
            >
              <FaGoogle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                Continue with Google
              </span>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;