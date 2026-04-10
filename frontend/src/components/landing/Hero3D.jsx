import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Hero3D() {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
      
      {/* Hero Content Overlay */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl pt-16 xl:pt-0">
        <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.6 }}
           className="inline-flex items-center px-4 py-1.5 rounded-full border border-blue-200 bg-white/80 backdrop-blur-md text-amber-cyan font-sans font-semibold text-xs tracking-wide mb-8 shadow-sm"
        >
           <span className="w-2 h-2 rounded-full bg-amber-green animate-pulse mr-2"></span>
           SYSTEM 1.0 ONLINE
        </motion.div>
        
        <motion.h1 
           initial={{ opacity: 0, y: 15 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.1 }}
           className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight md:leading-tight mb-6 text-amber-primary"
        >
          Test If Your Milk <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
            Is Pure In 2 Seconds
          </span>
        </motion.h1>
        
        <motion.p 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.6, delay: 0.2 }}
           className="font-sans font-medium text-amber-muted text-base md:text-lg max-w-xl mb-10 leading-relaxed"
        >
          Advanced computer vision and neural microscopic analysis. 
          Instantly detect adulteration, bacterial pathogens, and chemical contaminants without laboratory wait times.
        </motion.p>
        
        <motion.div 
           initial={{ opacity: 0, y: 15 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.3 }}
           className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link to="/live" className="px-8 py-3.5 bg-amber-cyan hover:opacity-90 text-white font-sans font-semibold rounded-lg transition-all shadow-md hover:shadow-lg text-center">
            Start Live Scan
          </Link>
          <a href="#pipeline" className="px-8 py-3.5 bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-amber-primary font-sans font-semibold rounded-lg transition-all text-center">
            View Methodology
          </a>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="font-sans font-semibold text-[10px] text-gray-400 tracking-widest uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-gray-300 to-transparent"></div>
      </motion.div>
      
    </section>
  );
}
