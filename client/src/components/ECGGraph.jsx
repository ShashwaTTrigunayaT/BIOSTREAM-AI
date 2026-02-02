import React from 'react';
import { AreaChart, Area, CartesianGrid, ResponsiveContainer, YAxis } from 'recharts';

const ECGGraph = ({ data, status }) => {
  const strokeColor = status === 'critical' ? "#ef4444" : "#06b6d4"; // Red vs Cyan
  
  return (
    <div className="w-full h-full bg-black border-2 border-zinc-800 relative overflow-hidden flex flex-col group">
      
      {/* 1. Background Medical Grid (CSS Pattern) */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(#3f3f46 1px, transparent 1px), linear-gradient(90deg, #3f3f46 1px, transparent 1px)`, 
             backgroundSize: '20px 20px' 
           }}>
      </div>

      {/* 2. Header / Meta Information */}
      <div className="absolute top-0 left-0 w-full p-3 flex justify-between items-start z-20 pointer-events-none bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex flex-col">
           <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-none ${status === 'critical' ? 'bg-red-500 animate-ping' : 'bg-cyan-500'}`} />
              
           </div>
           
        </div>
        
        <div className="flex items-center gap-1 opacity-50">
            <span className="text-[8px] text-zinc-600 font-mono uppercase border border-zinc-800 px-1">Rec</span>
            <span className="text-[8px] text-zinc-600 font-mono uppercase border border-zinc-800 px-1">Filt</span>
        </div>
      </div>

      {/* 3. The Chart */}
      <div className="flex-grow w-full relative z-10 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorEcg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.9}/>
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            {/* Minimal Grid Lines */}
            <CartesianGrid strokeDasharray="1 1" stroke="#27272a" vertical={false} horizontal={true} />
            
            {/* The Waveform */}
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={strokeColor} 
              strokeWidth={2}
              fill="none" 
              isAnimationActive={false} 
            />
            
            {/* Shadow duplicate for "Glow" effect */}
             <Area 
              type="monotone" 
              dataKey="value" 
              stroke={strokeColor} 
              strokeWidth={6}
              strokeOpacity={0.1}
              fill="none" 
              isAnimationActive={false} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 4. Brutalist Corner Accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-zinc-600 z-20" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-zinc-600 z-20" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-zinc-600 z-20" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-zinc-600 z-20" />

      {/* 5. Scale Marker (Right Side) */}
      <div className="absolute right-0 top-1/4 bottom-1/4 w-px bg-zinc-800 z-20 flex flex-col justify-between items-center py-4 opacity-50">
         <div className="w-1 h-px bg-zinc-500"></div>
         <div className="w-1 h-px bg-zinc-500"></div>
         <div className="w-1 h-px bg-zinc-500"></div>
      </div>

    </div>
  );
};

export default ECGGraph;