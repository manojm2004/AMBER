import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ShieldX } from 'lucide-react';

export default function LiveDemoMock() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev >= 4 ? 0 : prev + 1));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const logs = [
    "> Starting Smart AI System...",
    "> Loading pure milk memory rules...",
    "> Camera connected and ready... OK",
    "> Waiting for you to press scan..."
  ];

  return (
    <section className="w-full py-24 bg-transparent backdrop-blur-sm border-t border-amber-border/30">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* TEXT EXPLANATION */}
        <div>
           <h2 className="font-mono text-3xl md:text-5xl font-bold text-amber-white tracking-widest mb-6">SILICON <br/><span className="text-amber-cyan">SPEED DEMO</span></h2>
           <p className="font-sans text-amber-muted leading-relaxed mb-6">
             See exactly how fast the Deep Learning model infers purity in the real world. AMBER processes edge-hardware captures entirely locally, bypassing internet latency.
           </p>
           <ul className="space-y-4 font-mono text-xs text-amber-white tracking-wider">
             <li className="flex items-center gap-3 bg-black/40 p-3 rounded border border-amber-border">
               <span className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-amber-cyan shadow-[0_0_8px_#00d4ff]' : 'bg-amber-surface'}`}></span>
               <span>01. WEBRTC STREAM (1MS)</span>
             </li>
             <li className="flex items-center gap-3 bg-black/40 p-3 rounded border border-amber-border">
               <span className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-amber-cyan shadow-[0_0_8px_#00d4ff]' : 'bg-amber-surface'}`}></span>
               <span>02. OPENCV CROPPING & NORM (12MS)</span>
             </li>
             <li className="flex items-center gap-3 bg-black/40 p-3 rounded border border-amber-border">
               <span className={`w-2 h-2 rounded-full ${step >= 3 ? 'bg-amber-cyan shadow-[0_0_8px_#00d4ff]' : 'bg-amber-surface'}`}></span>
               <span>03. TENSORFLOW INFERENCE (450MS)</span>
             </li>
           </ul>
        </div>

        {/* TERMINAL MOCK */}
        <div className="w-full bg-black/60 backdrop-blur-md border border-amber-border/50 rounded-lg shadow-2xl overflow-hidden font-mono text-xs relative h-[420px]">
           {/* Terminal Header */}
           <div className="bg-amber-surface2 px-4 py-2 flex items-center gap-2 border-b border-amber-border">
              <Terminal size={12} className="text-amber-muted" />
              <span className="text-amber-muted">prediction_engine.py</span>
           </div>

           {/* Terminal Body */}
           <div className="p-6 text-amber-muted">
              {logs.map((log, i) => (
                <div key={i} className="mb-2">{log}</div>
              ))}
              
              <AnimatePresence mode="wait">
                {step >= 1 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-amber-white">
                    <span className="text-amber-cyan">SYSTEM:</span> Scanning the milk drop...<br/>
                    <span className="text-amber-cyan">CAMERA:</span> Picture taken safely... DONE.<br/>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <AnimatePresence mode="wait">
                {step >= 2 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-amber-white">
                    <span className="text-amber-cyan">AI:</span> Looking closely at the milk...<br/>
                    <span className="text-amber-cyan">AI:</span> Found traces of added water... DONE.<br/>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <AnimatePresence mode="wait">
                {step >= 3 && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    className="mt-8 mx-auto w-full md:w-3/4 bg-red-900/20 border border-red-500/50 rounded flex flex-col items-center justify-center p-6 text-red-500 shadow-[0_0_30px_rgba(255,77,77,0.1)]"
                  >
                    <ShieldX size={48} className="mb-4" />
                    <span className="text-xl font-bold tracking-[4px]">ADULTERATED</span>
                    <span className="opacity-70 mt-1">CONFIDENCE: 92.4%</span>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>

      </div>
    </section>
  );
}
