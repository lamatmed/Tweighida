import { Facebook, PhoneCall } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#232946] via-[#6246ea] to-[#b8c1ec] text-white text-center py-8 mt-16 shadow-inner">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-3 px-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg font-bold bg-gradient-to-r from-[#eebbc3] to-[#b8c1ec] bg-clip-text text-transparent">Tweighida</span>
        </div>
        <p className="text-xs sm:text-sm text-[#d1d7e0]">© {new Date().getFullYear()} Tweighida — Tous droits réservés</p>
        <div className="flex space-x-4 mt-2">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 hover:text-[#eebbc3] transition-transform">
            <Facebook size={26} />
          </a>
          <a href="https://wa.me/244939465408" target="_blank" rel="noopener noreferrer" className="hover:scale-110 hover:text-[#43e97b] transition-transform">
            <PhoneCall size={26} />
          </a>
        </div>
      </div>
    </footer>
  );
}
