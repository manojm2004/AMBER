import { motion } from 'framer-motion';
import { ShieldAlert, Fingerprint } from 'lucide-react';

export default function ProblemSolution() {
  return (
    <section className="w-full py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="text-center mb-16">
           <h2 className="font-sans text-3xl md:text-5xl font-extrabold text-amber-primary mb-4">The Paradigm Shift</h2>
           <div className="w-24 h-1 bg-gradient-to-r from-red-400 to-green-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full">
           
           {/* TRADITIONAL */}
           <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col p-10 bg-white border border-gray-200 rounded-3xl relative overflow-hidden shadow-sm"
           >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <ShieldAlert size={120} className="text-amber-red" />
              </div>
              
              <h3 className="font-sans text-2xl font-bold text-amber-red tracking-wide mb-8 border-b border-gray-100 pb-4">Traditional Testing</h3>
              
              <ul className="space-y-6 z-10 font-sans text-gray-500 font-medium">
                 <li className="flex gap-4">
                   <div className="w-2 h-2 rounded-full bg-amber-red shrink-0 mt-2"></div>
                   <p>Requires massive, centralized wet-laboratories delaying results by days.</p>
                 </li>
                 <li className="flex gap-4">
                   <div className="w-2 h-2 rounded-full bg-amber-red shrink-0 mt-2"></div>
                   <p>Prohibitively expensive machinery limits usage at rural dairy farms.</p>
                 </li>
                 <li className="flex gap-4">
                   <div className="w-2 h-2 rounded-full bg-amber-red shrink-0 mt-2"></div>
                   <p>Manual human analysis introduces subjective error and bias.</p>
                 </li>
              </ul>
           </motion.div>

           {/* AMBER */}
           <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col p-10 bg-white border border-gray-200 rounded-3xl relative overflow-hidden shadow-md ring-1 ring-amber-green/30"
           >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Fingerprint size={120} className="text-amber-green" />
              </div>
              
              <h3 className="font-sans text-2xl font-bold text-amber-green tracking-wide mb-8 border-b border-gray-100 pb-4">AMBER AI System</h3>
              
              <ul className="space-y-6 z-10 font-sans text-gray-600 font-medium">
                 <li className="flex gap-4">
                   <div className="w-2 h-2 rounded-full bg-amber-green shrink-0 mt-2"></div>
                   <p><strong className="text-amber-primary font-bold">INSTANT:</strong> Under 2-second turnaround time per sample using hardware acceleration.</p>
                 </li>
                 <li className="flex gap-4">
                   <div className="w-2 h-2 rounded-full bg-amber-green shrink-0 mt-2"></div>
                   <p><strong className="text-amber-primary font-bold">PORTABLE:</strong> Installs directly onto consumer laptops and simple USB digital microscopes.</p>
                 </li>
                 <li className="flex gap-4">
                   <div className="w-2 h-2 rounded-full bg-amber-green shrink-0 mt-2"></div>
                   <p><strong className="text-amber-primary font-bold">ACCURATE:</strong> Driven by trained 17M parameter Convolutional Neural Network.</p>
                 </li>
              </ul>
           </motion.div>

        </div>
      </div>
    </section>
  );
}
