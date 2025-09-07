import { Facebook, PhoneCall, Mail, MapPin, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-800 text-white pt-16 pb-8 shadow-inner border-t border-slate-700/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Tweighida
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-6 max-w-xs">
              Soluções inovadoras para transformar sua empresa e otimizar seus processos comerciais com inteligência artificial.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 hover:bg-indigo-600 p-3 rounded-lg transition-colors"
                aria-label="Visite nossa página no Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://wa.me/244939465408"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 hover:bg-green-600 p-3 rounded-lg transition-colors"
                aria-label="Entre em contato pelo WhatsApp"
              >
                <PhoneCall size={20} />
              </a>
              <a
                href="mailto:contact@tweighida.com"
                className="bg-slate-800 hover:bg-cyan-600 p-3 rounded-lg transition-colors"
                aria-label="Envie-nos um email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-white">Soluções</h3>
            <ul className="space-y-3">
              <li><a href="/solutions/ia" className="text-slate-400 hover:text-indigo-400 text-sm flex items-center gap-2 transition-colors">Inteligência Artificial</a></li>
              <li><a href="/solutions/gestion" className="text-slate-400 hover:text-indigo-400 text-sm flex items-center gap-2 transition-colors">Gestão de Estoque</a></li>
              <li><a href="/solutions/ecommerce" className="text-slate-400 hover:text-indigo-400 text-sm flex items-center gap-2 transition-colors">E-commerce</a></li>
              <li><a href="/solutions/analytics" className="text-slate-400 hover:text-indigo-400 text-sm flex items-center gap-2 transition-colors">Análises</a></li>
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-white">Empresa</h3>
            <ul className="space-y-3">
              <li><a href="/about" className="text-slate-400 hover:text-indigo-400 text-sm flex items-center gap-2 transition-colors">Sobre</a></li>
              <li><a href="/careers" className="text-slate-400 hover:text-indigo-400 text-sm flex items-center gap-2 transition-colors">Carreiras</a></li>
              <li><a href="/blog" className="text-slate-400 hover:text-indigo-400 text-sm flex items-center gap-2 transition-colors">Blog</a></li>
              <li><a href="/contact" className="text-slate-400 hover:text-indigo-400 text-sm flex items-center gap-2 transition-colors">Contato</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-white">Contato</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-indigo-400 mt-1 flex-shrink-0" />
                <p className="text-slate-400 text-sm">Lubango, Huila, Angola</p>
              </div>
              <div className="flex items-center gap-3">
                <PhoneCall size={18} className="text-indigo-400 flex-shrink-0" />
                <p className="text-slate-400 text-sm">+244 939 465 408</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-indigo-400 flex-shrink-0" />
                <p className="text-slate-400 text-sm">contact@tweighida.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-slate-700/50 pt-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2 text-white">Mantenha-se informado</h3>
              <p className="text-slate-400 text-sm">Inscreva-se na nossa newsletter para receber nossas novidades.</p>
            </div>
            <div className="flex-1 w-full max-w-md">
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Seu email"
                  className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1"
                  required
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-lg font-medium text-sm hover:shadow-lg transition-shadow flex items-center gap-2"
                >
                  Inscrever-se <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-700/30 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm text-center md:text-left mb-4 md:mb-0">
            © {new Date().getFullYear()} Tweighida. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <a href="/privacy" className="text-slate-500 hover:text-indigo-400 text-sm transition-colors">
              Privacidade
            </a>
            <a href="/terms" className="text-slate-500 hover:text-indigo-400 text-sm transition-colors">
              Termos de uso
            </a>
            <a href="/cookies" className="text-slate-500 hover:text-indigo-400 text-sm transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}