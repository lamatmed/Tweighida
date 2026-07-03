'use client'

import { Mail, Phone, MapPin, Building2, Send, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <main className="max-w-5xl mx-auto mt-12 px-6">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 font-semibold text-sm mb-4">
            <Building2 size={16} />
            <span>TWEYIGHIDA COMERCIAL LDA</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Entre em Contato Conosco
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Tem alguma questão ou deseja solicitar um orçamento? A nossa equipa está pronta para ajudar o seu negócio.
          </p>
        </div>

        {/* Contact Info and Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          
          {/* Contact Info (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8 space-y-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Informações de Contato</h3>
                <p className="text-slate-500 text-sm font-medium">Use os canais abaixo para falar diretamente connosco.</p>
              </div>

              <div className="space-y-6">
                {/* NIF & Company */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                    <Building2 size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Empresa</h4>
                    <p className="text-slate-600 text-sm">TWEYIGHIDA COMERCIAL LDA</p>
                    <p className="text-indigo-600 text-xs font-semibold">NIF: 5417208523</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <Phone size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Telefone</h4>
                    <p className="text-slate-600 text-sm">+244 934808438</p>
                    <p className="text-slate-500 text-xs">Segunda a Sexta, 8h às 17h</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                    <Mail size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">E-mail</h4>
                    <p className="text-slate-600 text-sm">contacto@tweighida.com</p>
                    <p className="text-slate-500 text-xs">Respostas em menos de 24 horas</p>
                  </div>
                </div>

                {/* Office */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Localização</h4>
                    <p className="text-slate-600 text-sm">Luanda, Angola</p>
                    <p className="text-slate-500 text-xs">Sede Principal</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Working Hours Card */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-8 shadow-xl space-y-4">
              <div className="flex items-center gap-2.5">
                <Clock size={20} className="text-indigo-400" />
                <h4 className="font-bold text-lg">Horário de Funcionamento</h4>
              </div>
              <ul className="space-y-2 text-indigo-100 text-sm">
                <li className="flex justify-between border-b border-indigo-800/40 pb-2">
                  <span>Segunda — Sexta:</span>
                  <span className="font-semibold text-white">08:00 - 17:00</span>
                </li>
                <li className="flex justify-between border-b border-indigo-800/40 pb-2">
                  <span>Sábado:</span>
                  <span className="font-semibold text-white">09:00 - 13:00</span>
                </li>
                <li className="flex justify-between pb-1">
                  <span>Domingo:</span>
                  <span className="text-indigo-300">Fechado</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form (3 cols) */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Envie uma Mensagem</h3>
              
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Mensagem enviada com sucesso! Entraremos em contacto brevemente.'); }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600 ml-1">Nome Completo</label>
                    <input
                      type="text"
                      placeholder="Ex: João Manuel"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600 ml-1">E-mail Corporativo</label>
                    <input
                      type="email"
                      placeholder="Ex: joao@empresa.com"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600 ml-1">Telefone</label>
                    <input
                      type="tel"
                      placeholder="Ex: +244 934808438"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600 ml-1">Assunto</label>
                    <input
                      type="text"
                      placeholder="Ex: Solicitação de orçamento"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600 ml-1">Mensagem</label>
                  <textarea
                    placeholder="Escreva a sua mensagem em detalhe..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none h-40 resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 group shadow-md"
                >
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  <span>Enviar Mensagem</span>
                </button>
              </form>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
