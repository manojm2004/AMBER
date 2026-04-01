import { motion } from 'framer-motion';
import { Tractor, MapPinHouse, ShieldCheck } from 'lucide-react';

const users = [
  { id: 1, title: 'Farmers', icon: Tractor, desc: 'Instantly check personal output purity before selling to distributors.' },
  { id: 2, title: 'Collection Centers', icon: MapPinHouse, desc: 'Perform bulk rapid tests upon delivery without transporting samples.' },
  { id: 3, title: 'Regulators', icon: ShieldCheck, desc: 'Enforce food safety compliances with high-confidence edge AI auditing.' }
];

export default function TargetUsers() {
  return (
    <section className="w-full py-24 bg-transparent border-t border-amber-border/30">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="text-center mb-16">
           <h2 className="font-mono text-3xl md:text-5xl font-bold text-amber-white tracking-widest mb-4">TARGET AUDIENCE</h2>
           <p className="font-mono text-amber-muted text-sm tracking-widest uppercase mb-6">Designed directly for the edge</p>
           <div className="w-24 h-1 bg-amber-cyan mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {users.map((user, i) => {
             const Icon = user.icon;
             return (
               <motion.div 
                 key={user.id}
                 whileHover={{ scale: 1.05 }}
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.5, delay: i * 0.1 }}
                 className="flex flex-col items-center text-center p-8 bg-black/40 backdrop-blur-lg border border-amber-border rounded-xl hover:border-amber-cyan/50 shadow-lg"
               >
                 <div className="w-20 h-20 rounded-full bg-black/50 border border-amber-border flex items-center justify-center mb-6">
                   <Icon size={36} className="text-amber-muted" />
                 </div>
                 <h3 className="font-mono text-lg font-bold text-white tracking-widest mb-3">{user.title}</h3>
                 <p className="text-sm text-amber-muted font-sans leading-relaxed">{user.desc}</p>
               </motion.div>
             )
           })}
        </div>

      </div>
    </section>
  );
}
