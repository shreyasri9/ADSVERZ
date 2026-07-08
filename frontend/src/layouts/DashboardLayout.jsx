import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Megaphone, Monitor, LifeBuoy, User as UserIcon, 
  LogOut, ShieldAlert, Settings, Menu, X, ArrowLeft
} from 'lucide-react';
import { Logo } from '../components/Logo';

export const DashboardLayout = ({ children, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Define sidebar links based on role
  const getSidebarLinks = () => {
    if (!user) return [];
    
    switch (user.role) {
      case 'brand':
        return [
          { label: 'Overview', path: '/brand', icon: LayoutDashboard },
          { label: 'Campaigns', path: '/brand/campaigns', icon: Megaphone },
          { label: 'Support Desk', path: '/brand/support', icon: LifeBuoy },
          { label: 'My Profile', path: '/brand/profile', icon: UserIcon },
        ];
      case 'hospital':
        return [
          { label: 'Overview', path: '/hospital', icon: LayoutDashboard },
          { label: 'Manage Screens', path: '/hospital/screens', icon: Monitor },
          { label: 'Support Desk', path: '/hospital/support', icon: LifeBuoy },
          { label: 'My Profile', path: '/hospital/profile', icon: UserIcon },
        ];
      case 'admin':
        return [
          { label: 'System Overview', path: '/admin', icon: LayoutDashboard },
          { label: 'Campaign Reviews', path: '/admin/campaigns', icon: ShieldAlert },
          { label: 'Hospital Nodes', path: '/admin/hospitals', icon: Monitor },
          { label: 'Support Tickets', path: '/admin/support', icon: LifeBuoy },
          { label: 'My Profile', path: '/admin/profile', icon: UserIcon },
        ];
      default:
        return [];
    }
  };

  const links = getSidebarLinks();

  const renderTitle = (titleText) => {
    const parts = titleText.split(' ');
    if (parts.length <= 1) {
      return <>{titleText}<span className="accent-text">.</span></>;
    }
    return (
      <>
        {parts[0]} <span className="accent-text">{parts.slice(1).join(' ')}.</span>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex grid-bg font-jakarta">
      {/* SIDEBAR FOR DESKTOP */}
      <aside className="hidden lg:flex flex-col w-64 glass border-r border-white/5 bg-black/60 shrink-0 select-none">
        {/* Brand Banner */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <Link to="/">
            <Logo tagline="Console Panel" />
          </Link>
        </div>

        {/* User profile capsule */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3 glass p-3.5 rounded-2xl border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-neon-green/10 flex items-center justify-center text-neon-green font-bold text-sm uppercase shrink-0 border border-neon-green/20">
              {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="status-pulse shrink-0"></span>
                <h4 className="text-xs font-black truncate text-white">{user?.full_name}</h4>
              </div>
              <p className="text-[8px] font-black uppercase text-slate-500 tracking-wider mt-0.5 truncate">{user?.email}</p>
              <span className="inline-block px-2.5 py-0.5 mt-1.5 text-[7px] font-black uppercase tracking-wider rounded bg-neon-green/20 text-neon-green border border-neon-green/10">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-grow p-6 space-y-2.5">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                  isActive 
                    ? 'accent-bg text-black shadow-lg shadow-neon-green/25 scale-[1.02]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Exit footer */}
        <div className="p-6 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={16} />
            Logout Session
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER & DRAWER */}
      <div className="flex-grow flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between px-6 py-5 bg-black/35 border-b border-white/5">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="text-white hover:text-neon-green transition"
          >
            <Menu size={24} />
          </button>
          
          <span className="text-xs font-black uppercase tracking-widest text-slate-300">
            {title || 'Adsverz Board'}
          </span>
          
          <Logo showText={false} />
        </header>

        {/* Mobile Sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-[110] flex lg:hidden">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            ></div>
            
            {/* Sidebar content */}
            <div className="relative flex flex-col w-64 max-w-xs bg-bg-dark border-r border-white/10 h-full p-6">
              <button 
                onClick={() => setSidebarOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>

              <div className="mb-8 mt-2">
                <Link to="/" onClick={() => setSidebarOpen(false)}>
                  <Logo tagline="Console Mobile" />
                </Link>
              </div>

              <div className="flex-grow space-y-2">
                {links.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                        isActive 
                          ? 'accent-bg text-black' 
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon size={14} />
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <div className="border-t border-white/5 pt-4">
                <button
                  onClick={() => { setSidebarOpen(false); handleLogout(); }}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
                >
                  <LogOut size={14} />
                  Logout Session
                </button>
              </div>
            </div>
          </div>
        )}

        {/* INNER CONTENT SCROLL CONTAINER */}
        <main className="flex-grow overflow-y-auto p-6 md:p-10 max-w-7xl w-full mx-auto">
          {/* Back button option if needed */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter font-outfit italic">
                {renderTitle(title)}
              </h1>
              <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mt-1.5">
                Adsverz Management Suite v1.0
              </p>
            </div>
            
            <Link 
              to="/" 
              className="hidden md:flex items-center gap-2 text-xs font-black text-slate-500 hover:text-white uppercase tracking-widest transition flex items-center gap-2"
            >
              <ArrowLeft size={14} className="accent-text" />
              Exit Console
            </Link>
          </div>

          <div className="mt-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
