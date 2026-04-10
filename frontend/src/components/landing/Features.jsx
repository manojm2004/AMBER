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
    <section className="w-full py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="text-center mb-16">
           <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-amber-primary mb-4">Core Features</h2>
           <div className="w-24 h-1 bg-amber-cyan mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {featureList.map((feat, i) => {
             const Icon = feat.icon;
             return (
               <motion.div 
                 key={feat.id}
                 initial={{ opacity: 0, y: 15 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-50px" }}
                 transition={{ duration: 0.5, delay: i * 0.1 }}
                 className="group bg-white border border-gray-200 p-8 rounded-2xl hover:border-blue-200 shadow-sm hover:shadow-md transition-all"
               >
                 <div className="w-12 h-12 bg-blue-50 text-amber-cyan rounded-lg flex items-center justify-center mb-6 group-hover:bg-amber-cyan group-hover:text-white transition-colors">
                   <Icon size={24} />
                 </div>
                 <h3 className="font-sans font-bold text-lg text-amber-primary mb-2">{feat.title}</h3>
                 <p className="font-sans text-gray-500 font-medium text-sm leading-relaxed">{feat.desc}</p>
               </motion.div>
             )
           })}
        </div>

      </div>
    </section>
  );
}
