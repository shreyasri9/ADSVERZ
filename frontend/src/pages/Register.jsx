import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, ArrowRight, User as UserIcon, Building2 } from 'lucide-react';
import { Navbar } from '../components/Navbar';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Default role from search query
  const defaultRole = searchParams.get('role') === 'hospital' ? 'hospital' : 'brand';

  const [role, setRole] = useState(defaultRole); // 'brand' or 'hospital'
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  
  // Role specific
  const [companyName, setCompanyName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !fullName || !password) {
      setError('Please fill in all core fields.');
      return;
    }

    if (role === 'brand' && !companyName) {
      setError('Company name is required for Brand registration.');
      return;
    }

    if (role === 'hospital' && !hospitalName) {
      setError('Hospital/Campus name is required for Hospital registration.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        email,
        full_name: fullName,
        password,
        role,
        company_name: role === 'brand' ? companyName : undefined,
        hospital_name: role === 'hospital' ? hospitalName : undefined
      };

      await register(payload);
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check credentials.');
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
          className="w-full max-w-lg glass p-10 rounded-[2.5rem] border-white/5"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black uppercase tracking-tight font-outfit">
              Client <span className="accent-text font-jakarta">Register</span>
            </h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
              Join the Adsverz Media Network
            </p>
          </div>

          {/* Role selector tabs */}
          <div className="grid grid-cols-2 gap-3 mb-8 bg-white/5 p-1.5 rounded-2xl border border-white/5">
            <button
              type="button"
              onClick={() => { setRole('brand'); setError(''); }}
              className={`py-3.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition ${
                role === 'brand' ? 'accent-bg text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 size={14} />
              Brand / Advertiser
            </button>
            <button
              type="button"
              onClick={() => { setRole('hospital'); setError(''); }}
              className={`py-3.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition ${
                role === 'hospital' ? 'accent-bg text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserIcon size={14} />
              Hospital / Campus
            </button>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold"
            >
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-center gap-3 text-neon-green text-xs font-bold"
            >
              <CheckCircle size={16} className="shrink-0" />
              <span>{success}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  Contact Name
                </label>
                <input 
                  type="text"
                  required
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm focus:border-neon-green focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  Email Address
                </label>
                <input 
                  type="email"
                  required
                  placeholder="contact@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm focus:border-neon-green focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Password (min. 6 characters)
              </label>
              <input 
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm focus:border-neon-green focus:outline-none transition"
              />
            </div>

            {/* Role-Specific fields */}
            {role === 'brand' ? (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    Company Name
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="Dell Technologies India"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm focus:border-neon-green focus:outline-none transition"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    Hospital / Campus Name
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="RV College of Engineering"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm focus:border-neon-green focus:outline-none transition"
                  />
                </div>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full accent-bg py-4.5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] transition flex items-center justify-center gap-3 shadow-lg shadow-neon-green/10 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">
            Already have an account?{' '}
            <Link to="/login" className="accent-text hover:underline">
              Login Here
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="py-8 text-center text-[9px] text-slate-600 font-black uppercase tracking-[0.25em] border-t border-white/5">
        &copy; {new Date().getFullYear()} Adsverz. All rights reserved.
      </div>
    </div>
  );
};
