import React from 'react';
import { motion } from 'motion/react';
import { Shield, Sparkles, Trophy, Dumbbell, Apple, Activity } from 'lucide-react';

interface LandingViewProps {
  onStart: () => void;
  onLogin: () => void;
}

export default function LandingView({ onStart, onLogin }: LandingViewProps) {
  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-[#E5E5E5] flex flex-col justify-center items-center overflow-hidden px-4 pt-[70px]">
      {/* Background styling elements */}
      <div className="absolute inset-0 hero-bg-grid z-0" />
      <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] glow-orb bg-[#FF6B2B]/15 rounded-full z-0" />
      <div className="absolute bottom-[15%] right-[5%] w-[450px] h-[450px] glow-orb bg-[#F5E642]/10 rounded-full z-0" />

      {/* Main hero area */}
      <div className="relative max-w-4xl mx-auto text-center z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF6B2B]/10 border border-[#FF6B2B]/20 rounded-full text-[#FF6B2B] text-xs font-bold uppercase tracking-widest mb-6"
        >
          <Sparkles className="w-3.5 h-3.5" />
          The Next Generation of Personal Training
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight leading-none uppercase mb-6"
        >
          <span className="block text-neutral-300">Level up your</span>
          <span className="block bg-gradient-to-r from-[#FF6B2B] via-[#F5E642] to-[#FF6B2B] bg-clip-text text-transparent">
            TRAINING GAME
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-xl text-[#888] text-sm sm:text-base md:text-lg leading-relaxed mb-10 font-sans font-light"
        >
          T-0 is a premium full-stack ecosystem bridging elite Coaches and dedicated Trainees. 
          Plan schedules, prescribe elite diets, and track live transformations in real-time.
        </motion.p>

        {/* Call to action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-md"
        >
          <button
            onClick={onStart}
            className="w-full sm:w-auto px-10 py-4 bg-[#FF6B2B] hover:bg-[#D95520] text-black font-bold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-[#FF6B2B]/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            Start For Free
          </button>
          <button
            onClick={onLogin}
            className="w-full sm:w-auto px-10 py-4 bg-transparent hover:bg-[#111] text-white font-semibold text-sm uppercase tracking-wider rounded-xl border border-[#222] hover:border-[#333] transition-all cursor-pointer"
          >
            Log In
          </button>
        </motion.div>
      </div>

      {/* Highlights Bento grid */}
      <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 z-10 w-full mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="p-6 bg-[#111] border border-[#222] rounded-3xl hover:border-[#FF6B2B]/30 transition-all duration-300 flex flex-col gap-4 text-left group shadow-sm"
        >
          <div className="w-12 h-12 bg-[#FF6B2B]/10 border border-[#FF6B2B]/20 rounded-xl flex items-center justify-center text-[#FF6B2B] group-hover:scale-110 transition-transform">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display text-xl uppercase tracking-wider text-white mb-2">
              For Coaches
            </h3>
            <p className="text-sm text-[#888] font-light leading-relaxed">
              Track your client database, monitor progress sliders, and construct dynamic workout or nutrition schedules with drag-and-drop ease.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="p-6 bg-[#111] border border-[#222] rounded-3xl hover:border-[#FF6B2B]/30 transition-all duration-300 flex flex-col gap-4 text-left group shadow-sm"
        >
          <div className="w-12 h-12 bg-[#FF6B2B]/10 border border-[#FF6B2B]/20 rounded-xl flex items-center justify-center text-[#FF6B2B] group-hover:scale-110 transition-transform">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display text-xl uppercase tracking-wider text-white mb-2">
              For Trainees
            </h3>
            <p className="text-sm text-[#888] font-light leading-relaxed">
              Receive live workout updates, access high-resolution diet plans, log body weight, and track daily session completions instantly.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="p-6 bg-[#111] border border-[#222] rounded-3xl hover:border-[#FF6B2B]/30 transition-all duration-300 flex flex-col gap-4 text-left group shadow-sm"
        >
          <div className="w-12 h-12 bg-[#FF6B2B]/10 border border-[#FF6B2B]/20 rounded-xl flex items-center justify-center text-[#FF6B2B] group-hover:scale-110 transition-transform">
            <Apple className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display text-xl uppercase tracking-wider text-white mb-2">
              Premium Nutrition
            </h3>
            <p className="text-sm text-[#888] font-light leading-relaxed">
              Utilize the unified Calorie Target Calculator to tailor meal portions, target macro ranges, and accelerate client body composition changes.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
