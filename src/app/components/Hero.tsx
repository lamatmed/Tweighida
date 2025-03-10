'use client'
import { useState, useEffect } from "react";
import Loader from "./Loader";
import { motion } from "framer-motion";
import { PhoneCallIcon } from "lucide-react";
export default function Hero() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simule un chargement (remplace par tes données si besoin)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Charge pendant 1s
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
    <Loader/>
    );
  }

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center text-center bg-gradient-to-r from-yellow-500 to-indigo-600 text-white px-4">
      <div className="w-full max-w-4xl px-6">
      <motion.h1
  className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight"
  initial={{ y: -10, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.8, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
>
  Bem-vindo à <span className="text-yellow-300">NotesApp</span> 📓
</motion.h1>

        <p className="text-base sm:text-lg md:text-xl mb-7 max-w-lg mx-auto">
          Faça a gestão das suas notas de forma fácil e eficiente. Adicione, edite e elimine as suas notas com facilidade.
        </p>
        <a
          href="/notes"
          className="px-6 py-3 text-lg font-semibold bg-yellow-400 text-gray-900 rounded-lg transition-all transform hover:bg-yellow-500 hover:scale-105 active:scale-95"
        >
          Começar 🚀
        </a>
         
      </div>
      <a href="https://wa.me/222301473" target="_blank" rel="noopener noreferrer" className="px-6 py-3 text-lg font-semibold bg-yellow-400 text-gray-900 rounded-lg transition-all transform hover:bg-yellow-500 hover:scale-105 active:scale-95">
                    <PhoneCallIcon size={20} />WhatsApp
                  </a>
    </section>
  );
}
