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
    <section className="relative w-full min-h-screen flex items-center justify-center bg-[#080b14] text-white pt-20 pb-24 px-6 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
      </div>
      
      <div className="w-full max-w-7xl relative z-10">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Tecnologia Angolana de Elite
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.05] tracking-tight"
          >
            Impulsione seu <br/>
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">Negócio Digital</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Gestão inteligente, automação com IA e análise de dados em tempo real 
            para empresas que buscam liderança no mercado angolano.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto mb-24"
          >
            <a
              href="/notes"
              className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-indigo-600/20 hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              Começar Agora <ArrowRight size={20} />
            </a>
            <a
              href="#"
              className="px-10 py-5 bg-transparent border border-slate-700 hover:bg-slate-800/50 text-white rounded-2xl font-bold text-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              Ver Demonstração <Play size={18} fill="currentColor" />
            </a>
          </motion.div>

          {/* Social Proof / Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 border-t border-slate-800/60 pt-16 w-full"
          >
            {[
              { label: 'Clientes Ativos', value: '500+' },
              { label: 'Transações/Mês', value: '250k' },
              { label: 'Eficiência de IA', value: '99.9%' },
              { label: 'Satisfação', value: '4.9/5' }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center md:items-start">
                <span className="text-3xl md:text-4xl font-black text-white mb-1">{stat.value}</span>
                <span className="text-slate-500 text-sm font-medium">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Subtle bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#f8fafc] to-transparent z-10"></div>
    </section>
  );
}