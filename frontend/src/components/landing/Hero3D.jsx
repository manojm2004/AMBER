import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Hero3D() {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
      
      {/* Hero Content Overlay */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl pt-16 xl:pt-0">
        <motion.div 
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8 }}
           className="inline-flex items-center px-4 py-1.5 rounded-full border border-amber-cyan/30 bg-black/40 backdrop-blur-md text-amber-cyan font-mono text-xs tracking-widest mb-8 shadow-[0_0_15px_rgba(96,165,250,0.2)]"
        >
           <span className="w-2 h-2 rounded-full bg-amber-green animate-pulse mr-2"></span>
           SYSTEM 1.0 ONLINE
        </motion.div>
        
        <motion.h1 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-loose md:leading-tight mb-6 text-white drop-shadow-2xl"
        >
          Test If Your Milk <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-cyan to-amber-green">
            Is Pure In 2 Seconds
          </span>
        </motion.h1>
        
        <motion.p 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.8, delay: 0.4 }}
           className="font-mono text-amber-muted drop-shadow-lg text-sm md:text-lg tracking-widest max-w-2xl mb-12 leading-relaxed uppercase"
        >
          Test Milk Anywhere. No Lab Required.
        </motion.p>
        
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.6 }}
           className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
        >
          <Link to="/live" className="px-8 py-4 bg-amber-cyan hover:bg-amber-cyandim text-black font-mono font-bold tracking-widest rounded-lg transition-all hover:scale-105 shadow-[0_0_20px_rgba(96,165,250,0.4)] text-center">
            START TESTING
          </Link>
          <a href="#pipeline" className="px-8 py-4 bg-black/40 backdrop-blur-md border border-amber-border hover:border-amber-cyan text-amber-white font-mono tracking-widest rounded-lg transition-all hover:bg-amber-cyan/10 text-center">
            VIEW DEMO
          </a>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="font-mono text-[10px] text-amber-muted tracking-[4px] uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-amber-cyan to-transparent"></div>
      </motion.div>
      
    </section>
  );
}
