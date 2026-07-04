import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Navbar } from '../components/Navbar';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect target after login
  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      
      // Determine target path
      let targetPath = '/';
      if (from) {
        targetPath = from;
      } else {
        if (loggedUser.role === 'admin') targetPath = '/admin';
        else if (loggedUser.role === 'brand') targetPath = '/brand';
        else if (loggedUser.role === 'hospital') targetPath = '/hospital';
      }
      
      navigate(targetPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Incorrect email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg-dark text-white min-h-screen flex flex-col justify-between grid-bg">
      <Navbar />

      <div className="flex-grow flex items-center justify-center px-6 pt-32 pb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md glass p-10 rounded-[2.5rem] border-white/5 relative"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black uppercase tracking-tight font-outfit">
              Console <span className="accent-text">Login</span>
            </h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
              Access the Adsverz Management Dashboard
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold"
            >
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Email Address
              </label>
              <input 
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm focus:border-neon-green focus:outline-none transition"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Password
                </label>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm focus:border-neon-green focus:outline-none transition pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full accent-bg py-4.5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] transition flex items-center justify-center gap-3 shadow-lg shadow-neon-green/10 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Enter Console
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">
            Don't have an account?{' '}
            <Link to="/register" className="accent-text hover:underline">
              Register Here
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Mini footer */}
      <div className="py-8 text-center text-[9px] text-slate-600 font-black uppercase tracking-[0.25em] border-t border-white/5">
        &copy; {new Date().getFullYear()} Adsverz. All rights reserved.
      </div>
    </div>
  );
};
