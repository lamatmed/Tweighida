import { Facebook, PhoneCall, Mail, MapPin, ArrowRight, Building2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0b0f1a] text-slate-300 pt-20 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-lg">
                <Building2 size={24} className="text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Tweighida
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Potencializando empresas angolanas com tecnologia de ponta, 
              inteligência artificial e soluções de gestão de classe mundial.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <Facebook size={18} />, color: "hover:bg-blue-600", label: "Facebook" },
                { icon: <PhoneCall size={18} />, color: "hover:bg-green-600", label: "WhatsApp" },
                { icon: <Mail size={18} />, color: "hover:bg-indigo-600", label: "Email" }
              ].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  className={`p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all ${social.color}`}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Nossas Soluções</h3>
            <ul className="space-y-4">
              {['Inteligência Artificial', 'Gestão de Estoque', 'E-commerce Moderno', 'Análises de Dados'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-indigo-400 text-sm transition-colors flex items-center group">
                    <ArrowRight size={14} className="mr-0 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">A Empresa</h3>
            <ul className="space-y-4">
              {['Sobre Nós', 'Carreiras', 'Blog Corporativo', 'Centro de Contato'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-indigo-400 text-sm transition-colors flex items-center group">
                    <ArrowRight size={14} className="mr-0 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Localize-nos</h3>
            <div className="space-y-5">
              <div className="flex gap-4">
                <div className="p-2 bg-slate-900 rounded-lg h-fit text-indigo-400 border border-slate-800">
                  <MapPin size={18} />
                </div>
                <p className="text-slate-400 text-sm leading-snug">Lubango, Huila<br/>Angola, Central Business District</p>
              </div>
              <div className="flex gap-4">
                <div className="p-2 bg-slate-900 rounded-lg h-fit text-indigo-400 border border-slate-800">
                  <PhoneCall size={18} />
                </div>
                <p className="text-slate-400 text-sm">+244 939 465 408</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter / CTA */}
        <div className="bg-indigo-600/5 border border-indigo-500/10 rounded-2xl p-8 mb-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left">
            <h3 className="text-xl font-bold text-white mb-2">Pronto para modernizar seu negócio?</h3>
            <p className="text-slate-400 text-sm">Receba as últimas tendências de tecnologia diretamente no seu email.</p>
          </div>
          <form className="flex w-full lg:w-auto gap-3">
            <input
              type="email"
              placeholder="Email profissional"
              className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              required
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-indigo-500 transition-colors whitespace-nowrap shadow-lg shadow-indigo-600/20"
            >
              Inscrever
            </button>
          </form>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Tweighida Comercial LDA. Todos os direitos reservados.
          </p>
          <div className="flex gap-8">
            {['Privacidade', 'Termos', 'Cookies'].map(link => (
              <a key={link} href="#" className="text-slate-500 hover:text-indigo-400 text-xs uppercase tracking-tighter transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}