'use client'
import { useState } from "react";
import { FileText, Home, Info, Menu, ShoppingCartIcon, X } from "lucide-react"; // Icônes pour le menu mobile
import { motion } from "framer-motion";
import { BsRobot } from "react-icons/bs";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-sky-500 text-white p-3 shadow-md">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
      <motion.div
  animate={{ rotate: [0, 10, -10, 0] }}
  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
>
  <ShoppingCartIcon fontSize="large" className="text-green-800" />
</motion.div>

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
          <li><a href="/" className="hover:underline"> Receção</a></li>
          <li><a href="/notes" className="hover:underline">Observações</a></li>
          <li><a href="/about" className="hover:underline">A propósito</a></li>
        </ul>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
       <ul className="lg:hidden flex flex-col items-center space-y-3 mt-3">
       <li>
         <a href="/" className="flex items-center gap-2 hover:underline" onClick={() => setIsOpen(false)}>
           <Home size={20} /> Receção
         </a>
       </li>
       <li>
         <a href="/notes" className="flex items-center gap-2 hover:underline" onClick={() => setIsOpen(false)}>
           <FileText size={15} /> Observações
         </a>
          </li>
          <li>
            <a href="/notes" className="flex items-center gap-2 hover:underline" onClick={() => setIsOpen(false)}>
              <BsRobot size={15} /> 
            </a>
          </li>
          <li>
            
         <a href="/about" className="flex items-center gap-2 hover:underline" onClick={() => setIsOpen(false)}>
           <Info size={15} /> A propósito
         </a>
       </li>
     </ul>
     
      )}
    </nav>
  );
}
