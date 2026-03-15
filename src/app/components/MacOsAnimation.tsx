import React, { useState, useEffect } from "react";

import { motion, AnimatePresence } from "motion/react";

const MacCursor = () => (
  <svg width="20" height="28" viewBox="0 0 12 19" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
    <path d="M1 1V17.5L4.5 13.5H11L1 1Z" fill="black" stroke="white" strokeWidth="1.2" strokeLinejoin="round"/>
  </svg>
);

export function MacOsAnimation() {
  const [phase, setPhase] = useState('IDLE');
  const [charIndex, setCharIndex] = useState(0);

  const segments = [
    { t: "Je vous ", e: false },
    { t: "ecrit", e: true },
    { t: " ce mail pour vous ", e: false },
    { t: "informé", e: true },
    { t: " que je ", e: false },
    { t: "serait", e: true },
    { t: " en retard ", e: false },
    { t: "aujourdui.", e: true },
  ];

  const rawText = segments.map(s => s.t).join('');
  const correctedText = "Je vous écris cet e-mail pour vous informer que je serai en retard aujourd'hui.";

  // Scene 1: Natural Typing
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (phase === 'TYPING') {
      if (charIndex < rawText.length) {
        timeout = setTimeout(() => {
          setCharIndex(c => c + 1);
        }, 20 + Math.random() * 25); // Fast, natural typing speed
      } else {
        timeout = setTimeout(() => setPhase('DETECTING'), 500);
      }
    }
    return () => clearTimeout(timeout);
  }, [phase, charIndex]);

  // Phase Sequencer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    switch (phase) {
      case 'IDLE':
        setCharIndex(0);
        timer = setTimeout(() => setPhase('TYPING'), 800);
        break;
      case 'DETECTING': // Scene 2: Detection fade-in
        timer = setTimeout(() => setPhase('SELECTING'), 1000);
        break;
      case 'SELECTING': // Scene 3: Mouse drag selection
        timer = setTimeout(() => setPhase('SHORTCUT'), 1800);
        break;
      case 'SHORTCUT': // Scene 4: Activation pulse
        timer = setTimeout(() => setPhase('CORRECTING'), 1200);
        break;
      case 'CORRECTING': // Scene 5: Magic transition
        timer = setTimeout(() => setPhase('DONE'), 1500);
        break;
      case 'DONE': // Scene 6: Result final
        timer = setTimeout(() => setPhase('IDLE'), 3500);
        break;
    }
    return () => clearTimeout(timer);
  }, [phase]);

  const shouldZoom = ['TYPING', 'DETECTING', 'SELECTING', 'SHORTCUT', 'CORRECTING'].includes(phase);

  // Render Original text with error squiggles
  const renderTextWithSquiggles = (keyPrefix: string) => {
    let currentIndex = 0;
    return segments.map((seg, i) => {
      const segStart = currentIndex;
      const segEnd = currentIndex + seg.t.length;
      currentIndex = segEnd;
      
      const visibleLength = Math.max(0, Math.min(charIndex - segStart, seg.t.length));
      const visibleText = seg.t.substring(0, visibleLength);

      const showSquiggle = seg.e && ['DETECTING', 'SELECTING', 'SHORTCUT'].includes(phase);

      return (
        <span key={`${keyPrefix}-${i}`} className="relative inline-block whitespace-pre">
          <span>{visibleText}</span>
          {showSquiggle && visibleText === seg.t && (
             <motion.span
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 0.3 }}
               className="absolute left-0 right-0 bottom-0 h-full underline decoration-red-500 decoration-wavy decoration-[1.5px] underline-offset-[3px] text-transparent pointer-events-none"
             >
               {visibleText}
             </motion.span>
          )}
        </span>
      );
    });
  };

  return (
    <div className="w-full rounded-xl overflow-hidden relative flex flex-col aspect-[16/10] lg:aspect-[21/9] ring-1 ring-black/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]">
      {/* macOS Wallpaper */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00] via-[#FF004D] to-[#7000FF] opacity-90 z-0" />
      <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-[#00F0FF] rounded-full mix-blend-screen blur-[60px] opacity-70 z-0" />
      <div className="absolute bottom-[-10%] left-[-20%] w-[400px] h-[400px] bg-[#FFD600] rounded-full mix-blend-screen blur-[80px] opacity-60 z-0" />

      {/* Menu Bar with real Apple SVG */}
      <div className="h-7 w-full bg-black/40 backdrop-blur-md border-b border-white/10 flex items-center px-4 justify-between text-[12px] font-[-apple-system,BlinkMacSystemFont,sans-serif] tracking-normal text-white z-20 shadow-sm relative">
        <div className="flex items-center gap-4">
          <svg viewBox="0 0 30 30" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M25.565,9.785c-0.123,0.077-3.051,1.702-3.051,5.305c0.138,4.109,3.695,5.55,3.756,5.55 c-0.061,0.077-0.537,1.963-1.947,3.94C23.204,26.283,21.962,28,20.076,28c-1.794,0-2.438-1.135-4.508-1.135 c-2.223,0-2.852,1.135-4.554,1.135c-1.886,0-3.22-1.809-4.4-3.496c-1.533-2.208-2.836-5.673-2.882-9 c-0.031-1.763,0.307-3.496,1.165-4.968c1.211-2.055,3.373-3.45,5.734-3.496c1.809-0.061,3.419,1.242,4.523,1.242 c1.058,0,3.036-1.242,5.274-1.242C21.394,7.041,23.97,7.332,25.565,9.785z M15.001,6.688c-0.322-1.61,0.567-3.22,1.395-4.247 c1.058-1.242,2.729-2.085,4.17-2.085c0.092,1.61-0.491,3.189-1.533,4.339C18.098,5.937,16.488,6.872,15.001,6.688z"></path>
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

      {/* Workspace */}
      <div className="relative w-full h-full p-6 overflow-hidden flex flex-col items-center z-10 font-[-apple-system,BlinkMacSystemFont,sans-serif]">
        
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
              
              <div className="relative inline-grid text-left max-w-full">
                
                {/* ORIGINAL TEXT LAYER */}
                <motion.div 
                  className="col-start-1 row-start-1 relative"
                  animate={{ opacity: ['CORRECTING', 'DONE'].includes(phase) ? 0 : 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Text Container */}
                  <span className="relative z-10 whitespace-pre-wrap text-gray-800 block">
                    {renderTextWithSquiggles('base')}
                    {/* Typing Cursor */}
                    {phase === 'TYPING' && (
                       <motion.span
                         animate={{ opacity: [1, 0, 1] }}
                         transition={{ repeat: Infinity, duration: 0.8 }}
                         className="inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[1px] -translate-y-[1px]"
                       />
                    )}

                    {/* Selection Overlay (Progressive Color Change) */}
                    <motion.span
                      className="absolute inset-0 bg-blue-500 text-white rounded-[2px] overflow-hidden pointer-events-none"
                      initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
                      animate={{
                        clipPath: (phase === 'SELECTING' || phase === 'SHORTCUT') ? "inset(0% 0% 0% 0%)" : "inset(0% 100% 0% 0%)",
                        opacity: phase === 'CORRECTING' ? 0 : 1
                      }}
                      transition={{ 
                        clipPath: { duration: 1.1, delay: 0.35, ease: "easeInOut" },
                        opacity: { duration: 0.3 }
                      }}
                    >
                      {renderTextWithSquiggles('overlay')}
                    </motion.span>
                  </span>

                  {/* Scene 3: Mouse cursor for Selection */}
                  <AnimatePresence>
                    {phase === 'SELECTING' && (
                      <motion.div
                        initial={{ left: '50%', top: '40px', opacity: 0 }}
                        animate={{ left: ['50%', '-1%', '100%'], top: ['40px', '5px', '10px'], opacity: [0, 1, 1] }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 1.5, times: [0, 0.25, 1], ease: "easeInOut" }}
                        className="absolute z-40 pointer-events-none drop-shadow-lg"
                      >
                        <MacCursor />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Scene 4: Shortcut Tooltip */}
                  <AnimatePresence>
                    {phase === 'SHORTCUT' && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
                        className="absolute left-1/2 -translate-x-1/2 -bottom-16 bg-black/80 backdrop-blur-xl text-white/90 text-sm font-medium p-3 rounded-xl shadow-2xl flex items-center gap-4 whitespace-nowrap z-50 border border-white/20"
                      >
                        <div className="flex items-center gap-2 opacity-90 pl-1">
                          <span className="text-blue-400 text-xs font-bold">⌃</span>
                          <span className="tracking-wide">Correction IA</span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <motion.span
                            initial={{ y: 0, scale: 1, boxShadow: "0px 3px 0px #a1a1aa" }}
                            animate={{ 
                              y: [0, 3, 0],
                              scale: [1, 0.96, 1],
                              boxShadow: [
                                "0px 3px 0px #a1a1aa", 
                                "0px 0px 0px #a1a1aa", 
                                "0px 3px 0px #a1a1aa"
                              ]
                            }}
                            transition={{ duration: 0.25, delay: 0.5, times: [0, 0.5, 1], ease: "easeInOut" }}
                            className="bg-white text-gray-800 border border-gray-200 rounded-[6px] px-2 py-1 text-[14px] font-sans flex items-center justify-center min-w-[32px] will-change-transform"
                          >
                            ⌃
                          </motion.span>
                          <motion.span
                            initial={{ y: 0, scale: 1, boxShadow: "0px 3px 0px #a1a1aa" }}
                            animate={{ 
                              y: [0, 3, 0],
                              scale: [1, 0.96, 1],
                              boxShadow: [
                                "0px 3px 0px #a1a1aa", 
                                "0px 0px 0px #a1a1aa", 
                                "0px 3px 0px #a1a1aa"
                              ]
                            }}
                            transition={{ duration: 0.25, delay: 0.55, times: [0, 0.5, 1], ease: "easeInOut" }}
                            className="bg-white text-gray-800 border border-gray-200 rounded-[6px] px-3 py-1 text-[13px] font-sans font-semibold tracking-wide flex items-center justify-center min-w-[64px] will-change-transform"
                          >
                            Espace
                          </motion.span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Scene 5: Magic Sweep Effect */}
                  <AnimatePresence>
                    {phase === 'CORRECTING' && (
                      <motion.div
                         initial={{ left: '0%', opacity: 0 }}
                         animate={{ left: '100%', opacity: [0, 1, 1, 0] }}
                         transition={{ duration: 0.8, times: [0, 0.1, 0.8, 1], ease: "easeOut" }}
                         className="absolute top-[-5px] bottom-[-5px] w-[50px] bg-gradient-to-r from-transparent via-blue-200 to-transparent blur-[3px] z-30"
                      />
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* CORRECTED TEXT LAYER */}
                {['CORRECTING', 'DONE'].includes(phase) && (
                  <motion.div 
                    className="col-start-1 row-start-1 relative z-20 text-gray-800 whitespace-pre-wrap"
                    initial={{ opacity: 0, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {correctedText}
                    {/* Final Cursor */}
                    {phase === 'DONE' && (
                       <motion.span
                         animate={{ opacity: [1, 0, 1] }}
                         transition={{ repeat: Infinity, duration: 0.8 }}
                         className="inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[1px] -translate-y-[1px]"
                       />
                    )}
                  </motion.div>
                )}
                
              </div>
              
              <br/><br/>Merci de votre compréhension.
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}