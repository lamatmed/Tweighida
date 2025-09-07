'use client'
import { useState } from "react";
import { FileText, Home, Info, Menu, ShoppingCartIcon, X } from "lucide-react"; // Icônes pour le menu mobile
import { motion } from "framer-motion";
import { BsRobot } from "react-icons/bs";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-[# to-[#b8c1ec] text-white shadow-lg backdrop-blur-md">
      <div className="max-w-5xl mx-auto flex justify-between items-center px-4 py-3">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            <ShoppingCartIcon size={30} className="text-[#eebbc3] drop-shadow" />
          </motion.div>
          <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#eebbc3] to-[#b8c1ec] bg-clip-text text-transparent drop-shadow">Tweighida</span>
        </div>
        {/* Bouton Menu pour mobile */}
        <button
          className="lg:hidden block focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Ouvrir le menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        {/* Menu Desktop */}
        <ul className="hidden lg:flex space-x-2">
          <li><a href="/" className="px-4 py-2 rounded-lg font-semibold hover:bg-[#eebbc3]/20 transition">Accueil</a></li>
          <li><a href="/notes" className="px-4 py-2 rounded-lg font-semibold hover:bg-[#eebbc3]/20 transition">Notes</a></li>
          <li><a href="/chat" className="px-4 py-2 rounded-lg font-semibold hover:bg-[#eebbc3]/20 transition">AI</a></li>
          <li><a href="/about" className="px-4 py-2 rounded-lg font-semibold hover:bg-[#eebbc3]/20 transition">À propos</a></li>
        </ul>
      </div>
      {/* Menu Mobile */}
      {isOpen && (
        <ul className="lg:hidden flex flex-col items-center space-y-3 pb-4 bg-gradient-to-b from-[#232946]/95 via-[#6246ea]/90 to-[#b8c1ec]/80 shadow-xl rounded-b-2xl animate-fade-in-down">
          <li>
            <a href="/" className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold hover:bg-[#eebbc3]/20 transition" onClick={() => setIsOpen(false)}>
              <Home size={20} /> Accueil
            </a>
          </li>
          <li>
            <a href="/notes" className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold hover:bg-[#eebbc3]/20 transition" onClick={() => setIsOpen(false)}>
              <FileText size={15} /> Notes
            </a>
          </li>
          <li>
            <a href="/chat" className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold hover:bg-[#eebbc3]/20 transition" onClick={() => setIsOpen(false)}>
              <BsRobot size={15} /> AI
            </a>
          </li>
          <li>
            <a href="/about" className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold hover:bg-[#eebbc3]/20 transition" onClick={() => setIsOpen(false)}>
              <Info size={15} /> À propos
            </a>
          </li>
        </ul>
      )}
    </nav>
  );
}
