import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Footer = () => {
  const navigate = useNavigate();

  const scrollLink = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { replace: true });
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <footer className="py-24 px-8 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16">
        
        {/* Brand / Logo / Tagline */}
        <div className="max-w-md">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-logo-red flex items-center justify-center font-black text-white text-xl shadow-[0_0_15px_rgba(204,0,0,0.4)]">
              A
            </div>
            <div className="text-2xl font-black tracking-tighter uppercase font-outfit">
              <span className="red-accent">ADSVERZ</span><span className="accent-text">.</span>
            </div>
          </div>

          <p className="text-slate-500 font-bold italic text-lg mb-8 leading-tight">
            "Every business needs a boost."
          </p>

          {/* Socials */}
          <div className="flex gap-4">
            <a 
              href="#" 
              aria-label="LinkedIn"
              className="w-11 h-11 glass rounded-2xl flex items-center justify-center hover:accent-bg hover:text-black transition duration-300"
            >
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
            <a 
              href="#" 
              aria-label="Instagram"
              className="w-11 h-11 glass rounded-2xl flex items-center justify-center hover:accent-bg hover:text-black transition duration-300"
            >
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a 
              href="#" 
              aria-label="Twitter/X"
              className="w-11 h-11 glass rounded-2xl flex items-center justify-center hover:accent-bg hover:text-black transition duration-300"
            >
              <i className="fa-brands fa-x-twitter"></i>
            </a>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-16 text-xs font-black uppercase tracking-widest">
          {/* Navigation */}
          <div>
            <h5 className="font-medium normal-case text-sm mb-4 tracking-widest text-white">Navigation</h5>
            <ul className="space-y-4 text-slate-500 text-[11px]">
              <li><button onClick={() => scrollLink('home')} className="hover:text-white transition">Start</button></li>
              <li><button onClick={() => scrollLink('ecosystem')} className="hover:text-white transition">Governance</button></li>
              <li><button onClick={() => scrollLink('about-us')} className="hover:text-white transition">About Us</button></li>
              <li><button onClick={() => scrollLink('nodes')} className="hover:text-white transition">Network</button></li>
              <li><button onClick={() => scrollLink('pricing')} className="hover:text-white transition">Rate Card</button></li>
            </ul>
          </div>

          {/* Location details */}
          <div className="space-y-6">
            <h5 className="text-white normal-case text-sm font-medium">Bengaluru</h5>
            <ul className="space-y-4 text-slate-500 font-medium normal-case tracking-normal">
              <li>Thammenahalli Village, Soladevanahalli</li>
              <li>Bengaluru, Karnataka 560107</li>
              <li>adsverz.company@gmail.com</li>
              <li>Contact Number: 9591025061</li>
            </ul>
          </div>

          {/* Legal policies */}
          <div>
            <h5 className="font-medium normal-case text-sm mb-4 tracking-widest text-white">Legal</h5>
            <ul className="space-y-4 text-slate-500 text-[11px]">
              <li><a href="#" className="hover:text-white transition">Content Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[9px] text-slate-600 font-black uppercase tracking-[0.35em] gap-6 text-center md:text-left">
        <p>&copy; {new Date().getFullYear()} Adsverz Advertising Private Limited. Bengaluru.</p>
        <p className="text-slate-400">Digitizing Professional Campus Life</p>
      </div>
    </footer>
  );
};
