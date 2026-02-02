import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Zap, Activity, Brain, Volume2, VolumeX, Radio, Cpu, Grip } from 'lucide-react';
import Heart3D from '../components/Heart3D';
import config from '../config';

const socket = io(config.API_URL);

const DigitalTwin = () => {
    const navigate = useNavigate();
    const [vitals, setVitals] = useState({ hr: 0, spo2: 0 });
    const [status, setStatus] = useState("standby");
    const [aiAnalysis, setAiAnalysis] = useState("SYNCHRONIZING BIOSTREAM...");
    const [isAiProcessing, setIsAiProcessing] = useState(false);

    // VOICE STATE
    const [isMuted, setIsMuted] = useState(false);
    const lastAiCheck = useRef(0);
    const lastSpokenRef = useRef("");

    useEffect(() => {
        socket.on('ecg_data', (packet) => {
            setVitals({ hr: packet.hr || 0, spo2: packet.spo2 || 0 });

            // Update Status Color Logic
            if (packet.hr > config.THRESHOLDS.HR_MAX || packet.spo2 < config.THRESHOLDS.SPO2_MIN) {
                setStatus("critical");
            } else {
                setStatus("normal");
            }

            // Smart AI Trigger
            const now = Date.now();
            if (now - lastAiCheck.current > 15000 && packet.hr > 0) {
                if (!window.speechSynthesis.speaking || status === 'critical') {
                    lastAiCheck.current = now;
                    fetchAI(packet.hr, packet.spo2);
                }
            }
        });

        return () => socket.off('ecg_data');
    }, [status]);

    // --- VOICE ENGINE ---
    const speakText = (text) => {
        if (isMuted || !text) return;
        if (text === lastSpokenRef.current) return;

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const systemVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Samantha"));
        if (systemVoice) utterance.voice = systemVoice;

        utterance.rate = 1.0;
        utterance.pitch = 1.05;

        window.speechSynthesis.speak(utterance);
        lastSpokenRef.current = text;
    };

    const fetchAI = async (hr, spo2) => {
        setIsAiProcessing(true);
        try {
            const res = await axios.post(`${config.API_URL}/api/analyze`, { hr, spo2 });
            const analysis = res.data.context;

            setAiAnalysis(analysis);
            speakText(analysis);

        } catch (e) {
            setAiAnalysis("CONNECTION INTERRUPTED. RETRYING...");
        } finally {
            setIsAiProcessing(false);
        }
    };

    // --- UI RENDER STARTS HERE ---
    return (
        <div className="w-screen h-screen bg-zinc-950 relative overflow-hidden flex flex-col items-center justify-center text-zinc-100 font-mono selection:bg-cyan-500/30">

            {/* 1. Background Grid & Vignette */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>
            <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />

            {/* 2. Ambient Status Glow */}
            <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ${status === 'critical' ? 'bg-red-900/20 opacity-100' : 'bg-cyan-900/10 opacity-50'
                }`}></div>

            {/* 3. Top Navigation Bar */}
            <div className="absolute top-0 left-0 w-full p-6 md:p-8 flex justify-between z-50 items-start pointer-events-none">

                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="pointer-events-auto group flex items-center gap-3 bg-black/40 backdrop-blur-sm border border-zinc-800 px-4 py-2 rounded-sm hover:border-cyan-500/50 transition-all"
                >
                    <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
                    <div className="flex flex-col items-start">
                        <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase group-hover:text-cyan-500 transition-colors">Return</span>
                        <span className="text-xs text-zinc-300 font-mono tracking-wider">DASHBOARD</span>
                    </div>
                </button>

                {/* Live Indicator */}
                <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900/80 border border-zinc-800 rounded-full backdrop-blur-md">
                        <Radio className={`w-3 h-3 ${status === 'critical' ? 'text-red-500 animate-pulse' : 'text-cyan-500'}`} />
                        <span className={`text-[10px] font-bold tracking-[0.2em] ${status === 'critical' ? 'text-red-400' : 'text-cyan-400'}`}>
                            LIVE FEED
                        </span>
                    </div>
                    <span className="text-[9px] text-zinc-600 font-mono tracking-widest">LATENCY: 12ms</span>
                </div>
            </div>

            {/* 4. The 3D Heart Container */}
            <div className="w-full h-full absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                {/* Circle Graphic behind heart */}
                <div className="absolute w-[500px] h-[500px] border border-zinc-800/50 rounded-full animate-spin-slow-reverse opacity-20 border-dashed" />
                <div className="absolute w-[400px] h-[400px] border border-zinc-700/30 rounded-full opacity-20" />

                <div className="w-full h-full scale-90 md:scale-100">
                    <Heart3D bpm={vitals.hr} status={status} />
                </div>
            </div>

            {/* 5. Floating Vitals (Left & Right) */}
            <div className="absolute inset-0 pointer-events-none flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-24 z-40">

                {/* Left: Heart Rate */}
                <div className="relative group">
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-zinc-800 group-hover:bg-red-500/50 transition-colors duration-500" />
                    <div className="pl-6 flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                            <Heart className={`w-4 h-4 ${status === 'critical' ? 'text-red-500 animate-ping' : 'text-zinc-500'}`} />
                            <span className="text-[10px] text-zinc-500 font-bold tracking-[0.3em] uppercase">Heart_Rate</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-7xl md:text-8xl font-light tracking-tighter tabular-nums ${status === 'critical' ? 'text-red-500 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'text-zinc-100'}`}>
                                {vitals.hr}
                            </span>
                            <span className="text-sm text-zinc-600 font-bold">BPM</span>
                        </div>
                    </div>
                </div>

                {/* Right: Oxygen */}
                <div className="relative group text-right mt-10 md:mt-0">
                    <div className="absolute -right-4 top-0 bottom-0 w-1 bg-zinc-800 group-hover:bg-cyan-500/50 transition-colors duration-500" />
                    <div className="pr-6 flex flex-col items-end">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] text-zinc-500 font-bold tracking-[0.3em] uppercase">Saturation</span>
                            <Zap className="w-4 h-4 text-cyan-500/70" />
                        </div>
                        <div className="flex items-baseline gap-2 flex-row-reverse">
                            <span className="text-7xl md:text-8xl font-light tracking-tighter tabular-nums text-zinc-100">
                                {vitals.spo2}
                            </span>
                            <span className="text-sm text-zinc-600 font-bold">%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 6. Bottom Console: AI & Audio */}
            <div className="absolute bottom-10 w-full max-w-4xl px-6 z-50">

                {/* Mute Control */}
                <div className="flex justify-end mb-3">
                    <button
                        onClick={() => {
                            // 1. Calculate what the new state will be
                            const nextState = !isMuted;

                            // 2. Update React State
                            setIsMuted(nextState);

                            // 3. FORCE STOP AUDIO if we just muted it
                            if (nextState) {
                                window.speechSynthesis.cancel();
                            }
                        }}
                        className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 bg-black/60 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white transition-all rounded-sm uppercase tracking-widest text-[9px]"
                    >
                        {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-emerald-500" />}
                        <span>{isMuted ? 'MUTED' : 'ACTIVE'}</span>
                    </button>
                </div>

                {/* AI Message Container */}
                <div className="bg-zinc-950/80 backdrop-blur-md border border-zinc-800 p-6 relative overflow-hidden group transition-all duration-500 hover:border-purple-500/30">

                    {/* Scanning Effect */}
                    {isAiProcessing && (
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/10 to-transparent h-[30%] w-full animate-scan-down pointer-events-none z-0" />
                    )}

                    <div className="flex items-start gap-5 relative z-10">
                        {/* AI Icon Box */}
                        <div className={`p-3 rounded-sm border backdrop-blur-sm transition-all duration-300 ${isAiProcessing ? 'bg-purple-500/20 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'bg-zinc-900 border-zinc-800'}`}>
                            <Brain className={`w-6 h-6 ${isAiProcessing ? 'text-purple-300 animate-pulse' : 'text-zinc-500'}`} />
                        </div>

                        <div className="flex-grow">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
                                <div className="flex items-center gap-2">
                                    <Cpu className="w-3 h-3 text-purple-500" />
                                    <span className="text-[10px] font-bold text-purple-400 tracking-[0.2em] uppercase">
                                        BIOSTREAM AI
                                    </span>
                                </div>

                                {/* Voice Status Indicator */}
                                <div className="flex items-center gap-2">
                                    {window.speechSynthesis.speaking && (
                                        <div className="flex gap-0.5 items-end h-3">
                                            <span className="w-0.5 h-full bg-purple-500 animate-[music-bar_0.5s_ease-in-out_infinite]" />
                                            <span className="w-0.5 h-2/3 bg-purple-500 animate-[music-bar_0.4s_ease-in-out_infinite]" />
                                            <span className="w-0.5 h-full bg-purple-500 animate-[music-bar_0.6s_ease-in-out_infinite]" />
                                        </div>
                                    )}
                                    <span className="text-[9px] text-zinc-600 font-mono tracking-wider uppercase">
                                        {window.speechSynthesis.speaking ? 'Speaking' : 'Standby'}
                                    </span>
                                </div>
                            </div>

                            {/* The Text */}
                            <p className="text-base md:text-lg text-zinc-200 font-light tracking-wide leading-relaxed min-h-[60px] font-sans">
                                <span className="font-mono text-purple-500/50 mr-2 text-xs">{">"}</span>
                                {aiAnalysis}
                            </p>
                        </div>
                    </div>

                    {/* Tech Corners */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-purple-500/30"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-purple-500/30"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-purple-500/30"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-purple-500/30"></div>
                </div>
            </div>

        </div>
    );
};

export default DigitalTwin;