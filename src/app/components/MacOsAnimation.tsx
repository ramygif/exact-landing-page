import React, { useState, useEffect } from "react";
import { Apple, Sparkles, CheckCircle, Command } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const MacCursor = () => (
  <svg width="20" height="28" viewBox="0 0 12 19" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
    <path d="M1 1V17.5L4.5 13.5H11L1 1Z" fill="black" stroke="white" strokeWidth="1.2" strokeLinejoin="round"/>
  </svg>
);

export function MacOsAnimation() {
  const [phase, setPhase] = useState('IDLE');
  const [wordCount, setWordCount] = useState(0);

  const originalWords = [
    { t: "Je", e: false },
    { t: " vous", e: false },
    { t: " ecrit", e: true },
    { t: " ce", e: false },
    { t: " mail", e: false },
    { t: " pour", e: false },
    { t: " vous", e: false },
    { t: " informé", e: true },
    { t: " que", e: false },
    { t: " je", e: false },
    { t: " serait", e: true },
    { t: " en", e: false },
    { t: " retard", e: false },
    { t: " aujourdui.", e: true },
  ];

  const correctedText = "Je vous écris cet e-mail pour vous informer que je serai en retard aujourd'hui.";

  // Animation cycle
  useEffect(() => {
    let timer: NodeJS.Timeout;
    switch (phase) {
      case 'IDLE':
        timer = setTimeout(() => {
          setWordCount(0);
          setPhase('TYPING');
        }, 1000);
        break;
      case 'TYPING':
        if (wordCount < originalWords.length) {
          timer = setTimeout(() => setWordCount(prev => prev + 1), 120);
        } else {
          timer = setTimeout(() => setPhase('SELECTING'), 1800);
        }
        break;
      case 'SELECTING':
        timer = setTimeout(() => setPhase('SHORTCUT'), 1100);
        break;
      case 'SHORTCUT':
        timer = setTimeout(() => setPhase('CORRECTED'), 1500);
        break;
      case 'CORRECTED':
        timer = setTimeout(() => setPhase('IDLE'), 3500);
        break;
    }
    return () => clearTimeout(timer);
  }, [phase, wordCount]);

  const isTyping = phase === 'TYPING';
  const isSelected = ['SELECTING', 'SHORTCUT'].includes(phase);
  const showShortcut = phase === 'SHORTCUT';
  const isCorrected = phase === 'CORRECTED';
  const shouldZoom = ['TYPING', 'SELECTING', 'SHORTCUT'].includes(phase);

  return (
    <div className="w-full rounded-xl overflow-hidden relative flex flex-col aspect-[16/10] lg:aspect-[21/9] ring-1 ring-black/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]">
      {/* macOS Wallpaper (Vibrant Sonoma-like Gradient) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00] via-[#FF004D] to-[#7000FF] opacity-90 z-0" />
      <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-[#00F0FF] rounded-full mix-blend-screen blur-[60px] opacity-70 z-0" />
      <div className="absolute bottom-[-10%] left-[-20%] w-[400px] h-[400px] bg-[#FFD600] rounded-full mix-blend-screen blur-[80px] opacity-60 z-0" />

      {/* Fake macOS menu bar - Realistic style */}
      <div className="h-7 w-full bg-black/40 backdrop-blur-md border-b border-white/10 flex items-center px-4 justify-between text-[12px] font-[-apple-system,BlinkMacSystemFont,sans-serif] tracking-normal text-white z-20 shadow-sm relative">
        <div className="flex items-center gap-4">
          <svg viewBox="0 0 384 512" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.3 48.6-.7 90.4-84.3 103.6-115.8-34.6-18.2-54.9-43.9-54.9-84.9zM207.6 11.5c31.3 0 62.7 21.6 76.6 59.4-26.4 1.4-64.8-11.1-84.1-34.6-21.7-26.8-23.9-59.5-21.3-64.8 10-1.2 27.6-2.4 28.8-2.4z"/>
            </svg>
          <span className="font-bold">Mail</span>
          <span className="hidden sm:inline font-medium">Fichier</span>
          <span className="hidden sm:inline font-medium">Édition</span>
          <span className="hidden sm:inline font-medium">Présentation</span>
        </div>
        <div className="flex items-center gap-4 font-medium">
          <div className="relative flex items-center justify-center px-1">
            <span className="font-black tracking-tighter text-[15px] leading-none mb-[2px]">e</span>
          </div>
          <span>100%</span>
          <span>Mar. 14:30</span>
        </div>
      </div>

      {/* Workspace Area */}
      <div className="relative w-full h-full p-6 overflow-hidden flex flex-col items-center z-10 font-[-apple-system,BlinkMacSystemFont,sans-serif]">
        
        {/* Fake App Window */}
        <motion.div 
          animate={{ 
            scale: shouldZoom ? 1.05 : 1,
            y: shouldZoom ? 15 : 0
          }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute top-16 left-0 right-0 mx-auto w-[92%] lg:w-[700px] bottom-8 lg:bottom-12 bg-[#F5F5F7]/95 backdrop-blur-xl rounded-xl shadow-2xl border border-black/10 flex flex-col overflow-hidden opacity-95 z-10"
        >
          <div className="h-12 border-b border-gray-300/50 flex items-center px-4 gap-2 relative bg-white/50">
            <div className="flex gap-2 z-10">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-7 w-1/3 bg-black/5 rounded-md border border-black/5 flex items-center justify-center">
                <span className="text-[11px] text-gray-500 font-medium">Nouveau message</span>
              </div>
            </div>
          </div>
          
          <div className="p-6 flex-1 flex flex-col">
            <div className="text-sm font-medium text-gray-400 mb-2 border-b border-gray-200 pb-2">
              <span className="text-gray-500 w-12 inline-block">À :</span> equipe@entreprise.com
            </div>
            <div className="text-sm font-medium text-gray-400 mb-6 border-b border-gray-200 pb-2">
              <span className="text-gray-500 w-12 inline-block">Objet :</span> Retard ce matin
            </div>
            
            <div className="relative text-[15px] leading-relaxed text-gray-800">
              Bonjour à tous,<br/><br/>
              
              <span className="relative inline-block whitespace-pre-wrap">
                {/* Selection Highlight Background */}
                <motion.div
                  initial={false}
                  animate={{ 
                    width: isSelected ? '100%' : '0%',
                    opacity: isSelected ? 1 : 0
                  }}
                  transition={{ 
                    width: { duration: 0.8, ease: "easeInOut" },
                    opacity: { duration: 0.2 }
                  }}
                  className="absolute top-0 bottom-0 right-0 bg-blue-500 rounded-[2px] -z-0"
                />

                {/* Text Content */}
                <span className={`relative z-10 transition-colors duration-200 ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                  {!isCorrected && originalWords.map((w, i) => (
                    <motion.span 
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: i < wordCount || !isTyping ? 1 : 0 }}
                      className={
                        w.e && !isSelected && wordCount > i 
                          ? "underline decoration-red-500 decoration-wavy decoration-[1.5px] underline-offset-[3px]" 
                          : ""
                      }
                    >
                      {w.t}
                    </motion.span>
                  ))}
                  {isCorrected && (
                     <span>{correctedText}</span>
                  )}
                </span>
                
                {/* Corrected Flash Highlight */}
                {phase === 'CORRECTED' && (
                  <motion.div
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-[-2px] bg-green-200 rounded-[2px] -z-0"
                  />
                )}
                
                {/* Shortcut Tooltip */}
                <AnimatePresence>
                  {showShortcut && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute left-1/2 -translate-x-1/2 -bottom-10 bg-black text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-xl flex items-center gap-1.5 whitespace-nowrap z-20 pointer-events-none"
                    >
                      <Command className="w-3.5 h-3.5" /> 
                      <span className="flex gap-1 items-center">
                        <kbd className="bg-white/20 px-1 rounded text-[10px]">⌃</kbd>
                        <kbd className="bg-white/20 px-1 rounded text-[10px]">Espace</kbd>
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* macOS Cursor for Selection */}
                <AnimatePresence>
                  {phase === 'SELECTING' && (
                    <motion.div
                      initial={{ left: '100%', opacity: 0 }}
                      animate={{ left: '0%', opacity: [0, 1, 1, 0] }}
                      transition={{ 
                        duration: 1, 
                        times: [0, 0.1, 0.9, 1], // Fade in, hold, fade out
                        ease: "easeInOut" 
                      }}
                      className="absolute top-1 z-30 pointer-events-none drop-shadow-md translate-y-[2px]"
                    >
                      <MacCursor />
                    </motion.div>
                  )}
                </AnimatePresence>
              </span>
              
              <br/><br/>Merci de votre compréhension.
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
