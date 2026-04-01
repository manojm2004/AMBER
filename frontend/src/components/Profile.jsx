import React from 'react';
import { User, Mail, Calendar, Key, ShieldCheck, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile({ user }) {
  if (!user) return <div className="text-amber-muted p-10 font-mono">Loading profile data...</div>;

  const creationDate = new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <motion.div 
       initial={{ opacity: 0, scale: 0.98 }}
       animate={{ opacity: 1, scale: 1 }}
       transition={{ duration: 0.4 }}
       className="w-full max-w-4xl mx-auto"
    >
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-amber-border">
          <User size={28} className="text-amber-cyan" />
          <h1 className="text-2xl font-bold tracking-widest font-mono text-amber-white">USER PROFILE</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Avatar & Quick Stats */}
        <div className="md:col-span-1 flex flex-col gap-6">
           <div className="bg-amber-surface border border-amber-border rounded-2xl p-8 flex flex-col items-center shadow-lg">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-cyandim to-amber-surface2 border-4 border-amber-border shadow-inner flex items-center justify-center mb-6">
                 <span className="text-5xl font-bold text-amber-white opacity-80 font-mono">
                    {user.username.substring(0, 2).toUpperCase()}
                 </span>
              </div>
              <h2 className="text-xl font-bold text-amber-white mb-1">{user.username}</h2>
              <p className="text-sm text-amber-muted font-mono bg-amber-surface2 px-3 py-1 rounded-full border border-amber-border/50">Level 1 Operator</p>
           </div>
           
           <div className="bg-amber-surface border border-amber-border rounded-2xl p-6 shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Activity size={100} className="text-amber-green" />
              </div>
              <h3 className="font-mono text-xs tracking-widest text-amber-muted mb-2">SYSTEM STATUS</h3>
              <div className="flex items-center gap-2 text-amber-green font-bold text-sm">
                 <div className="w-2 h-2 rounded-full bg-amber-green shadow-[0_0_8px_#10b981] animate-pulse"></div>
                 ACTIVE SESSION SECURED
              </div>
           </div>
        </div>

        {/* Right Column: Account Details */}
        <div className="md:col-span-2 flex flex-col gap-6">
           <div className="bg-amber-surface border border-amber-border rounded-2xl p-8 shadow-lg">
              <h3 className="font-mono text-sm tracking-widest text-amber-cyan mb-6 pb-2 border-b border-amber-border/50">ACCOUNT METADATA</h3>
              
              <div className="space-y-6">
                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded bg-amber-surface2 border border-amber-border flex items-center justify-center shrink-0">
                       <User size={18} className="text-amber-muted" />
                    </div>
                    <div>
                       <p className="font-mono text-xs text-amber-muted uppercase tracking-widest mb-1">Registered Username</p>
                       <p className="text-amber-white font-medium">{user.username}</p>
                    </div>
                 </div>

                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded bg-amber-surface2 border border-amber-border flex items-center justify-center shrink-0">
                       <Mail size={18} className="text-amber-muted" />
                    </div>
                    <div>
                       <p className="font-mono text-xs text-amber-muted uppercase tracking-widest mb-1">Contact Email</p>
                       <p className="text-amber-white font-medium">{user.email || 'No email provided during registration'}</p>
                    </div>
                 </div>

                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded bg-amber-surface2 border border-amber-border flex items-center justify-center shrink-0">
                       <Calendar size={18} className="text-amber-muted" />
                    </div>
                    <div>
                       <p className="font-mono text-xs text-amber-muted uppercase tracking-widest mb-1">Member Since</p>
                       <p className="text-amber-white font-medium">{creationDate}</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-amber-surface border border-amber-border rounded-2xl p-8 shadow-lg">
              <h3 className="font-mono text-sm tracking-widest text-amber-cyan mb-6 pb-2 border-b border-amber-border/50">SECURITY PREFERENCES</h3>
              
              <div className="space-y-4">
                 <button className="w-full flex items-center justify-between p-4 rounded-xl border border-amber-border bg-amber-bg hover:border-amber-cyan transition-colors group">
                    <div className="flex items-center gap-3">
                       <Key size={18} className="text-amber-muted group-hover:text-amber-cyan transition-colors" />
                       <span className="text-sm font-medium text-amber-white">Change Password</span>
                    </div>
                    <span className="text-xs text-amber-muted font-mono tracking-widest">UPDATE &gt;</span>
                 </button>
                 
                 <button className="w-full flex items-center justify-between p-4 rounded-xl border border-amber-border bg-amber-bg hover:border-amber-cyan transition-colors group">
                    <div className="flex items-center gap-3">
                       <ShieldCheck size={18} className="text-amber-muted group-hover:text-amber-cyan transition-colors" />
                       <span className="text-sm font-medium text-amber-white">Two-Factor Authentication</span>
                    </div>
                    <span className="text-xs text-amber-green bg-amber-green/10 px-2 py-1 rounded font-mono tracking-widest border border-amber-green/30">RECOMMENDED</span>
                 </button>
              </div>
           </div>
        </div>

      </div>
    </motion.div>
  );
}
