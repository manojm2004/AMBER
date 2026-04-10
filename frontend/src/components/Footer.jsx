import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Globe, AtSign, Play, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-auto z-50">
      
      {/* Top Section: Grid Layout */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* 1. Project Identity */}
        <div className="flex flex-col gap-4">
          <div className="font-sans text-[22px] font-bold text-amber-primary tracking-wide flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-amber-cyan text-white flex items-center justify-center text-xs shadow-sm">
              A
            </div>
            AMBER
          </div>
          <p className="font-sans text-[11px] font-semibold text-amber-cyan tracking-wider uppercase">
            Milk Bio-Purity Evaluation Center
          </p>
          <p className="text-sm text-amber-muted leading-relaxed mt-2 font-medium">
            Fast, portable, and real-time milk adulteration detection using AI and microscopic imaging workflows.
          </p>
        </div>

        {/* 2. Quick Links */}
        <div className="flex flex-col gap-3">
          <h3 className="font-sans text-xs font-bold tracking-widest text-amber-primary uppercase mb-2">Platform Navigation</h3>
          <Link to="/" className="text-sm font-medium text-amber-muted hover:text-amber-cyan transition-colors flex items-center gap-2 group">
            <span className="w-1.5 h-1.5 bg-gray-300 group-hover:bg-amber-cyan rounded-full transition-colors"></span> Home
          </Link>
          <a href="/#features" className="text-sm font-medium text-amber-muted hover:text-amber-cyan transition-colors flex items-center gap-2 group">
            <span className="w-1.5 h-1.5 bg-gray-300 group-hover:bg-amber-cyan rounded-full transition-colors"></span> Features
          </a>
          <a href="/#pipeline" className="text-sm font-medium text-amber-muted hover:text-amber-cyan transition-colors flex items-center gap-2 group">
            <span className="w-1.5 h-1.5 bg-gray-300 group-hover:bg-amber-cyan rounded-full transition-colors"></span> How It Works
          </a>
          <Link to="/live" className="text-sm text-white bg-amber-cyan hover:opacity-90 transition-opacity flex items-center gap-2 py-1.5 px-3 rounded-md shadow-sm w-fit mt-1">
            <Play size={12} className="text-white" /> Run Edge Demo
          </Link>
        </div>

        {/* 3. System / Tech Stack */}
        <div className="flex flex-col gap-3">
          <h3 className="font-sans text-xs font-bold tracking-widest text-amber-primary uppercase mb-2">Technology Stack</h3>
          <ul className="space-y-1.5 font-sans font-medium text-sm text-amber-muted">
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-amber-green" /> Python 3.10</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-amber-green" /> TensorFlow / Keras</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-amber-green" /> OpenCV Pipeline</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-amber-green" /> React & Vite Edge UI</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-amber-green" /> Digital Microscope Integration</li>
          </ul>
        </div>
        
        {/* 4. Team Details */}
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="font-sans text-xs font-bold tracking-widest text-amber-primary uppercase mb-2">Core Engineering Team</h3>
            <ul className="space-y-1 text-sm font-medium text-amber-muted">
              <li><strong className="text-amber-primary">Manoj M</strong> <span className="text-xs text-gray-400">(Project Leader)</span></li>
              <li>Naveen Patil</li>
              <li>Sharanu</li>
              <li>Yashawanth B L</li>
            </ul>
             <p className="font-sans text-[10px] font-bold tracking-widest text-[#8B5CF6] uppercase mt-4 py-1.5 px-2 bg-[#F4EFFF] border border-[#8B5CF6]/20 rounded-md inline-block">
                Developed at REVA University
             </p>
          </div>
        </div>

        {/* 5. Contact & Social */}
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="font-sans text-xs font-bold tracking-widest text-amber-primary uppercase mb-4">Contact & Source</h3>
            <div className="flex items-center gap-4">
              <a href="mailto:project-amber@reva.edu.in" className="text-amber-muted hover:text-amber-cyan transition-colors" title="Email Team">
                 <Mail size={18} />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-amber-primary hover:text-amber-cyan transition-colors" title="GitHub Repository">
                 <Globe size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-amber-muted hover:text-amber-cyan transition-colors" title="LinkedIn">
                 <AtSign size={18} />
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Legal Bar */}
      <div className="w-full border-t border-gray-100 bg-gray-50 py-5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-sans font-medium text-amber-muted tracking-wide">
          <p>© {new Date().getFullYear()} AMBER Project. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-[11px] uppercase">
             <span className="text-amber-primary font-bold">Academic Project – REVA University</span>
             <span className="hidden md:inline text-gray-300">|</span>
             <span className="text-amber-red/80 font-bold">Warning: Developed for research & educational purposes.</span>
          </div>
        </div>
      </div>
      
    </footer>
  );
}
