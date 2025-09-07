'use client';
import { useState, useEffect } from "react";
import Loader from "./Loader";
import { motion } from "framer-motion";
import { ArrowRight, Play, MessageCircle, BarChart3, Shield, Users, PhoneCall } from "lucide-react";

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
    <section className="relative w-full min-h-screen flex items-center justify-center text-center bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white px-4 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiMzMTM3NDIiIHN0cm9rZS13aWR0aD0iMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjE1Ii8+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjkiLz48L2c+PC9zdmc+')] opacity-20 z-0"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-600 opacity-10 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-600 opacity-10 rounded-full blur-3xl" aria-hidden="true" />
      
      <div className="w-full max-w-6xl px-6 py-16 md:py-24 z-10">
        <motion.div
          className="inline-flex items-center gap-2 bg-indigo-900/30 border border-indigo-700/30 rounded-full px-4 py-2 mb-6 text-sm text-indigo-200"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <BarChart3 size={16} />
          <span>Solução de gestão empresarial tudo-em-um</span>
        </motion.div>
        
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Tweighida</span> — 
          <div className="mt-2">Seu Parceiro em Comércio Digital</div>
        </motion.h1>
        
        <motion.p
          className="text-lg sm:text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-slate-300 font-light"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeInOut' }}
        >
          Otimize sua cadeia de suprimentos, gerencie seus estoques e desenvolva sua presença online com nossas soluções de IA integradas.
        </motion.p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <motion.a
            href="/demo"
            className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 group"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Venda <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </motion.a>
          
          <motion.a
            href="https://wa.me/244934808438"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-green-600 to-teal-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 group"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <MessageCircle size={20} /> WhatsApp
          </motion.a>
        </div>
        
        {/* Features highlights */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          <div className="bg-slate-800/40 backdrop-blur-sm p-5 rounded-xl border border-slate-700/30">
            <div className="bg-indigo-700/20 p-3 rounded-lg inline-flex mb-3">
              <Shield size={24} className="text-indigo-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Segurança de dados</h3>
            <p className="text-slate-400">Proteção avançada para suas informações comerciais sensíveis.</p>
          </div>
          
          <div className="bg-slate-800/40 backdrop-blur-sm p-5 rounded-xl border border-slate-700/30">
            <div className="bg-purple-700/20 p-3 rounded-lg inline-flex mb-3">
              <BarChart3 size={24} className="text-purple-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Análise em tempo real</h3>
            <p className="text-slate-400">Monitore seu desempenho comercial com painéis intuitivos.</p>
          </div>
          
          <div className="bg-slate-800/40 backdrop-blur-sm p-5 rounded-xl border border-slate-700/30">
            <div className="bg-cyan-700/20 p-3 rounded-lg inline-flex mb-3">
              <Users size={24} className="text-cyan-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Gestão de equipe</h3>
            <p className="text-slate-400">Colabore eficazmente com seus parceiros e funcionários.</p>
          </div>
        </motion.div>
        
        <div className="mt-6 text-sm text-slate-500">
          <span className="flex items-center justify-center gap-2">
            <PhoneCall size={16} /> Suporte ao cliente 24/7
          </span>
        </div>
      </div>
      
      {/* Bottom wave divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg 
          className="relative block w-full h-16 md:h-24 text-slate-900" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V56.44Z" fill="currentColor"></path>
        </svg>
      </div>
    </section>
  );
}