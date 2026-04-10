import { motion } from 'framer-motion';
import { Tractor, MapPinHouse, ShieldCheck } from 'lucide-react';

const users = [
  { id: 1, title: 'Farmers', icon: Tractor, desc: 'Instantly check personal output purity before selling to distributors.' },
  { id: 2, title: 'Collection Centers', icon: MapPinHouse, desc: 'Perform bulk rapid tests upon delivery without transporting samples.' },
  { id: 3, title: 'Regulators', icon: ShieldCheck, desc: 'Enforce food safety compliances with high-confidence edge AI auditing.' }
];

export default function TargetUsers() {
  return (
    <section className="w-full py-24 bg-transparent border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="text-center mb-16">
           <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-amber-primary mb-4">Target Audience</h2>
           <p className="font-sans font-medium text-amber-muted text-sm uppercase tracking-widest mb-6">Designed directly for the edge</p>
           <div className="w-24 h-1 bg-amber-cyan mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {users.map((user, i) => {
             const Icon = user.icon;
             return (
               <motion.div 
                 key={user.id}
                 whileHover={{ y: -5 }}
                 initial={{ opacity: 0, scale: 0.95 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.5, delay: i * 0.1 }}
                 className="flex flex-col items-center text-center p-8 bg-white border border-gray-100 rounded-2xl hover:border-blue-200 shadow-sm hover:shadow-lg transition-all"
               >
                 <div className="w-16 h-16 rounded-full bg-blue-50 text-amber-cyan flex items-center justify-center mb-6">
                   <Icon size={28} strokeWidth={2} />
                 </div>
                 <h3 className="font-sans text-xl font-bold text-amber-primary mb-3">{user.title}</h3>
                 <p className="text-sm text-gray-500 font-sans leading-relaxed">{user.desc}</p>
               </motion.div>
             )
           })}
        </div>

      </div>
    </section>
  );
}
