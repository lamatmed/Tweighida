import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#080b14]/90 backdrop-blur-sm z-50">
      <div className="relative flex items-center justify-center">
        {/* Anneau extérieur en pointillé (rotation lente) */}
        <div className="absolute w-24 h-24 rounded-full border-4 border-dashed border-indigo-500/30 animate-spin" style={{ animationDuration: '6s' }}></div>
        
        {/* Anneau principal (rotation normale) */}
        <div className="absolute w-20 h-20 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
        
        {/* Anneau intérieur (rotation inverse et rapide) */}
        <div className="absolute w-14 h-14 rounded-full border-4 border-purple-500 border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        
        {/* Noyau lumineux central */}
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-[0_0_20px_rgba(99,102,241,0.5)] animate-pulse"></div>
      </div>
    </div>
  );
}

export default Loader;
