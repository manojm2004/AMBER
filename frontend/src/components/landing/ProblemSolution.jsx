import { motion } from 'framer-motion';
import { ShieldAlert, Fingerprint } from 'lucide-react';

export default function ProblemSolution() {
  return (
    <section className="w-full py-24 bg-black/10 backdrop-blur-md border-t border-amber-border/30">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="text-center mb-16">
           <h2 className="font-mono text-3xl md:text-5xl font-bold text-amber-white tracking-widest mb-4">THE PARADIGM SHIFT</h2>
           <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-amber-green mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full">
           
           {/* TRADITIONAL */}
           <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col p-10 bg-red-900/10 border border-red-500/30 rounded-2xl relative overflow-hidden"
           >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <ShieldAlert size={120} className="text-red-500" />
              </div>
              
              <h3 className="font-mono text-2xl font-bold text-red-500 tracking-widest mb-8 border-b border-red-500/30 pb-4">TRADITIONAL TESTING</h3>
              
              <ul className="space-y-6 z-10 font-sans text-amber-muted">
                 <li className="flex gap-4">
                   <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-2"></div>
                   <p>Requires massive, centralized wet-laboratories delaying results by days.</p>
                 </li>
                 <li className="flex gap-4">
                   <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-2"></div>
                   <p>Prohibitively expensive machinery limits usage at rural dairy farms.</p>
                 </li>
                 <li className="flex gap-4">
                   <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-2"></div>
                   <p>Manual human analysis introduces subjective error and bias.</p>
                 </li>
              </ul>
           </motion.div>

           {/* AMBER */}
           <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col p-10 bg-amber-green/5 border border-amber-green/30 rounded-2xl relative overflow-hidden shadow-[0_0_40px_rgba(0,230,118,0.05)]"
           >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Fingerprint size={120} className="text-amber-green" />
              </div>
              
              <h3 className="font-mono text-2xl font-bold text-amber-green tracking-widest mb-8 border-b border-amber-green/30 pb-4">AMBER AI SYSTEM</h3>
              
              <ul className="space-y-6 z-10 font-sans text-amber-white">
                 <li className="flex gap-4">
                   <div className="w-1.5 h-1.5 rounded-full bg-amber-green shrink-0 mt-2 shadow-[0_0_8px_#00e676]"></div>
                   <p><strong className="text-amber-cyan font-mono">INSTANT:</strong> Under 2-second turnaround time per sample using hardware acceleration.</p>
                 </li>
                 <li className="flex gap-4">
                   <div className="w-1.5 h-1.5 rounded-full bg-amber-green shrink-0 mt-2 shadow-[0_0_8px_#00e676]"></div>
                   <p><strong className="text-amber-cyan font-mono">PORTABLE:</strong> Installs directly onto consumer laptops and simple USB digital microscopes.</p>
                 </li>
                 <li className="flex gap-4">
                   <div className="w-1.5 h-1.5 rounded-full bg-amber-green shrink-0 mt-2 shadow-[0_0_8px_#00e676]"></div>
                   <p><strong className="text-amber-cyan font-mono">ACCURATE:</strong> Driven by trained 17M parameter Convolutional Neural Network.</p>
                 </li>
              </ul>
           </motion.div>

        </div>
      </div>
    </section>
  );
}
