import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulasi loading 0 - 100%
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 500); // Trigger selesai
          return 100;
        }
        return prev + 1;
      });
    }, 25);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white font-sans overflow-hidden"
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      {/* Background Glow Hiasan */}
      <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />

      {/* Konten Utama Loading */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <motion.h1 
          className="text-3xl md:text-5xl font-bold tracking-wider mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-500"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Welcome To My <br className="sm:hidden" /> Portfolio Website
        </motion.h1>

        {/* Progress Bar Container */}
        <div className="w-64 md:w-80 h-2 bg-slate-800 rounded-full overflow-hidden mb-3 border border-slate-700/50 shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress Text */}
        <div className="flex items-center gap-2 text-slate-400 text-sm tracking-widest font-mono">
          <span>Loading</span>
          <span className="text-blue-400 font-semibold">{progress}%</span>
        </div>
      </div>
    </motion.div>
  );
}