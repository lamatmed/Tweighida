'use client';

import { useState, useEffect } from "react";
import Loader from "./Loader";
import { motion } from "framer-motion";
import { PhoneCallIcon, PlayIcon } from "lucide-react";

export default function Hero() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center text-center bg-gradient-to-br from-blue-600 via-blue-500 to-blue-500 text-white px-4 overflow-hidden">
      {/* Decorative blob */}
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-gradient-to-tr from-[#6246ea] via-[#232946] to-[#eebbc3] opacity-30 rounded-full blur-3xl z-0" aria-hidden="true" />
      <div className="w-full max-w-3xl px-6 py-16 md:py-24 z-10">
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight drop-shadow-lg"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <span className="text-[#eebbc3]">Tweighida</span> — L'application de notes d'entreprise
        </motion.h1>
        <motion.p
          className="text-base sm:text-lg md:text-xl mb-8 max-w-xl mx-auto text-[#d1d7e0] font-medium"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeInOut' }}
        >
          Gérez, partagez et sécurisez vos notes professionnelles avec une interface moderne, rapide et adaptée à tous vos appareils.
        </motion.p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/notes"
            className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-[#6246ea] to-[#eebbc3] text-[#232946] rounded-xl shadow-lg transition-all transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#6246ea] flex items-center gap-2"
          >
            <PlayIcon size={22} /> Démarrer
          </a>
          <a
            href="https://wa.me/244934808438"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-[#43e97b] to-[#38f9d7] text-[#232946] rounded-xl shadow-lg transition-all transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#43e97b] flex items-center gap-2"
          >
            <PhoneCallIcon size={22} /> WhatsApp
          </a>
        </div>
        <div className="mt-10 text-xs text-[#b8c1ec] opacity-80">© 2024 Tweighida. Pour les entreprises modernes.</div>
      </div>
      {/* Decorative wave bottom */}
      <svg className="absolute bottom-0 left-0 w-full h-24 md:h-32 z-0" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path fill="#232946" fillOpacity="1" d="M0,224L48,202.7C96,181,192,139,288,144C384,149,480,203,576,197.3C672,192,768,128,864,117.3C960,107,1056,149,1152,176C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
      </svg>
    </section>
  );
}
