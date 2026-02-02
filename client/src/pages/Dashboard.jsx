import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Heart, Zap, TrendingUp, TrendingDown, Minus, BrainCircuit, Power, Activity, AlertTriangle, Radio } from 'lucide-react'; 
import Header from '../components/Header';
import VitalsCard from '../components/VitalsCard';
import ECGGraph from '../components/ECGGraph';
import config from '../config';

const socket = io(config.API_URL);

// --- 1. AUDIO ENGINE (UNTOUCHED) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(bpm) {
  if (audioCtx.state !== 'running') return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  const pitch = 360 + (bpm * 5); 
  
  osc.frequency.setValueAtTime(pitch, audioCtx.currentTime);
  osc.type = bpm > 110 ? 'triangle' : 'sine';

  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.2);
}

function Dashboard({ readOnly }) { 
  const [vitals, setVitals] = useState({ hr: 0, spo2: 0 });
  const [ecgData, setEcgData] = useState([]);
  const [status, setStatus] = useState("initializing"); 
  const [diagnosis, setDiagnosis] = useState("ANALYZING...");
  const [trend, setTrend] = useState("stable");
  const [stressScore, setStressScore] = useState(0);
  
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [demoOverride, setDemoOverride] = useState(null); 
  const activeHrRef = useRef(0);

  const initializeAudio = async () => {
    await audioCtx.resume();
    setAudioEnabled(true);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '1') setDemoOverride('normal');   
      if (e.key === '2') setDemoOverride('critical'); 
      if (e.key === '3') setDemoOverride('flatline'); 
      if (e.key === 'Escape') setDemoOverride(null); 
      
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().then(() => setAudioEnabled(true));
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    socket.on('ecg_data', (packet) => {
      let { hr, spo2, value } = packet;

      if (demoOverride === 'normal') { hr = 72; spo2 = 98; value = (Math.random() * 0.5) + 0.5; }
      if (demoOverride === 'critical') { hr = 155; spo2 = 88; value = (Math.random() * 2) - 0.5; }
      if (demoOverride === 'flatline') { hr = 0; spo2 = 0; value = 0; }

      setVitals({ hr, spo2 });
      activeHrRef.current = hr; 

      setEcgData(prev => {
        const newData = [...prev, { time: new Date().toLocaleTimeString(), value }];
        if (newData.length > 50) newData.shift(); 
        return newData;
      });

      let diag = "NO SIGNAL";
      if (hr > 0) {
          if (hr < 60) diag = "SINUS BRADYCARDIA";
          else if (hr <= 100) diag = "NORMAL SINUS RHYTHM";
          else if (hr < 140) diag = "SINUS TACHYCARDIA";
          else diag = "VENTRICULAR TACHYCARDIA";
      }
      setDiagnosis(diag);

      setStressScore(() => {
         if (demoOverride === 'critical') return 95 + Math.floor(Math.random() * 5);
         if (demoOverride === 'normal') return 10 + Math.floor(Math.random() * 5);
         if (demoOverride === 'flatline') return 0;
         let calculatedStress = (hr - 50) * 1.1;
         calculatedStress = Math.max(5, Math.min(100, calculatedStress));
         const jitter = (Math.random() * 4) - 2;
         return Math.floor(calculatedStress + jitter);
      });

      if (hr > config.THRESHOLDS.HR_MAX || spo2 < config.THRESHOLDS.SPO2_MIN) {
        setStatus('critical');
      } else {
        setStatus('normal');
      }
    });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      socket.off('ecg_data');
    };
  }, [demoOverride]); 

  useEffect(() => {
    let timeoutId;
    const beatLoop = () => {
      const bpm = activeHrRef.current; 
      if (bpm > 0) {
        playTone(bpm);
        const delay = 60000 / bpm; 
        timeoutId = setTimeout(beatLoop, delay);
      } else {
        timeoutId = setTimeout(beatLoop, 200);
      }
    };
    beatLoop();
    return () => clearTimeout(timeoutId);
  }, []); 

  // --- UI RENDER STARTS HERE ---
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-6 relative font-mono overflow-hidden flex flex-col selection:bg-cyan-500/30">
      
      {/* BACKGROUND TEXTURE */}
      <div className="absolute inset-0 z-0 opacity-10" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
      
      {/* --- STARTUP OVERLAY --- */}
      {!audioEnabled && (
        <div className="absolute inset-0 z-[999] bg-zinc-950/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-700">
          <div className="relative group">
            <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <button 
              onClick={initializeAudio}
              className="relative px-12 py-6 bg-black border border-cyan-800 hover:border-cyan-400 transition-all duration-300 flex flex-col items-center gap-3 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-cyan-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <Power className="w-8 h-8 text-cyan-500 group-hover:text-cyan-200 transition-colors" />
              <span className="text-xs font-bold tracking-[0.4em] text-cyan-500 group-hover:text-white transition-colors">
                INITIALIZE_SYSTEM
              </span>
            </button>
          </div>
        </div>
      )}

      {/* GOD MODE INDICATOR */}
      {demoOverride && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-[100] mt-4">
          <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/50 px-4 py-1.5 rounded-full backdrop-blur-sm shadow-[0_0_15px_rgba(234,179,8,0.2)]">
            <AlertTriangle className="w-3 h-3 text-yellow-500 animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest text-yellow-500 uppercase">
              SIMULATION OVERRIDE: {demoOverride}
            </span>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full gap-6">
        <Header status={status} vitals={vitals} readOnly={readOnly} />

        <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
          
          {/* LEFT PANEL: VITALS & STRESS */}
          <div className="col-span-1 md:col-span-3 flex flex-col gap-4">
            
            <div className="grid grid-rows-2 gap-4 flex-none">
              <div className="bg-zinc-900/50 border border-zinc-800 p-1 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-1 bg-zinc-500"/>
                <div className="absolute top-0 right-0 w-1 h-1 bg-zinc-500"/>
                <div className="absolute bottom-0 left-0 w-1 h-1 bg-zinc-500"/>
                <div className="absolute bottom-0 right-0 w-1 h-1 bg-zinc-500"/>
                <VitalsCard label="HEART RATE" value={vitals.hr} unit="BPM" icon={Heart} isCritical={vitals.hr > config.THRESHOLDS.HR_MAX} animateBeat={true} />
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 p-1 relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-1 h-1 bg-zinc-500"/>
                 <div className="absolute top-0 right-0 w-1 h-1 bg-zinc-500"/>
                 <div className="absolute bottom-0 left-0 w-1 h-1 bg-zinc-500"/>
                 <div className="absolute bottom-0 right-0 w-1 h-1 bg-zinc-500"/>
                 <VitalsCard label="OXYGEN" value={vitals.spo2} unit="%" icon={Zap} color="text-cyan-400" />
              </div>
            </div>

            {/* STRESS CARD */}
            <div className={`flex-grow border border-zinc-800 bg-black/40 p-6 flex flex-col relative overflow-hidden transition-all duration-500 ${stressScore > 50 ? 'shadow-[0_0_30px_rgba(239,68,68,0.1)] border-red-900/30' : 'hover:border-zinc-700'}`}>
              <div className={`absolute inset-0 opacity-10 transition-colors duration-500 ${stressScore > 50 ? 'bg-red-900' : 'bg-purple-900'}`} 
                   style={{ backgroundImage: 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.05) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.05) 75%, rgba(255,255,255,0.05) 100%)', backgroundSize: '20px 20px' }} />

              <div className="flex items-center justify-between mb-8 z-10">
                <div className="flex items-center gap-2">
                   <BrainCircuit className={`w-4 h-4 ${stressScore > 50 ? 'text-red-500' : 'text-purple-400'}`} />
                   <span className="text-[10px] text-zinc-500 font-bold tracking-[0.2em] uppercase">Stress Index</span>
                </div>
                <Activity className={`w-4 h-4 opacity-50 ${stressScore > 50 ? 'text-red-500 animate-spin-slow' : 'text-purple-400'}`} />
              </div>

              <div className="mt-auto z-10">
                <div className="flex items-baseline gap-1 mb-2">
                   <span className={`text-6xl font-light tracking-tighter transition-all duration-300 tabular-nums ${stressScore > 70 ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'text-white'}`}>
                     {stressScore}
                   </span>
                   <span className="text-sm text-zinc-600 font-bold">%</span>
                </div>
                <div className="flex gap-1 h-2 w-full">
                  {[...Array(10)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`flex-1 rounded-sm transition-all duration-300 ${
                        (stressScore / 10) > i 
                          ? stressScore > 70 ? 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]' : 'bg-purple-500'
                          : 'bg-zinc-800'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div> 

          {/* RIGHT PANEL: ECG GRAPH */}
          <div className="col-span-1 md:col-span-9 flex flex-col relative h-[600px] md:h-auto">
            <div className="absolute inset-0 border border-zinc-800 bg-black rounded-lg overflow-hidden shadow-2xl">
               
               {/* --- HUD OVERLAY LAYER --- */}
               <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-30 p-6 flex flex-col justify-between">
                  
                  {/* TOP HEADER ROW: Separated Left and Right to prevent overlap */}
                  <div className="flex justify-between items-start w-full">
                    
                    {/* LEFT: Diagnosis Text */}
                    <div className="flex flex-col gap-1 max-w-[60%]">
                      <span className="text-[9px] text-zinc-600 font-bold tracking-widest uppercase">
                        AI_DIAGNOSIS
                      </span>
                      <span className={`text-xl md:text-3xl font-bold tracking-wider transition-all duration-300 ${status === 'critical' ? 'text-red-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]' : 'text-cyan-100'}`}>
                        {diagnosis}
                      </span>
                    </div>

                    {/* RIGHT: Status Indicators (Live Feed + Trend) */}
                    <div className="flex flex-col items-end gap-2">
                       {/* Live Feed Badge */}
                       <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900/80 border border-zinc-700 rounded-full backdrop-blur-md">
                          <Radio className={`w-3 h-3 ${status === 'critical' ? 'text-red-500 animate-pulse' : 'text-cyan-500'}`} />
                          <span className={`text-[10px] font-bold tracking-[0.2em] ${status === 'critical' ? 'text-red-400' : 'text-cyan-400'}`}>
                            LIVE_FEED
                          </span>
                       </div>
                       
                       {/* Trend Badge */}
                       <div className={`flex items-center gap-2 px-3 py-1 rounded-full border backdrop-blur-sm ${
                         trend === 'rising' ? 'bg-red-500/10 border-red-500/30' : 
                         trend === 'falling' ? 'bg-emerald-500/10 border-emerald-500/30' : 
                         'bg-zinc-800/50 border-zinc-700'
                       }`}>
                          {trend === 'rising' && <TrendingUp className="w-3 h-3 text-red-500" />}
                          {trend === 'falling' && <TrendingDown className="w-3 h-3 text-emerald-500" />}
                          {trend === 'stable' && <Minus className="w-3 h-3 text-zinc-500" />}
                          <span className={`text-[10px] font-bold tracking-widest ${
                            trend === 'rising' ? 'text-red-400' : 
                            trend === 'falling' ? 'text-emerald-400' : 
                            'text-zinc-400'
                          }`}>
                            {trend === 'rising' ? 'RISING' : trend === 'falling' ? 'STABILIZING' : 'STEADY'}
                          </span>
                       </div>
                    </div>
                  </div>

                  {/* BOTTOM FOOTER ROW */}
                  <div className="flex items-end justify-between text-[10px] text-zinc-600 font-mono tracking-widest border-t border-zinc-800/50 pt-4">
                     <div className="flex gap-6">
                        <span>SPEED: 25mm/s</span>
                        <span>GAIN: 10mm/mV</span>
                        <span className="hidden md:inline">FILTER: 0.5-35Hz</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${audioEnabled ? 'bg-emerald-500' : 'bg-zinc-700'}`} />
                        <span className={audioEnabled ? "text-emerald-500/80" : "text-zinc-600"}>
                          AUDIO: {audioEnabled ? 'ON' : 'OFF'}
                        </span>
                     </div>
                  </div>
               </div>

               {/* --- GRAPH LAYER (Z-10) --- */}
               <div className="absolute inset-0 z-10 opacity-80 mix-blend-screen">
                  <ECGGraph data={ecgData} status={status} />
               </div>

               {/* --- CRT GRID OVERLAY (Z-0) --- */}
               <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
                    style={{ 
                      backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)', 
                      backgroundSize: '40px 40px' 
                    }} 
               />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;