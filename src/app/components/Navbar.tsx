'use client'
import { useState } from "react";
import { Menu, X } from "lucide-react"; // Icônes pour le menu mobile

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-600 text-white p-3 shadow-md">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">TWEYIGHIDA COMERCIAL LDA</h1>

        {/* Bouton Menu pour mobile */}
        <button
          className="lg:hidden block focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Menu Desktop */}
        <ul className="hidden lg:flex space-x-4">
          <li><a href="/" className="hover:underline">Accueil</a></li>
          <li><a href="/notes" className="hover:underline">Notes</a></li>
          <li><a href="/about" className="hover:underline">À propos</a></li>
        </ul>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <ul className="lg:hidden flex flex-col items-center space-y-3 mt-3">
          <li><a href="/" className="hover:underline" onClick={() => setIsOpen(false)}>Accueil</a></li>
          <li><a href="/notes" className="hover:underline" onClick={() => setIsOpen(false)}>Notes</a></li>
          <li><a href="/about" className="hover:underline" onClick={() => setIsOpen(false)}>À propos</a></li>
        </ul>
      )}
    </nav>
  );
}
