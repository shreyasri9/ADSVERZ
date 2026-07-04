import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Menu, X, LayoutDashboard } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isHome = location.pathname === '/';

  const scrollLink = (id) => {
    if (isHome) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/', { replace: true });
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Governance / Navigation Bar */}
      <div className="hidden xl:flex w-full bg-black border-b border-white/5 px-16 py-3 justify-center gap-14 text-[11px] font-black uppercase tracking-widest text-slate-400">
        <button onClick={() => scrollLink('home')} className="hover:text-white transition">Start</button>
        <button onClick={() => scrollLink('ecosystem')} className="hover:text-white transition">Governance</button>
        <button onClick={() => scrollLink('about-us')} className="hover:text-white transition">About Us</button>
        <button onClick={() => scrollLink('nodes')} className="hover:text-white transition">Network</button>
        <button onClick={() => scrollLink('pricing')} className="hover:text-white transition">Rate Card</button>
      </div>

      <nav className="fixed top-0 xl:top-[38px] w-full z-[100] py-4 px-6 md:px-16 flex justify-between items-center glass border-b border-white/5">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition">
          {/* Logo Circle */}
          <div className="w-9 h-9 rounded-lg bg-logo-red flex items-center justify-center font-black text-white text-lg shadow-[0_0_15px_rgba(204,0,0,0.4)]">
            A
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter leading-none font-outfit">
              <span className="red-accent">ADSVERZ</span><span className="accent-text">.</span>
            </span>
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Every business needs a boost
            </span>
          </div>
        </Link>

        {/* Center Links */}
        <div className="hidden xl:flex space-x-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
          <button onClick={() => scrollLink('home')} className="hover:text-white transition">Start</button>
          <button onClick={() => scrollLink('ecosystem')} className="hover:text-white transition">Governance</button>
          <button onClick={() => scrollLink('nodes')} className="hover:text-white transition">Network</button>
          <button onClick={() => scrollLink('pricing')} className="hover:text-white transition">Rate Card</button>
          <button onClick={() => scrollLink('bmc')} className="hover:text-white transition">Strategy</button>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {/* Dashboard Route */}
              <Link 
                to={user.role === 'admin' ? '/admin' : user.role === 'brand' ? '/brand' : '/hospital'}
                className="glass px-6 py-2.5 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-white/5 transition flex items-center gap-2"
              >
                <LayoutDashboard size={13} className="accent-text" />
                Console
              </Link>
              
              <button 
                onClick={handleLogout}
                className="accent-bg px-6 py-2.5 rounded-full font-black text-[11px] uppercase tracking-widest hover:scale-105 transition flex items-center gap-2 shadow-lg shadow-neon-green/10"
              >
                <LogOut size={13} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/register" 
                className="glass px-6 py-2.5 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-white/5 transition"
              >
                Client Register
              </Link>
              <Link 
                to="/login" 
                className="accent-bg px-6 py-2.5 rounded-full font-black text-[11px] uppercase tracking-widest shadow-lg shadow-neon-green/20 hover:scale-105 transition"
              >
                Client Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button 
          className="xl:hidden text-white hover:text-neon-green transition"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[99] bg-bg-dark/95 backdrop-blur-md pt-32 px-8 flex flex-col gap-6 xl:hidden">
          <button onClick={() => scrollLink('home')} className="text-xl font-bold uppercase tracking-wider text-left border-b border-white/5 pb-3">Start</button>
          <button onClick={() => scrollLink('ecosystem')} className="text-xl font-bold uppercase tracking-wider text-left border-b border-white/5 pb-3">Governance</button>
          <button onClick={() => scrollLink('nodes')} className="text-xl font-bold uppercase tracking-wider text-left border-b border-white/5 pb-3">Network</button>
          <button onClick={() => scrollLink('pricing')} className="text-xl font-bold uppercase tracking-wider text-left border-b border-white/5 pb-3">Rate Card</button>
          <button onClick={() => scrollLink('bmc')} className="text-xl font-bold uppercase tracking-wider text-left border-b border-white/5 pb-3">Strategy</button>
          
          <div className="mt-8 flex flex-col gap-4">
            {isAuthenticated ? (
              <>
                <Link 
                  to={user.role === 'admin' ? '/admin' : user.role === 'brand' ? '/brand' : '/hospital'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center glass py-4 rounded-xl font-black uppercase tracking-wider text-sm"
                >
                  Dashboard Console
                </Link>
                <button 
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  className="w-full text-center accent-bg py-4 rounded-xl font-black uppercase tracking-wider text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center glass py-4 rounded-xl font-black uppercase tracking-wider text-sm"
                >
                  Client Register
                </Link>
                <Link 
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center accent-bg py-4 rounded-xl font-black uppercase tracking-wider text-sm"
                >
                  Client Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
