import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Activity, ShieldCheck, AlertOctagon, Box, FileText, Share2, Check, Loader, Terminal, Cpu } from 'lucide-react';
import config from '../config';

const Header = ({ status, vitals, readOnly }) => {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // --- LOGIC (UNCHANGED) ---
  const handleDownloadReport = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const response = await axios.post(`${config.API_URL}/api/report`, {
        hr: vitals.hr,
        spo2: vitals.spo2
      });
      downloadFile(response.data.report);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate AI report. Check backend connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadFile = (content) => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Medical_Report_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShare = () => {
    const link = `${window.location.origin}/monitor/patient-8821`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- NEW BRUTAL UI RENDER ---
  return (
    <header className="w-full border-b border-zinc-800 bg-black/90 backdrop-blur-md relative z-50 font-mono select-none">
      
      {/* Decorative Top Line */}
      <div className={`h-1 w-full transition-colors duration-500 ${
        status === 'critical' ? 'bg-red-600 animate-pulse' : 
        status === 'warning' ? 'bg-amber-500' : 'bg-cyan-600'
      }`} />

      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* LEFT: Branding & System ID */}
        <div className="flex items-center gap-4 group cursor-default">
          <div className="relative">
             <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
             <div className="relative bg-zinc-900 border border-zinc-700 p-2 rounded-sm">
                <Activity className="text-cyan-400 w-5 h-5" />
             </div>
          </div>
          
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-[0.2em] text-zinc-100 leading-none">
              BIOSTREAM<span className="text-cyan-500">AI</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-[10px] text-zinc-500 uppercase tracking-wider">System Version 1.1</span>
               {readOnly && (
                 <span className="px-1.5 py-0.5 bg-purple-900/40 border border-purple-500/50 text-purple-400 text-[9px] font-bold uppercase tracking-wide">
                    Viewer Mode
                 </span>
               )}
            </div>
          </div>
        </div>

        {/* RIGHT: Controls & Status */}
        <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-end">
          
          {!readOnly && (
            <div className="flex items-center gap-2 mr-2 md:mr-4 border-r border-zinc-800 pr-4 md:pr-6">
              
              {/* SHARE BUTTON */}
              <button 
                onClick={handleShare}
                className="group relative flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800 transition-all active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-200" />}
                <span className={`text-xs font-bold tracking-wider ${copied ? 'text-emerald-500' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                    {copied ? "LINK COPIED" : "SHARE"}
                </span>
              </button>

              {/* AI REPORT BUTTON */}
              <button 
                onClick={handleDownloadReport}
                disabled={isGenerating}
                className={`relative flex items-center gap-2 px-3 py-1.5 border transition-all active:scale-95 overflow-hidden ${
                  isGenerating 
                    ? "bg-cyan-950/30 border-cyan-800 cursor-wait" 
                    : "bg-zinc-900 border-zinc-800 hover:border-cyan-500/50 hover:bg-zinc-800"
                }`}
              >
                {isGenerating && <div className="absolute inset-0 bg-cyan-400/10 animate-pulse" />}
                {isGenerating ? <Loader className="w-3.5 h-3.5 text-cyan-400 animate-spin" /> : <FileText className="w-3.5 h-3.5 text-cyan-500" />}
                <span className={`text-xs font-bold tracking-wider relative z-10 ${isGenerating ? 'text-cyan-400' : 'text-zinc-400 group-hover:text-cyan-400'}`}>
                   {isGenerating ? "GENERATING..." : "GENERATE REPORT"}
                </span>
              </button>

              {/* 3D VIEW BUTTON */}
              <Link 
                to="/digital-twin"
                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 hover:bg-zinc-800 hover:shadow-[0_0_10px_rgba(168,85,247,0.15)] transition-all active:scale-95 group"
              >
                <Box className="w-3.5 h-3.5 text-cyan-500 group-hover:text-cyan-400 transition-colors" />
                <span className="text-xs font-bold tracking-wider text-zinc-500 group-hover:text-cyan-400 transition-colors">
                   3D VIEW
                </span>
              </Link>

            </div>
          )}

          {/* STATUS INDICATOR (Tactical) */}
          <div className={`flex items-center gap-3 px-4 py-1.5 border-l-4 transition-all duration-300 ${
             status === 'critical' ? 'bg-red-950/30 border-l-red-600' : 
             status === 'warning' ? 'bg-amber-950/30 border-l-amber-500' : 
             'bg-emerald-950/20 border-l-emerald-500'
          }`}>
             <div className="flex flex-col items-end">
                <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest leading-none mb-1">Current Status</span>
                <div className="flex items-center gap-2">
                    {status === 'critical' ? (
                        <AlertOctagon className="w-3.5 h-3.5 text-red-500 animate-ping" /> 
                    ) : (
                        <ShieldCheck className={`w-3.5 h-3.5 ${status === 'warning' ? 'text-amber-500' : 'text-emerald-500'}`} />
                    )}
                    <span className={`text-sm font-bold uppercase tracking-widest leading-none ${
                        status === 'critical' ? 'text-red-500 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]' : 
                        status === 'warning' ? 'text-amber-500' : 
                        'text-emerald-500'
                    }`}>
                        {status === 'critical' ? "CRITICAL_FAILURE" : status === 'warning' ? "UNSTABLE" : "SYSTEM_SECURE"}
                    </span>
                </div>
             </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;