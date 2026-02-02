import React from 'react';
import { Radio, RotateCcw, Play } from 'lucide-react';

const TimeControl = ({ isLive, onToggle, onReplay }) => {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-50">
      
      {/* 1. DVR Status Warning (Only visible when Replaying) */}
      {!isLive && (
        <div className="bg-amber-950/80 border border-amber-600 px-3 py-1 flex items-center gap-2 animate-in slide-in-from-bottom-2 fade-in">
           <div className="w-1.5 h-1.5 bg-amber-500 animate-pulse" />
           <span className="text-[10px] font-mono text-amber-500 font-bold tracking-widest uppercase">
             DVR_PLAYBACK // T-MINUS 10s
           </span>
        </div>
      )}

      {/* 2. Main Control Deck */}
      <div className="bg-black border border-zinc-700 p-1 flex items-stretch shadow-2xl relative group">
        
        {/* Decorative scanline background */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.03)_50%,transparent_100%)] pointer-events-none" />

        {/* LIVE BUTTON */}
        <button 
          onClick={() => onToggle(true)}
          className={`relative px-6 py-3 flex items-center gap-3 transition-all border border-transparent ${
            isLive 
              ? 'bg-red-950/30 border-red-900/50 text-red-500' 
              : 'hover:bg-zinc-900 text-zinc-600 hover:text-zinc-400'
          }`}
        >
          {isLive && <div className="absolute inset-0 border border-red-600/30 animate-pulse pointer-events-none" />}
          <Radio className={`w-4 h-4 ${isLive ? 'animate-pulse' : ''}`} />
          <div className="flex flex-col items-start leading-none">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase">Live_Feed</span>
            <span className="text-[8px] font-mono opacity-50">{isLive ? 'TRANSMITTING' : 'STANDBY'}</span>
          </div>
        </button>

        {/* Tech Divider */}
        <div className="w-px bg-zinc-800 self-stretch mx-1 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-zinc-900 border border-zinc-700 rotate-45" />
        </div>

        {/* REPLAY BUTTON */}
        <button 
          onClick={() => onReplay()}
          className={`relative px-6 py-3 flex items-center gap-3 transition-all border border-transparent ${
            !isLive 
              ? 'bg-cyan-950/30 border-cyan-900/50 text-cyan-400' 
              : 'hover:bg-zinc-900 text-zinc-600 hover:text-zinc-400'
          }`}
        >
          {!isLive && <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500" />}
          <RotateCcw className={`w-4 h-4 ${!isLive ? 'animate-spin-slow-reverse' : ''}`} />
          <div className="flex flex-col items-start leading-none">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase">Replay_Event</span>
            <span className="text-[8px] font-mono opacity-50">HISTORY_LOG</span>
          </div>
        </button>

        {/* Corners */}
        <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-zinc-500" />
        <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-zinc-500" />

      </div>
    </div>
  );
};

export default TimeControl;