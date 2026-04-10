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
    <header className="border-b border-gray-200 bg-white/95 backdrop-blur-md px-6 py-4 flex flex-col xl:flex-row items-center justify-between sticky top-0 z-50 shadow-sm gap-4 xl:gap-6">
      
      {/* Left side: Logo */}
      <div className="flex flex-col xl:flex-row items-center shrink-0">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <div className="flex flex-col items-center xl:items-start text-center xl:text-left">
            <div className="font-sans text-[22px] font-bold text-amber-primary tracking-wide flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-amber-cyan text-white flex items-center justify-center text-xs shadow-sm">
                A
              </div>
              AMBER
            </div>
            <span className="hidden lg:block text-[10px] text-amber-muted font-medium tracking-wide uppercase mt-0.5">
              Milk Bio-Purity Evaluation Center
            </span>
          </div>
        </Link>
      </div>

      {/* Center: System Status */}
      <div className="flex items-center justify-center gap-2 font-sans text-[12px] text-amber-muted whitespace-nowrap bg-gray-50 px-5 py-2 rounded-full border border-gray-200 shrink-0 shadow-inner">
        <div className="w-2 h-2 rounded-full bg-amber-green shadow-sm animate-pulse"></div>
        <span className="hidden lg:inline font-medium">LIVE &nbsp;·&nbsp; {nowStr} &nbsp;·&nbsp; </span>
        <span className="hidden md:inline font-semibold text-amber-primary">{totalToday} analyses today</span>
      </div>

      {/* Right side: Navigation + User Profile */}
      <div className="flex flex-col xl:flex-row items-center gap-4 xl:gap-6 shrink-0 relative">
        
        <nav className="flex flex-wrap justify-center items-center gap-1 md:gap-3 font-sans font-medium text-xs tracking-wide">
            <Link to="/live" className="text-amber-muted hover:text-amber-cyan px-3 py-2 transition-colors flex items-center gap-2 rounded-md hover:bg-blue-50">
              <Camera size={16}/> Live Feed
            </Link>
            <Link to="/upload" className="text-amber-muted hover:text-amber-cyan px-3 py-2 transition-colors flex items-center gap-2 rounded-md hover:bg-blue-50">
              <UploadCloud size={16}/> Upload
            </Link>
            <Link to="/dashboard" className="text-amber-muted hover:text-amber-cyan px-3 py-2 transition-colors flex items-center gap-2 rounded-md hover:bg-blue-50">
              <BarChart2 size={16}/> Dashboard
            </Link>
        </nav>

        <div className="hidden xl:block w-px h-6 bg-gray-200"></div>

        {/* User Dropdown */}
        <div className="relative" ref={menuRef}>
           <button 
             onClick={() => setMenuOpen(!menuOpen)} 
             className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded-full transition-colors border border-transparent hover:border-gray-200"
           >
              <div className="w-8 h-8 rounded-full bg-amber-cyan border border-blue-400 flex items-center justify-center font-bold text-white text-xs shadow-sm">
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
                 className="absolute right-0 top-12 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50 flex flex-col"
               >
                  <div className="px-4 py-3 border-b border-gray-100 mb-1">
                     <p className="text-sm font-semibold text-amber-primary truncate">{user?.username || 'Guest'}</p>
                     <p className="text-xs text-amber-muted truncate mt-0.5">{user?.email || 'No email provided'}</p>
                  </div>
                  
                  <button onClick={() => { setMenuOpen(false); navigate('/profile'); }} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-amber-primary hover:bg-gray-50 transition-colors text-left">
                     <User size={16} className="text-amber-cyan" /> Profile Settings
                  </button>
                  <button onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-400 hover:bg-gray-50 transition-colors text-left cursor-not-allowed">
                     <Settings size={16} className="text-gray-300" /> Preferences
                  </button>
                  
                  <div className="h-px bg-gray-100 my-1"></div>
                  
                  <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-amber-red hover:bg-red-50 transition-colors text-left w-full">
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
