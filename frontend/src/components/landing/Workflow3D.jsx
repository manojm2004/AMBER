import { motion } from 'framer-motion';
import { Beaker, Camera, Cpu, Layers, CheckCircle } from 'lucide-react';

const steps = [
  { id: 1, title: 'MILK DROP', icon: Beaker, color: 'text-amber-white', desc: 'Put a drop on glass' },
  { id: 2, title: 'CAMERA', icon: Camera, color: 'text-amber-cyan', desc: 'Look closely at it' },
  { id: 3, title: 'AI CLEANS', icon: Layers, color: 'text-amber-muted', desc: 'Makes picture clear' },
  { id: 4, title: 'AI CHECKS', icon: Cpu, color: 'text-[#b06ef3]', desc: 'Finds bad chemicals' },
  { id: 5, title: 'RESULT', icon: CheckCircle, color: 'text-amber-green', desc: '"PURE" or "FAKE"' }
];

export default function Workflow3D() {
  return (
    <section id="pipeline" className="w-full py-24 bg-transparent backdrop-blur-[2px] border-t border-amber-border/30 relative overflow-hidden">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,212,255,0.03)_0%,transparent_50%)]"></div>
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        <div className="text-center mb-16">
           <h2 className="font-mono text-3xl md:text-4xl font-bold text-amber-white tracking-widest mb-4">INTERACTIVE WORKFLOW</h2>
           <div className="w-24 h-1 bg-gradient-to-r from-amber-cyan to-amber-green mx-auto rounded-full"></div>
        </div>

        {/* Pipeline Container */}
        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-0 mt-20">
          
          {/* Animated connection line (desktop only) */}
          <div className="hidden lg:block absolute top-[40%] left-[10%] right-[10%] h-0.5 bg-amber-border z-0">
             <motion.div 
                className="h-full bg-gradient-to-r from-amber-cyan to-amber-green w-full origin-left"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 2, ease: "easeInOut" }}
             ></motion.div>
          </div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative z-10 flex flex-col items-center group w-full lg:w-48 cursor-default"
              >
                {/* Node */}
                <div className="w-20 h-20 rounded-full bg-amber-surface2 border border-amber-border flex items-center justify-center mb-6 shadow-lg group-hover:border-amber-cyan group-hover:shadow-[0_0_20px_rgba(0,212,255,0.2)] transition-all duration-300 relative">
                   <Icon size={28} className={`${step.color} group-hover:scale-110 transition-transform duration-300`} />
                   
                   {/* Step Number Badge */}
                   <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-surface border border-amber-cyan text-amber-cyan rounded-full flex items-center justify-center font-mono text-[10px] font-bold">
                     0{step.id}
                   </div>
                </div>

                {/* Text & Highlight */}
                <div className="text-center flex flex-col items-center">
                  <h3 className="font-mono text-sm font-bold tracking-widest text-amber-white mb-2 group-hover:text-amber-cyan transition-colors">{step.title}</h3>
                  <p className="font-sans text-[10px] sm:text-xs text-amber-muted">{step.desc}</p>
                  
                  {/* Final step highlight */}
                  {index === steps.length - 1 && (
                     <motion.div 
                       initial={{ opacity: 0, scale: 0.8 }}
                       whileInView={{ opacity: 1, scale: 1 }}
                       transition={{ delay: 1.5 }}
                       className="mt-3 bg-amber-green/10 border border-amber-green px-3 py-1 rounded font-mono text-[10px] sm:text-xs text-amber-green shadow-[0_0_10px_rgba(0,230,118,0.2)]"
                     >
                       PURE 99.9%
                     </motion.div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  );
}
