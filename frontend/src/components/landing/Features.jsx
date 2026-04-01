import { motion } from 'framer-motion';
import { Zap, BrainCircuit, MonitorSmartphone, BadgeDollarSign } from 'lucide-react';

const featureList = [
  { id: 1, title: 'Results in Seconds', desc: 'Find out if the milk is pure instantly.', icon: Zap },
  { id: 2, title: 'Smart AI Software', desc: 'Our computer brain does all the hard work.', icon: BrainCircuit },
  { id: 3, title: 'Works Anywhere', desc: 'Use it right in your village without internet.', icon: MonitorSmartphone },
  { id: 4, title: 'Saves Money', desc: 'No expensive lab machines needed.', icon: BadgeDollarSign }
];

export default function Features() {
  return (
    <section className="w-full py-24 bg-black/20 backdrop-blur-md border-t border-amber-border/30">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="text-center mb-16">
           <h2 className="font-mono text-3xl md:text-4xl font-bold text-amber-white tracking-widest mb-4">CORE FEATURES</h2>
           <div className="w-24 h-1 bg-amber-cyan mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {featureList.map((feat, i) => {
             const Icon = feat.icon;
             return (
               <motion.div 
                 key={feat.id}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-50px" }}
                 transition={{ duration: 0.5, delay: i * 0.15 }}
                 className="group bg-black/40 backdrop-blur-xl border border-amber-border p-8 rounded-xl hover:border-amber-cyan transition-colors"
               >
                 <div className="w-12 h-12 bg-amber-cyan/10 border border-amber-cyan/30 rounded-lg flex items-center justify-center mb-6 group-hover:bg-amber-cyan/20 transition-colors">
                   <Icon size={24} className="text-amber-cyan" />
                 </div>
                 <h3 className="font-mono font-bold text-amber-white tracking-wider mb-2">{feat.title}</h3>
                 <p className="font-sans text-amber-muted text-sm leading-relaxed">{feat.desc}</p>
               </motion.div>
             )
           })}
        </div>

      </div>
    </section>
  );
}
