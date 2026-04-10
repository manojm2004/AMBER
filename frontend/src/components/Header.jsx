import { useEffect, useState, useRef } from 'react';
import { getStats } from '../api';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, BarChart2, UploadCloud, Camera, User, Settings, ChevronDown, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function Header({ user, handleLogout }) {
  const [nowStr, setNowStr] = useState('');
  const [totalToday, setTotalToday] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  
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
    <header
      className="px-6 py-4 flex flex-col xl:flex-row items-center justify-between sticky top-0 z-50 gap-4 xl:gap-6"
      style={{
        backgroundColor: isDark ? 'rgba(30, 41, 59, 0.97)' : 'rgba(255,255,255,0.97)',
        borderBottom: `1px solid var(--border)`,
        backdropFilter: 'blur(12px)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Left: Logo */}
      <div className="flex flex-col xl:flex-row items-center shrink-0">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <div className="flex flex-col items-center xl:items-start text-center xl:text-left">
            <div className="font-sans text-[22px] font-bold tracking-wide flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <div className="w-6 h-6 rounded bg-amber-cyan text-white flex items-center justify-center text-xs shadow-sm">
                A
              </div>
              AMBER
            </div>
            <span className="hidden lg:block text-[10px] font-medium tracking-wide uppercase mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Milk Bio-Purity Evaluation Center
            </span>
          </div>
        </Link>
      </div>

      {/* Center: System Status */}
      <div
        className="flex items-center justify-center gap-2 font-sans text-[12px] whitespace-nowrap px-5 py-2 rounded-full shrink-0"
        style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
      >
        <div className="w-2 h-2 rounded-full bg-amber-green animate-pulse shadow-sm"></div>
        <span className="hidden lg:inline font-medium">LIVE &nbsp;·&nbsp; {nowStr} &nbsp;·&nbsp; </span>
        <span className="hidden md:inline font-semibold" style={{ color: 'var(--text-primary)' }}>{totalToday} analyses today</span>
      </div>

      {/* Right: Nav + Theme Toggle + User */}
      <div className="flex flex-col xl:flex-row items-center gap-4 xl:gap-6 shrink-0 relative">
        
        <nav className="flex flex-wrap justify-center items-center gap-1 md:gap-3 font-sans font-medium text-xs tracking-wide">
          <Link to="/live"
            className="px-3 py-2 transition-colors flex items-center gap-2 rounded-md"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-blue)'; e.currentTarget.style.backgroundColor = isDark ? 'rgba(58,125,255,0.1)' : '#EEF4FF'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <Camera size={16}/> Live Feed
          </Link>
          <Link to="/upload"
            className="px-3 py-2 transition-colors flex items-center gap-2 rounded-md"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-blue)'; e.currentTarget.style.backgroundColor = isDark ? 'rgba(58,125,255,0.1)' : '#EEF4FF'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <UploadCloud size={16}/> Upload
          </Link>
          <Link to="/dashboard"
            className="px-3 py-2 transition-colors flex items-center gap-2 rounded-md"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-blue)'; e.currentTarget.style.backgroundColor = isDark ? 'rgba(58,125,255,0.1)' : '#EEF4FF'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <BarChart2 size={16}/> Dashboard
          </Link>
        </nav>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
          }}
        >
          {isDark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-500" />}
        </button>

        <div className="hidden xl:block w-px h-6" style={{ backgroundColor: 'var(--border)' }}></div>

        {/* User Dropdown */}
        <div className="relative" ref={menuRef}>
           <button 
             onClick={() => setMenuOpen(!menuOpen)} 
             className="flex items-center gap-2 p-1.5 rounded-full transition-colors"
             style={{ border: '1px solid transparent' }}
             onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
             onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
           >
              <div className="w-8 h-8 rounded-full bg-amber-cyan border border-blue-400 flex items-center justify-center font-bold text-white text-xs shadow-sm">
                 {user ? getInitials(user.username) : 'U'}
              </div>
              <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} className="mr-1" />
           </button>

           <AnimatePresence>
             {menuOpen && (
               <motion.div 
                 initial={{ opacity: 0, y: 10, scale: 0.95 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 transition={{ duration: 0.15 }}
                 className="absolute right-0 top-12 w-56 rounded-xl shadow-xl py-2 z-50 flex flex-col"
                 style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
               >
                  <div className="px-4 py-3 mb-1" style={{ borderBottom: '1px solid var(--border-light)' }}>
                     <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user?.username || 'Guest'}</p>
                     <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>{user?.email || 'No email provided'}</p>
                  </div>
                  
                  <button onClick={() => { setMenuOpen(false); navigate('/profile'); }}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-left transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                     <User size={16} className="text-amber-cyan" /> Profile Settings
                  </button>

                  {/* Theme toggle in menu too */}
                  <button onClick={toggleTheme}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-left transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                     {isDark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
                     {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  </button>
                  
                  <div className="h-px my-1" style={{ backgroundColor: 'var(--border-light)' }}></div>
                  
                  <button onClick={() => { setMenuOpen(false); handleLogout(); }}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-amber-red hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left w-full"
                  >
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

