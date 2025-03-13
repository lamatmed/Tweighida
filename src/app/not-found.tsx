"use client";

import { AlertTriangle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import React from "react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-900">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <AlertTriangle className="w-24 h-24 text-red-500 animate-bounce" />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Image src="/not-found.png" alt="Not Found" width={220} height={220} unoptimized />
      </motion.div>

      <p className="text-xl text-gray-600 mt-4">Page introuvable</p>

<motion.div 
  initial={{ opacity: 0, y: 20 }} 
  animate={{ opacity: 1, y: 0 }} 
  transition={{ delay: 0.5, duration: 0.5 }}
  className="mt-10" // Augmentation de l'espace
>
  <Link href="/">
    <span className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition transform hover:scale-105 cursor-pointer">
      Retour à l'accueil
    </span>
  </Link>
</motion.div>

    </div>
  );
};

export default NotFound;
