import React from 'react';
import { motion } from 'framer-motion';

const VitalsCard = ({ label, value, unit, icon: Icon, color, isCritical, animateBeat }) => {
  // Determine color palette based on state
  const primaryColor = isCritical ? 'text-red-500' : 'text-zinc-100';
  const borderColor = isCritical ? 'border-red-600' : 'border-zinc-800';
  const glowColor = isCritical ? 'bg-red-500/20' : 'bg-transparent';

  return (
    <div className={`relative group w-full bg-black border ${borderColor} transition-all duration-300 p-4 flex flex-col justify-between min-h-[140px] overflow-hidden`}>
      
      {/* 1. Critical Background Strobe */}
      {isCritical && (
         <div className="absolute inset-0 bg-red-900/20 animate-pulse pointer-events-none" />
      )}

      {/* 2. Technical Header */}
      <div className="flex justify-between items-start relative z-10 mb-4">
        <div className="flex items-center gap-2">
           {/* Status LED */}
           <div className={`w-1.5 h-1.5 ${isCritical ? 'bg-red-500 animate-ping' : 'bg-zinc-600 group-hover:bg-cyan-400'} transition-colors`} />
           <span className={`text-[10px] font-mono font-bold tracking-[0.2em] uppercase ${isCritical ? 'text-red-400' : 'text-zinc-500 group-hover:text-cyan-500'} transition-colors`}>
             {label}
           </span>
        </div>
        <Icon className={`w-4 h-4 ${isCritical ? 'text-red-500 animate-pulse' : 'text-zinc-700 group-hover:text-zinc-500'} transition-colors`} />
      </div>

      {/* 3. Main Value Display */}
      <div className="relative z-10 flex items-end gap-3 translate-y-2">
        <span className={`text-6xl md:text-7xl font-mono font-light tracking-tighter leading-none ${primaryColor} ${isCritical ? 'drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]' : ''}`}>
          {value}
        </span>
        <span className={`text-xs font-mono font-bold uppercase mb-2 ${isCritical ? 'text-red-400' : 'text-zinc-600'}`}>
          {unit}
        </span>
      </div>

      {/* 4. Animated Data Line (Bottom) */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-900 border-t border-zinc-800 flex items-end">
         {animateBeat && value > 0 && (
            <motion.div 
              animate={{ 
                opacity: [0.2, 1, 0.2],
                width: ["0%", "100%", "0%"] // Scans across
              }}
              transition={{ 
                repeat: Infinity, 
                duration: value > 0 ? 60 / value : 1,
                ease: "linear"
              }}
              className={`h-full ${isCritical ? 'bg-red-500' : 'bg-cyan-500'}`}
            />
         )}
      </div>

      {/* 5. Brutalist Decor (Corners & ID) */}
      <div className="absolute top-0 right-0 p-1 opacity-30">
        <div className="w-2 h-2 border-t border-r border-white"></div>
      </div>
      <div className="absolute bottom-2 right-2 z-0">
        <span className="text-[20px] font-black text-zinc-900 select-none uppercase pointer-events-none">
           {label.substring(0, 3)}_01
        </span>
      </div>

    </div>
  );
};

export default VitalsCard;