import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Globe, AtSign, Play, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-black/80 backdrop-blur-xl border-t border-amber-border/50 text-amber-white mt-auto z-50">
      
      {/* Top Section: Grid Layout */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* 1. Project Identity */}
        <div className="flex flex-col gap-4">
          <div className="font-mono text-2xl font-bold tracking-[4px] text-amber-cyan uppercase flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-cyan animate-pulse"></div>
            AMBER
          </div>
          <p className="font-mono text-[10px] text-amber-green tracking-widest uppercase">
            AI-Driven Milk Bio-Purity Evaluation Resource
          </p>
          <p className="text-sm text-amber-muted leading-relaxed mt-2">
            Fast, portable, and real-time milk adulteration detection using AI and microscopic imaging workflows.
          </p>
        </div>

        {/* 2. Quick Links */}
        <div className="flex flex-col gap-3">
          <h3 className="font-mono text-sm tracking-widest text-white uppercase mb-2">Platform Navigation</h3>
          <Link to="/" className="text-sm text-amber-muted hover:text-amber-cyan transition-colors flex items-center gap-2 group">
            <span className="w-1 h-1 bg-amber-border group-hover:bg-amber-cyan rounded-full transition-colors"></span> Home
          </Link>
          <a href="/#features" className="text-sm text-amber-muted hover:text-amber-cyan transition-colors flex items-center gap-2 group">
            <span className="w-1 h-1 bg-amber-border group-hover:bg-amber-cyan rounded-full transition-colors"></span> Features
          </a>
          <a href="/#pipeline" className="text-sm text-amber-muted hover:text-amber-cyan transition-colors flex items-center gap-2 group">
            <span className="w-1 h-1 bg-amber-border group-hover:bg-amber-cyan rounded-full transition-colors"></span> How It Works
          </a>
          <Link to="/live" className="text-sm text-amber-cyan hover:text-white transition-colors flex items-center gap-2 group font-mono font-bold tracking-wide">
            <Play size={12} className="text-amber-cyan group-hover:text-white transition-colors" /> Run Edge Demo
          </Link>
        </div>

        {/* 3. System / Tech Stack */}
        <div className="flex flex-col gap-3">
          <h3 className="font-mono text-sm tracking-widest text-white uppercase mb-2">Technology Stack</h3>
          <ul className="space-y-1.5 font-mono text-xs text-amber-muted">
            <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-amber-border" /> Python 3.10</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-amber-border" /> TensorFlow / Keras</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-amber-border" /> OpenCV Pipeline</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-amber-border" /> React & Vite Edge UI</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-amber-border" /> Digital Microscope Integration</li>
          </ul>
        </div>

        {/* 4 & 5. Team Details & Contact */}
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="font-mono text-sm tracking-widest text-white uppercase mb-2">Core Engineering Team</h3>
            <ul className="space-y-1 text-sm text-amber-muted">
              <li><strong className="text-amber-white font-medium">Nithin R Poojary</strong></li>
              <li>Vikas Pawar</li>
              <li>Rahul Vasnt Gunaga</li>
              <li>Mahendra Kummar P</li>
            </ul>
             <p className="font-mono text-[10px] tracking-widest text-amber-green uppercase mt-3 py-1 px-2 border border-amber-green/30 rounded inline-block bg-amber-green/5">
                Developed at REVA University
             </p>
          </div>

          <div className="flex items-center gap-4 mt-2">
            <a href="mailto:project-amber@reva.edu.in" className="text-amber-muted hover:text-amber-cyan transition-colors" title="Email Team">
               <Mail size={18} />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-amber-muted hover:text-white transition-colors" title="GitHub Repository">
               <Globe size={18} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-amber-muted hover:text-amber-cyan transition-colors" title="LinkedIn">
               <AtSign size={18} />
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Legal Bar */}
      <div className="w-full border-t border-amber-border/30 bg-black/40 py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-amber-muted tracking-wide">
          <p>© {new Date().getFullYear()} AMBER Project. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[10px] uppercase">
             <span>Academic Project – REVA University</span>
             <span className="hidden md:inline">|</span>
             <span className="text-amber-border/70">Warning: This system is developed for research and educational purposes.</span>
          </div>
        </div>
      </div>
      
    </footer>
  );
}
