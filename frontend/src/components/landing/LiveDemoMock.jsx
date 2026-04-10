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
    <section className="w-full py-24 bg-white border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* TEXT EXPLANATION */}
        <div>
           <h2 className="font-sans text-3xl md:text-5xl font-extrabold text-amber-primary mb-6">Inference <br/><span className="text-amber-cyan">Speed Demo</span></h2>
           <p className="font-sans text-gray-500 font-medium leading-relaxed mb-6">
             See exactly how fast the Deep Learning model infers purity in the real world. AMBER processes edge-hardware captures entirely locally, bypassing internet latency.
           </p>
           <ul className="space-y-4 font-sans font-semibold text-xs text-amber-primary tracking-wide">
             <li className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
               <span className={`w-2.5 h-2.5 rounded-full ${step >= 1 ? 'bg-amber-cyan' : 'bg-gray-300'}`}></span>
               <span>01. WEBRTC STREAM (1MS)</span>
             </li>
             <li className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
               <span className={`w-2.5 h-2.5 rounded-full ${step >= 2 ? 'bg-amber-cyan' : 'bg-gray-300'}`}></span>
               <span>02. OPENCV CROPPING & NORM (12MS)</span>
             </li>
             <li className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
               <span className={`w-2.5 h-2.5 rounded-full ${step >= 3 ? 'bg-amber-cyan' : 'bg-gray-300'}`}></span>
               <span>03. TENSORFLOW INFERENCE (450MS)</span>
             </li>
           </ul>
        </div>

        {/* TERMINAL MOCK - clinical light mode terminal */}
        <div className="w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden font-mono text-xs relative h-[420px]">
           {/* Terminal Header */}
           <div className="bg-gray-50 px-4 py-2.5 flex items-center gap-2 border-b border-gray-200">
              <Terminal size={14} className="text-amber-primary" />
              <span className="text-amber-primary font-semibold">prediction_engine.py</span>
           </div>

           {/* Terminal Body */}
           <div className="p-6 text-gray-600 font-medium tracking-wide">
              {logs.map((log, i) => (
                <div key={i} className="mb-2">{log}</div>
              ))}
              
              <AnimatePresence mode="wait">
                {step >= 1 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-amber-primary">
                    <span className="text-amber-cyan font-bold">SYSTEM:</span> Scanning the milk drop...<br/>
                    <span className="text-amber-cyan font-bold">CAMERA:</span> Picture taken safely... DONE.<br/>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <AnimatePresence mode="wait">
                {step >= 2 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-amber-primary">
                    <span className="text-amber-cyan font-bold">AI:</span> Looking closely at the milk...<br/>
                    <span className="text-amber-cyan font-bold">AI:</span> Found traces of added water... DONE.<br/>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <AnimatePresence mode="wait">
                {step >= 3 && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    className="mt-8 mx-auto w-full md:w-3/4 bg-[#FDECEE] border border-[#EA5455]/30 rounded-xl flex flex-col items-center justify-center p-6 text-amber-red shadow-sm"
                  >
                    <ShieldX size={48} className="mb-4" />
                    <span className="text-xl font-bold tracking-widest uppercase">Adulterated</span>
                    <span className="opacity-80 mt-1 font-sans font-semibold text-sm">CONFIDENCE: 92.4%</span>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>

      </div>
    </section>
  );
}
