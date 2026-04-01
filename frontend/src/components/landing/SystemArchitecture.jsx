import { motion } from 'framer-motion';
import { Database, ImageDown, Zap, FlaskConical, Building2 } from 'lucide-react';

const archSteps = [
  { id: 1, text: "Raw Milk Drop placed on physical glass slide", icon: FlaskConical },
  { id: 2, text: "Digital USB Microscope streams 1080p feed", icon: ImageDown },
  { id: 3, text: "AMBER Python backend crops and normalizes", icon: Zap },
  { id: 4, text: "TensorFlow CNN executes forward pass array", icon: Database },
  { id: 5, text: "React Dashboard renders binary classification", icon: Building2 }
];

export default function SystemArchitecture() {
  return (
    <section className="w-full py-24 bg-black/20 backdrop-blur-md border-t border-amber-border/30">
      <div className="max-w-4xl mx-auto px-6">
        
        <div className="text-center mb-16">
           <h2 className="font-mono text-3xl md:text-5xl font-bold text-amber-white tracking-widest mb-4">SYSTEM ARCHITECTURE</h2>
           <p className="font-mono text-amber-muted text-sm tracking-widest uppercase mb-6">Fully local edge computing</p>
           <div className="w-24 h-1 bg-amber-cyan mx-auto rounded-full"></div>
        </div>

        <div className="flex flex-col items-center">
            {archSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                 <div key={step.id} className="flex flex-col items-center w-full">
                    {/* Node */}
                    <motion.div 
                       initial={{ opacity: 0, y: 30 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true, margin: "-50px" }}
                       transition={{ duration: 0.6 }}
                       className="w-full md:w-[600px] flex items-center gap-6 p-6 bg-black/40 backdrop-blur-lg border border-amber-border rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:border-amber-cyan/50 transition-colors"
                    >
                       <div className="w-16 h-16 shrink-0 rounded-full bg-black/50 flex items-center justify-center border border-amber-cyan/30">
                          <Icon size={24} className="text-amber-cyan" />
                       </div>
                       <div>
                          <h4 className="font-mono text-[10px] text-amber-muted tracking-widest mb-1 uppercase">PHASE 0{step.id}</h4>
                          <p className="font-sans text-amber-white font-medium">{step.text}</p>
                       </div>
                    </motion.div>
                    
                    {/* Connecting dashed line */}
                    {i < archSteps.length - 1 && (
                      <div className="h-12 w-px border-l-2 border-dashed border-amber-border relative">
                         <motion.div 
                           className="absolute top-0 -left-[5px] w-2 h-2 rounded-full bg-amber-cyan shadow-[0_0_8px_#00d4ff]"
                           animate={{ y: [0, 48, 0] }}
                           transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                         />
                      </div>
                    )}
                 </div>
              )
            })}
        </div>

      </div>
    </section>
  );
}
