import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    HiOutlineMail, 
    HiOutlineLockClosed, 
    HiOutlineUser, 
    HiArrowRight,
    HiOutlineGlobeAlt
} from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';

const Auth = ({ defaultIsLogin = true }) => {
    const [isLogin, setIsLogin] = useState(defaultIsLogin);
    const navigate = useNavigate();

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(isLogin ? "Logging in..." : "Signing up...", formData);
        // Add your auth logic here
        // navigate('/dashboard'); 
    };

    // Framer Motion Variants
    const formVariants = {
        hidden: { opacity: 0, x: isLogin ? -30 : 30, filter: "blur(4px)" },
        visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.4, ease: "easeOut" } },
        exit: { opacity: 0, x: isLogin ? 30 : -30, filter: "blur(4px)", transition: { duration: 0.3, ease: "easeIn" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="pt-10  relative min-h-screen bg-[#04130d] text-white font-sans flex items-center justify-center overflow-hidden selection:bg-emerald-500/30 px-4">
            
            {/* ── Global Ambient Background ── */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-emerald-500/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-teal-400/5 rounded-full blur-[120px]" />
                {/* <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div> */}
            </div>

            {/* Back to Home Button */}
            

            {/* Main Auth Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-md z-10"
            >
                {/* Glassmorphism Container */}
                <div className="relative rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] shadow-[0_0_60px_rgba(16,185,129,0.05)] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none" />
                    
                    <div className="p-8 sm:p-10 relative z-10">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-5">
                                <HiOutlineGlobeAlt className="w-6 h-6 text-emerald-400" />
                            </div>
                            <h2 className="text-3xl font-light tracking-tight text-white mb-2">
                                {isLogin ? 'Welcome back' : 'Create an account'}
                            </h2>
                            <p className="text-sm text-white/50 font-light">
                                {isLogin ? 'Enter your details to access your workspace.' : 'Join the modern traditional medicine platform.'}
                            </p>
                        </div>

                        {/* Toggle Switch */}
                        <div className="flex p-1 mb-8 bg-white/5 rounded-xl border border-white/10 relative">
                            <button
                                onClick={() => setIsLogin(true)}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg z-10 transition-colors duration-300 ${isLogin ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setIsLogin(false)}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg z-10 transition-colors duration-300 ${!isLogin ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
                            >
                                Sign Up
                            </button>
                            {/* Animated Background Pill */}
                            <motion.div 
                                className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white/10 rounded-lg shadow-sm border border-white/5"
                                animate={{ left: isLogin ? '4px' : 'calc(50%)' }}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                        </div>

                        {/* Form Area */}
                        <div className="relative overflow-hidden min-h-[220px]">
                            <AnimatePresence mode="wait">
                                <motion.form
                                    key={isLogin ? 'login' : 'signup'}
                                    variants={formVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    onSubmit={handleSubmit}
                                    className="w-full flex flex-col gap-4"
                                >
                                    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-4">
                                        
                                        {/* Name Input (Only for Sign Up) */}
                                        {!isLogin && (
                                            <motion.div variants={itemVariants} className="relative">
                                                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    placeholder="Full Name"
                                                    required
                                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all duration-300"
                                                />
                                            </motion.div>
                                        )}

                                        {/* Email Input */}
                                        <motion.div variants={itemVariants} className="relative">
                                            <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="Email Address"
                                                required
                                                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all duration-300"
                                            />
                                        </motion.div>

                                        {/* Password Input */}
                                        <motion.div variants={itemVariants} className="relative">
                                            <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                placeholder="Password"
                                                required
                                                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all duration-300"
                                            />
                                        </motion.div>

                                        {/* Forgot Password Link (Only for Login) */}
                                        {isLogin && (
                                            <motion.div variants={itemVariants} className="flex justify-end">
                                                <button type="button" className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                                                    Forgot password?
                                                </button>
                                            </motion.div>
                                        )}

                                        {/* Submit Button */}
                                        <motion.button
                                            variants={itemVariants}
                                            type="submit"
                                            className="w-full py-3.5 mt-2 rounded-xl text-sm font-semibold tracking-wide text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                                        >
                                            {isLogin ? 'Sign In' : 'Create Account'}
                                        </motion.button>
                                    </motion.div>
                                </motion.form>
                            </AnimatePresence>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-8">
                            <div className="h-px bg-white/10 flex-1" />
                            <span className="text-xs text-white/40 uppercase tracking-widest font-medium">Or continue with</span>
                            <div className="h-px bg-white/10 flex-1" />
                        </div>

                        {/* Social Login */}
                        <button className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group">
                            <FcGoogle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">Google</span>
                        </button>

                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;