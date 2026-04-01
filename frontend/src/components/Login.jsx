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
    <div className="flex w-full min-h-screen bg-amber-bg font-sans selection:bg-amber-cyan selection:text-black">
      
      {/* Left Pane - Branding & Visuals (Hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 bg-amber-surface2 relative overflow-hidden flex-col justify-between p-12 border-r border-amber-border">
          {/* Animated Background Mesh */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(96,165,250,0.05)_0%,transparent_50%)]"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-cyan rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-pulse"></div>

          <div className="relative z-10 flex items-center gap-3">
             <div className="w-12 h-12 bg-amber-cyan/10 border border-amber-cyan/30 flex items-center justify-center rounded-xl shadow-[0_0_15px_rgba(96,165,250,0.2)]">
                <FlaskConical size={24} className="text-amber-cyan" />
             </div>
             <div>
                <h1 className="text-2xl font-bold text-amber-white tracking-[4px] font-mono leading-none">AMBER</h1>
                <span className="text-[9px] text-amber-cyan font-mono tracking-widest uppercase inline-block mt-1">AI-Driven Milk Bio-Purity Evaluation Resource</span>
             </div>
          </div>

          <div className="relative z-10 max-w-lg">
             <h2 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight font-sans tracking-tight">
                Secure the Future of Dairy Analytics.
             </h2>
             <p className="text-amber-muted text-lg leading-relaxed mb-8">
                Connect your laboratory to the edge. Instantly process physical slide captures through a locally optimized Convolutional Neural Network.
             </p>
             <div className="flex items-center gap-3 text-amber-green font-mono text-sm tracking-widest border border-amber-green/30 px-4 py-2 rounded max-w-max bg-amber-green/5">
                <ShieldCheck size={18} /> END-TO-END ENCRYPTION ACTIVE
             </div>
          </div>

          <div className="relative z-10 font-mono text-[10px] text-amber-muted uppercase tracking-[3px]">
             System Architecture v1.0.0 · All operations logged
          </div>
      </div>

      {/* Right Pane - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-md">
          
          <div className="text-center mb-10 lg:hidden">
             <FlaskConical size={48} className="text-amber-cyan mx-auto mb-4" />
             <h1 className="text-3xl font-bold text-amber-white tracking-[4px] font-mono mb-1">AMBER</h1>
             <p className="text-[9px] text-amber-muted font-mono tracking-widest uppercase">AI-Driven Milk Bio-Purity Evaluation Resource</p>
          </div>

          <div className="mb-10 text-center lg:text-left">
             <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
               {isLogin ? 'Welcome back' : 'Create an account'}
             </h2>
             <p className="text-amber-muted">
               {isLogin ? 'Please enter your credentials to access your terminal.' : 'Register a new laboratory edge node.'}
             </p>
          </div>
          
          <AnimatePresence mode="popLayout">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6 text-sm flex gap-3 shadow-lg"
              >
                <Activity size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
               <label className="block font-mono text-xs text-amber-muted tracking-widest uppercase mb-2 ml-1">Username Identifier</label>
               <input 
                 className="w-full bg-amber-surface border border-amber-border rounded-xl p-4 text-amber-white focus:border-amber-cyan focus:ring-1 focus:ring-amber-cyan transition-colors outline-none shadow-inner"
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
                  <label className="block font-mono text-xs text-amber-muted tracking-widest uppercase mb-2 ml-1 mt-2">Primary Email</label>
                  <input 
                    className="w-full bg-amber-surface border border-amber-border rounded-xl p-4 text-amber-white focus:border-amber-cyan focus:ring-1 focus:ring-amber-cyan transition-colors outline-none shadow-inner"
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
               <label className="block font-mono text-xs text-amber-muted tracking-widest uppercase mb-2 ml-1 mt-2">Secure Passcode</label>
               <input 
                 className="w-full bg-amber-surface border border-amber-border rounded-xl p-4 text-amber-white focus:border-amber-cyan focus:ring-1 focus:ring-amber-cyan transition-colors outline-none shadow-inner"
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
              className={`w-full bg-amber-cyan hover:bg-amber-cyandim text-white font-mono font-bold tracking-widest rounded-xl px-5 py-4 mt-4 transition-all duration-200 outline-none flex justify-center items-center gap-3 shadow-[0_0_15px_rgba(96,165,250,0.3)] ${loading ? 'opacity-70 cursor-wait' : 'hover:-translate-y-0.5'}`}
            >
              {loading ? (
                 <span className="flex items-center gap-2"><Activity size={18} className="animate-spin" /> ESTABLISHING LINK...</span>
              ) : (
                 <>
                   {isLogin ? <LogIn size={18}/> : <UserPlus size={18}/>}
                   {isLogin ? 'AUTHENTICATE SESSION' : 'REGISTER NODE'}
                 </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm font-sans text-amber-muted">
            {isLogin ? "Don't have a registered node? " : "Already established a node? "}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(null); }} 
              className="text-amber-cyan hover:text-white font-medium transition-colors hover:underline"
            >
              {isLogin ? "Create an account" : "Sign in to terminal"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
