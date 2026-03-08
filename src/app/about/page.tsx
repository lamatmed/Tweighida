'use client'
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import { Info, CheckCircle2, Rocket, ArrowLeft } from "lucide-react";

export default function About() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader/>;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 pt-10 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-gray-100 overflow-hidden">
          {/* Decorative Header */}
          <div className="h-3 bg-gradient-to-r from-indigo-600 to-purple-600 w-full" />
          
          <div className="p-8 md:p-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <Info size={32} />
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                  Sobre a <span className="text-indigo-600">Tweighida</span>
                </h1>
                <p className="text-slate-500 font-medium">Versão 1.5.0 • Plataforma Enterprise</p>
              </div>
            </div>

            <p className="text-lg text-slate-600 leading-relaxed mb-12">
              A Tweighida Comercial LDA é uma empresa líder em soluções digitais inovadoras, 
              focada em transformar a gestão empresarial em Angola através de tecnologia de 
              ponta e inteligência artificial personalizada.
            </p>

            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Rocket className="text-indigo-500" size={24} />
                  Nossa Missão
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  Providenciar ferramentas intuitivas e poderosas que permitam aos nossos clientes 
                  gerirem os seus negócios com máxima eficiência, segurança e escala.
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="text-emerald-500" size={24} />
                  Destaques do Sistema
                </h2>
                <ul className="space-y-4">
                  {[
                    "Gestão de vendas e stock em tempo real",
                    "Relatórios analíticos automatizados (PDF)",
                    "Segurança de dados enterprise com Appwrite",
                    "Interface moderna, fluída e responsiva"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 font-medium">
                      <div className="mt-1 bg-emerald-100 text-emerald-600 rounded-full p-0.5">
                        <CheckCircle2 size={14} />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100 flex justify-between items-center flex-wrap gap-4">
              <a 
                href="/" 
                className="inline-flex items-center gap-2 font-bold text-indigo-600 hover:text-indigo-700 transition-colors group"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Voltar ao Início
              </a>
              
              <div className="text-slate-400 text-sm italic">
                Tweighida Comercial LDA © {new Date().getFullYear()}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
