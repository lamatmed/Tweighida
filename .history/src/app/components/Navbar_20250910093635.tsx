'use client'
import { useState } from "react";
import { FileText, Home, Info, Menu, X, Building2, Users, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BsRobot } from "react-icons/bs";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="flex items-center gap-2"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
              <Building2 size={26} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-800">Tweighida</span>
          </motion.div>
        </div>
        
        {/* Menu Desktop */}
        <ul className="hidden lg:flex space-x-1">
          <li>
            <a href="/" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center gap-2">
              <Home size={18} /> Início
            </a>
          </li>
          <li>
            <a href="/notes" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center gap-2">
              <FileText size={18} /> Vendas
            </a>
          </li>
          <li>
            <a href="/chat" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center gap-2">
              <BsRobot size={18} /> Soluções IA
            </a>
          </li>
          <li>
            <a href="/about" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center gap-2">
              <Users size={18} /> Sobre
            </a>
          </li>
          <li>
            <a href="/contact" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center gap-2">
              <Phone size={18} /> Contato
            </a>
          </li>
        </ul>

        {/* CTA Button */}
        <div className="hidden lg:flex">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-shadow"
          >
            Solicitar orçamento
          </motion.button>
        </div>

        {/* Bouton Menu para mobile */}
        <button
          className="lg:hidden block focus:outline-none p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Abrir menu"
        >
          {isOpen ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
        </button>
      </div>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white shadow-xl border-t border-gray-100 overflow-hidden"
          >
            <ul className="flex flex-col py-3 px-4 space-y-2">
              <li>
                <a href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                  <Home size={20} /> Início
                </a>
              </li>
              <li>
                <a href="/notes" className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                  <FileText size={20} /> Vendas
                </a>
              </li>
              <li>
                <a href="/chat" className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                  <BsRobot size={20} /> Soluções IA
                </a>
              </li>
              <li>
                <a href="/about" className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                  <Users size={20} /> Sobre
                </a>
              </li>
              <li>
                <a href="/contact" className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                  <Phone size={20} /> Contato
                </a>
              </li>
              <li className="pt-2 border-t border-gray-100 mt-2">
                <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-lg font-medium shadow-md">
                  Solicitar orçamento
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>