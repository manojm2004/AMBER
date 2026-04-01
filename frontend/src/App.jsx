import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Upload from './components/Upload';
import LiveCapture from './components/LiveCapture';
import Home from './components/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import Profile from './components/Profile';
import { getUserMe } from './api';
import './index.css';

function PrivateLayout({ children, user, setUser }) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleLogout = () => {
    localStorage.removeItem('amber_token');
    setUser(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-bg text-amber-white font-sans">
      <Header user={user} handleLogout={handleLogout} />
      
      <main className={`flex-1 w-full mx-auto flex flex-col ${isHome ? '' : 'max-w-7xl p-4 md:p-6 mt-4'}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('amber_token');
      if (token) {
        try {
          const res = await getUserMe();
          setUser(res.data);
        } catch (e) {
          localStorage.removeItem('amber_token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-amber-bg flex items-center justify-center font-mono text-amber-cyan tracking-widest text-sm">INITIALIZING SESSION...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {!user ? (
          <>
            <Route path="*" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/" element={<PrivateLayout user={user} setUser={setUser}><Home /></PrivateLayout>} />
            <Route path="/live" element={<PrivateLayout user={user} setUser={setUser}><LiveCapture /></PrivateLayout>} />
            <Route path="/upload" element={<PrivateLayout user={user} setUser={setUser}><Upload /></PrivateLayout>} />
            <Route path="/dashboard" element={<PrivateLayout user={user} setUser={setUser}><Dashboard /></PrivateLayout>} />
            <Route path="/profile" element={<PrivateLayout user={user} setUser={setUser}><Profile user={user} /></PrivateLayout>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
