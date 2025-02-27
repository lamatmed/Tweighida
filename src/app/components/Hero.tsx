'use client'
import { useState, useEffect } from "react";

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
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center text-center bg-gradient-to-r from-yellow-500 to-indigo-600 text-white px-4">
      <div className="w-full max-w-4xl px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          Bem-vindo à <span className="text-yellow-300">NotesApp</span> 📓
        </h1>
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
    </section>
  );
}
