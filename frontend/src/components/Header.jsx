import { useEffect, useState, useRef } from 'react';
import { getStats } from '../api';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, BarChart2, UploadCloud, Camera, User, Settings, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header({ user, handleLogout }) {
  const [nowStr, setNowStr] = useState('');
  const [totalToday, setTotalToday] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const dayStr = String(now.getDate()).padStart(2, '0');
      const monthStr = now.toLocaleString('default', { month: 'short' });
      const yearStr = now.getFullYear();
      let hours = now.getHours();
      let ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      let minStr = String(now.getMinutes()).padStart(2, '0');
      let secStr = String(now.getSeconds()).padStart(2, '0');
      setNowStr(`${dayStr} ${monthStr} ${yearStr} · ${hours}:${minStr}:${secStr} ${ampm}`);
    };
    
    updateTime();
    const t = setInterval(updateTime, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    getStats().then(res => {
      if (res.data && res.data.total_today !== undefined) {
        setTotalToday(res.data.total_today);
      }
    }).catch(() => {});
  }, []);

  const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : 'U';

  return (
    <header className="border-b border-amber-border bg-[rgba(9,9,11,0.8)] backdrop-blur-md px-6 py-4 flex flex-col xl:flex-row items-center justify-between sticky top-0 z-50 shadow-lg shadow-black/20 gap-4 xl:gap-6">
      
      {/* Left side: Logo */}
      <div className="flex flex-col xl:flex-row items-center shrink-0">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <div className="flex flex-col items-center xl:items-start text-center xl:text-left">
            <div className="font-mono text-[20px] font-bold text-amber-white tracking-[4px] uppercase leading-none flex items-center gap-3">
              AMBER
            </div>
            <span className="hidden lg:block text-[8px] text-amber-cyan font-mono tracking-widest uppercase mt-1.5 opacity-80">
              AI-Driven Milk Bio-Purity Evaluation Resource
            </span>
          </div>
        </Link>
      </div>

      {/* Center: System Status */}
      <div className="flex items-center justify-center gap-2 font-mono text-[12px] text-amber-muted whitespace-nowrap bg-amber-surface px-5 py-2 rounded-full border border-amber-border shrink-0 shadow-inner">
        <div className="w-2 h-2 rounded-full bg-amber-green shadow-[0_0_8px_#10b981] animate-[pulse_2s_ease-in-out_infinite]"></div>
        <span className="hidden lg:inline">LIVE &nbsp;·&nbsp; {nowStr} &nbsp;·&nbsp; </span>
        <span className="hidden md:inline font-bold text-amber-white">{totalToday} captures today</span>
      </div>

      {/* Right side: Navigation + User Profile */}
      <div className="flex flex-col xl:flex-row items-center gap-4 xl:gap-6 shrink-0 relative">
        
        <nav className="flex flex-wrap justify-center items-center gap-1 md:gap-3 font-mono text-xs tracking-wider">
            <Link to="/live" className="text-amber-muted hover:text-amber-white px-3 py-2 transition-colors flex items-center gap-2 rounded hover:bg-amber-surface2">
              <Camera size={14}/> LIVE CAPTURE
            </Link>
            <Link to="/upload" className="text-amber-muted hover:text-amber-white px-3 py-2 transition-colors flex items-center gap-2 rounded hover:bg-amber-surface2">
              <UploadCloud size={14}/> MANUAL UPLOAD
            </Link>
            <Link to="/dashboard" className="text-amber-muted hover:text-amber-white px-3 py-2 transition-colors flex items-center gap-2 rounded hover:bg-amber-surface2">
              <BarChart2 size={14}/> DASHBOARD
            </Link>
        </nav>

        <div className="hidden xl:block w-px h-6 bg-amber-border"></div>

        {/* User Dropdown */}
        <div className="relative" ref={menuRef}>
           <button 
             onClick={() => setMenuOpen(!menuOpen)} 
             className="flex items-center gap-3 hover:bg-amber-surface2 p-1.5 rounded-full transition-colors border border-transparent hover:border-amber-border"
           >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-cyandim to-amber-surface border border-amber-border flex items-center justify-center font-bold text-amber-white text-xs shadow-md">
                 {user ? getInitials(user.username) : 'U'}
              </div>
              <ChevronDown size={14} className="text-amber-muted mr-1" />
           </button>

           <AnimatePresence>
             {menuOpen && (
               <motion.div 
                 initial={{ opacity: 0, y: 10, scale: 0.95 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 transition={{ duration: 0.15 }}
                 className="absolute right-0 top-12 w-56 bg-amber-surface border border-amber-border rounded-xl shadow-2xl py-2 z-50 flex flex-col"
               >
                  <div className="px-4 py-3 border-b border-amber-border mb-1">
                     <p className="text-sm font-bold text-amber-white truncate">{user?.username || 'Guest'}</p>
                     <p className="text-xs text-amber-muted truncate mt-0.5">{user?.email || 'No email provided'}</p>
                  </div>
                  
                  <button onClick={() => { setMenuOpen(false); navigate('/profile'); }} className="flex items-center gap-3 px-4 py-2.5 text-sm text-amber-white hover:bg-amber-surface2 transition-colors font-mono tracking-wide text-left">
                     <User size={16} className="text-amber-cyan" /> Profile Settings
                  </button>
                  <button onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-amber-white hover:bg-amber-surface2 transition-colors font-mono tracking-wide text-left opacity-50 cursor-not-allowed">
                     <Settings size={16} className="text-amber-muted" /> Preferences
                  </button>
                  
                  <div className="h-px bg-amber-border my-1"></div>
                  
                  <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors font-mono tracking-wide text-left w-full">
                     <LogOut size={16} /> Secure Log Out
                  </button>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
        
      </div>
    </header>
  );
}
