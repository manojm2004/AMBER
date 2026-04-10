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
    <section className="w-full py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-6">
        
        <div className="text-center mb-16">
           <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-amber-primary mb-4">System Architecture</h2>
           <p className="font-sans font-medium text-gray-400 text-sm tracking-wide uppercase mb-6">Fully local edge computing</p>
           <div className="w-24 h-1 bg-amber-cyan mx-auto rounded-full"></div>
        </div>

        <div className="flex flex-col items-center">
            {archSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                 <div key={step.id} className="flex flex-col items-center w-full">
                    {/* Node */}
                    <motion.div 
                       initial={{ opacity: 0, y: 15 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true, margin: "-50px" }}
                       transition={{ duration: 0.6 }}
                       className="w-full md:w-[600px] flex items-center gap-6 p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-blue-200 hover:shadow-md transition-all"
                    >
                       <div className="w-16 h-16 shrink-0 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 text-amber-cyan">
                          <Icon size={24} />
                       </div>
                       <div>
                          <h4 className="font-sans font-bold text-[11px] text-gray-400 tracking-wider mb-1.5 uppercase">PHASE 0{step.id}</h4>
                          <p className="font-sans text-amber-primary font-semibold text-lg">{step.text}</p>
                       </div>
                    </motion.div>
                    
                    {/* Connecting dashed line */}
                    {i < archSteps.length - 1 && (
                      <div className="h-12 w-px border-l-2 border-dashed border-gray-300 relative">
                         <motion.div 
                           className="absolute top-0 -left-[5px] w-2 h-2 rounded-full bg-amber-cyan shadow-sm"
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
