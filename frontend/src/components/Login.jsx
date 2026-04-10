import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, getUserMe } from '../api';
import { ShieldCheck, UserPlus, LogIn, Activity, FlaskConical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isLogin) {
        // Sign In
        const res = await loginUser(username, password);
        localStorage.setItem('amber_token', res.data.access_token);
        const profile = await getUserMe();
        setUser(profile.data);
        navigate('/');
      } else {
        // Register
        await registerUser(username, email, password);
        const res = await loginUser(username, password);
        localStorage.setItem('amber_token', res.data.access_token);
        const profile = await getUserMe();
        setUser(profile.data);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Authentication Failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen font-sans" style={{ backgroundColor: 'var(--bg-page)' }}>
      
      {/* Left Pane - Branding & Visuals (Hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12" style={{ backgroundColor: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}>
          {/* Animated Background Mesh */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(58,125,255,0.08)_0%,transparent_50%)]"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-[150px] opacity-10 animate-pulse"></div>

          <div className="relative z-10 flex items-center gap-3">
             <div className="w-12 h-12 flex items-center justify-center rounded-xl shadow-sm" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <FlaskConical size={24} className="text-amber-cyan" />
             </div>
             <div>
                <h1 className="text-2xl font-bold tracking-wide font-sans leading-none" style={{ color: 'var(--text-primary)' }}>AMBER</h1>
                <span className="text-[10px] font-sans tracking-widest uppercase inline-block mt-1" style={{ color: 'var(--text-muted)' }}>Milk Bio-Purity Evaluation Center</span>
             </div>
          </div>

          <div className="relative z-10 max-w-lg">
             <h2 className="text-4xl xl:text-5xl font-extrabold mb-6 leading-tight tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Secure the Future of Dairy Analytics.
             </h2>
             <p className="text-lg font-medium leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
                Connect your laboratory to the edge. Instantly process physical slide captures through a locally optimized Convolutional Neural Network.
             </p>
             <div className="flex items-center gap-3 text-amber-green font-sans font-bold text-sm tracking-wide border border-amber-green/30 px-4 py-2.5 rounded-lg max-w-max bg-amber-green/5 shadow-sm">
                <ShieldCheck size={18} /> END-TO-END ENCRYPTION ACTIVE
             </div>
          </div>

          <div className="relative z-10 font-sans font-semibold text-[10px] text-gray-400 uppercase tracking-widest">
             System Architecture v1.0.0 · All operations logged
          </div>
      </div>

      {/* Right Pane - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-md">
          
          <div className="text-center mb-10 lg:hidden">
             <div className="w-16 h-16 bg-white border border-gray-200 flex items-center justify-center rounded-xl shadow-sm mx-auto mb-4">
                <FlaskConical size={28} className="text-amber-cyan" />
             </div>
             <h1 className="text-3xl font-extrabold text-amber-primary tracking-wide mb-1">AMBER</h1>
             <p className="text-[10px] text-gray-500 font-sans font-semibold tracking-widest uppercase">Milk Bio-Purity Evaluation</p>
          </div>

          <div className="mb-10 text-center lg:text-left">
             <h2 className="text-3xl font-extrabold text-amber-primary tracking-tight mb-2">
               {isLogin ? 'Welcome back' : 'Create an account'}
             </h2>
             <p className="text-gray-500 font-medium">
               {isLogin ? 'Please enter your credentials to access your dashboard.' : 'Register a new laboratory edge node.'}
             </p>
          </div>
          
          <AnimatePresence mode="popLayout">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#FDECEE] border border-[#EA5455]/50 text-amber-red p-4 rounded-xl mb-6 text-sm font-medium flex gap-3 shadow-sm"
              >
                <Activity size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
               <label className="block font-sans font-bold text-xs text-gray-500 tracking-wider uppercase mb-2 ml-1">Username Identifier</label>
               <input 
                 className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-amber-primary focus:bg-white focus:border-amber-cyan focus:ring-2 focus:ring-amber-cyan/20 transition-all outline-none font-medium"
                 type="text" 
                 placeholder="e.g. lab_tech_01" 
                 value={username} 
                 onChange={e => setUsername(e.target.value)} 
                 required 
               />
            </div>
            
            <AnimatePresence>
              {!isLogin && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }} 
                  className="overflow-hidden"
                >
                  <label className="block font-sans font-bold text-xs text-gray-500 tracking-wider uppercase mb-2 ml-1 mt-2">Primary Email</label>
                  <input 
                    className="w-full rounded-xl p-4 font-medium outline-none transition-all"
                    style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                    type="email" 
                    placeholder="email@laboratory.com" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required={!isLogin}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
               <label className="block font-sans font-bold text-xs text-gray-500 tracking-wider uppercase mb-2 ml-1 mt-2">Secure Passcode</label>
               <input 
                 className="w-full rounded-xl p-4 font-medium outline-none transition-all"
                 style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                 type="password" 
                 placeholder="••••••••" 
                 value={password} 
                 onChange={e => setPassword(e.target.value)} 
                 required 
               />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full bg-amber-cyan hover:opacity-90 text-white font-sans font-bold tracking-wide rounded-xl px-5 py-4 mt-4 transition-all duration-200 outline-none flex justify-center items-center gap-3 shadow-md hover:shadow-lg ${loading ? 'opacity-70 cursor-wait' : 'hover:-translate-y-0.5'}`}
            >
              {loading ? (
                 <span className="flex items-center gap-2"><Activity size={18} className="animate-spin" /> ESTABLISHING LINK...</span>
              ) : (
                 <>
                   {isLogin ? <LogIn size={18}/> : <UserPlus size={18}/>}
                   {isLogin ? 'Authenticate Session' : 'Register Node'}
                 </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm font-sans font-medium text-gray-500">
            {isLogin ? "Don't have a registered node? " : "Already established a node? "}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(null); }} 
              className="text-amber-cyan hover:text-blue-600 font-bold transition-colors hover:underline"
            >
              {isLogin ? "Create an account" : "Sign in to terminal"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
