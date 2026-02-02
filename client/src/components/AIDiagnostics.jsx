import React from 'react';
import { Brain, Activity, Sparkles, Cpu } from 'lucide-react';

const AIDiagnostics = ({ analysis, isUpdating }) => {
  return (
    <div className="h-full w-full bg-zinc-950/80 backdrop-blur-md border border-zinc-800 p-6 relative overflow-hidden flex flex-col justify-center group">
      
      {/* 1. Background Grid Texture (Matches Dashboard) */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#a78bfa 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      {/* 2. Scanning Line Effect (Sharper gradient) */}
      {isUpdating && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/10 to-transparent h-[20%] w-full animate-scan-down z-0 pointer-events-none" />
      )}

      <div className="flex items-start gap-5 relative z-10">
        {/* 3. Icon Container (Glassmorphism) */}
        <div className={`p-3 rounded-sm border backdrop-blur-sm transition-all duration-500 ${isUpdating ? 'bg-purple-500/20 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'bg-zinc-900 border-zinc-800'}`}>
           <Brain className={`w-6 h-6 ${isUpdating ? 'text-purple-300 animate-pulse' : 'text-zinc-500'}`} />
        </div>
        
        <div className="flex-grow flex flex-col">
           {/* 4. Header Typography (Monospace, Tracking) */}
           <div className="flex justify-between items-baseline mb-3 border-b border-white/5 pb-2">
             <div className="flex items-center gap-2">
                <Cpu className="w-3 h-3 text-purple-500" />
                <span className="text-[10px] font-bold text-purple-400 tracking-[0.2em] uppercase">
                    BIOSTREAM AI
                </span>
             </div>
             <span className="text-[9px] text-zinc-600 font-mono tracking-widest">V.2.0.4</span>
           </div>

           {/* 5. Main Content Area */}
           <div className="min-h-[60px] flex items-center">
             {analysis ? (
               <p className="text-sm md:text-base text-zinc-200 font-light leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-500">
                 {/* Typewriter-style font for the analysis */}
                 <span className="font-mono text-purple-200 mr-2">{">"}</span>
                 {analysis}
                 <span className="animate-pulse ml-1 inline-block w-1.5 h-4 bg-purple-500 align-middle"></span>
               </p>
             ) : (
               <div className="flex items-center gap-3 text-zinc-500">
                 <Activity className="w-4 h-4 animate-spin-slow" />
                 <span className="text-[10px] font-mono tracking-widest uppercase animate-pulse">
                   BIOSTREAM AI ANALYZING....
                 </span>
               </div>
             )}
           </div>
        </div>
      </div>
      
      {/* 6. Tech Corners (Replaces simple borders) */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-purple-500/50"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-purple-500/50"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-purple-500/50"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-purple-500/50"></div>
    </div>
  );
};

export default AIDiagnostics;