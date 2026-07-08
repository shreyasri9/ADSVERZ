import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Laptop, GraduationCap, Smartphone, Cpu, 
  Check, CircleCheck, CircleX, Network, ShieldCheck,
  Monitor, Wifi, Zap
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const Home = () => {
  // States for interactive widgets
  const [activeNode, setActiveNode] = useState('RVCE-01');
  const [budget, setBudget] = useState(20000);
  const [adSlide, setAdSlide] = useState(0);

  // Cycle ad slide every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setAdSlide((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // College node details metadata
  const nodesData = {
    'RVCE-01': {
      name: 'RV College of Engineering',
      location: 'Main Cafeteria Block',
      resolution: '4K UltraHD',
      capacity: '8,500 impressions/mo',
      type: 'LED Kiosk Display',
      activeCampaign: 'Dell Student Tech Deals',
      status: 'Active',
      color: '#4f75be'
    },
    'PESU-01': {
      name: 'PES University',
      location: 'Block A Admissions',
      resolution: '4K UltraHD',
      capacity: '9,200 impressions/mo',
      type: 'LED Kiosk Display',
      activeCampaign: 'Coursera Skill Certificates',
      status: 'Active',
      color: '#7e94b2'
    },
    'BMS-03': {
      name: 'BMSIT',
      location: 'Main Entrance Plaza',
      resolution: '1080p Digital Standee',
      capacity: '6,000 impressions/mo',
      type: 'Smart Standee',
      activeCampaign: 'Copilot AI Coding Challenge',
      status: 'Active',
      color: '#5c6f84'
    },
    'AIT-01': {
      name: 'Acharya Institute of Tech',
      location: 'Main Lounge Gate 1',
      resolution: '1440p Smart Billboard',
      capacity: '7,000 impressions/mo',
      type: 'Digital Billboard',
      activeCampaign: 'LinkedIn Premium Hub',
      status: 'Active',
      color: '#4f75be'
    }
  };

  // Animation presets
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="bg-bg-dark text-white min-h-screen">
      <Navbar />

      {/* HERO SECTION */}
      <section id="home" className="relative min-h-screen flex pt-32 flex-col justify-center px-8 md:px-24 hero-gradient">
        <div className="max-w-6xl mt-12 md:mt-20">
          
          {/* Status Pill */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 glass px-5 py-2 rounded-full mb-10"
          >
            <span className="status-pulse"></span>
            <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">
              Adsverz Cloud Engine Active | 12 Campus Nodes Online
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-[9.5rem] font-black mb-4 leading-[0.85] tracking-tighter uppercase font-outfit"
          >
            ADVERTISE <span className="accent-text">SMART.</span><br />
            GROW <span className="italic underline decoration-logo-red decoration-[10px] md:decoration-[18px] underline-offset-[16px]">
              FASTER.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-400 mt-6"
          >
            Your success. Our mission.
          </motion.p>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-2xl lg:text-3xl text-slate-400 max-w-3xl mt-8 font-medium leading-relaxed"
          >
            The only high-frequency digital media network in Bengaluru dedicated exclusively to{' '}
            <span className="text-white">Professional Growth</span> and{' '}
            <span className="text-white">Tech Innovation.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4 md:gap-6 mt-12 md:mt-16"
          >
            <Link 
              to="/register?role=brand"
              className="accent-bg px-10 py-5 rounded-2xl font-black text-lg md:text-xl hover:bg-white transition flex items-center gap-4 group"
            >
              Book Ad Slot
              <ArrowRight className="group-hover:translate-x-2 transition" />
            </Link>

            <a 
              href="#ecosystem"
              className="glass px-10 py-5 rounded-2xl font-black text-lg md:text-xl hover:bg-white/5 transition border-white/10"
            >
              Our Mandate
            </a>
          </motion.div>

        </div>
      </section>

      {/* NETWORK LIVE STATUS */}
      <section id="nodes" className="py-32 px-6 md:px-8 bg-black/30">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase mb-4 font-outfit">
                Live Network <span className="accent-text">Status.</span>
              </h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] md:text-xs">
                Real-time node monitoring from Bengaluru HQ
              </p>
            </div>

            <div className="glass px-6 py-3 rounded-2xl border-white/10">
              <span className="text-xs font-black uppercase tracking-tighter text-slate-400">
                Total Impression Capacity:{' '}
                <span className="text-white text-base md:text-lg">25k/mo</span>
              </span>
            </div>
          </div>

          {/* Two column interactive grid: Left selector cards, Right visual previewer */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            
            {/* Left: Interactive Node Selector */}
            <motion.div 
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="lg:col-span-3 flex flex-col gap-4"
            >
              {/* RVCE */}
              <motion.div 
                variants={fadeIn} 
                onClick={() => setActiveNode('RVCE-01')}
                className={`glass p-5 rounded-2xl cursor-pointer select-none transition-all duration-300 flex items-center justify-between border ${
                  activeNode === 'RVCE-01' ? 'border-[#4f75be] bg-[#4f75be]/5 scale-[1.02]' : 'border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-slate-500 uppercase">Node ID: RVCE-01</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
                  </div>
                  <p className="font-bold text-sm text-white">RV College - Cafeteria</p>
                </div>
                <div className="text-right flex flex-col items-end gap-1.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">8.5k/mo reach</span>
                  <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded bg-[#4f75be]/20 text-[#4f75be] border border-[#4f75be]/10">LED Panel</span>
                </div>
              </motion.div>

              {/* PESU */}
              <motion.div 
                variants={fadeIn} 
                onClick={() => setActiveNode('PESU-01')}
                className={`glass p-5 rounded-2xl cursor-pointer select-none transition-all duration-300 flex items-center justify-between border ${
                  activeNode === 'PESU-01' ? 'border-[#7e94b2] bg-[#7e94b2]/5 scale-[1.02]' : 'border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-slate-500 uppercase">Node ID: PESU-01</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
                  </div>
                  <p className="font-bold text-sm text-white">PES University - Block A</p>
                </div>
                <div className="text-right flex flex-col items-end gap-1.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">9.2k/mo reach</span>
                  <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded bg-[#7e94b2]/20 text-[#7e94b2] border border-[#7e94b2]/10">LED Panel</span>
                </div>
              </motion.div>

              {/* BMSIT */}
              <motion.div 
                variants={fadeIn} 
                onClick={() => setActiveNode('BMS-03')}
                className={`glass p-5 rounded-2xl cursor-pointer select-none transition-all duration-300 flex items-center justify-between border ${
                  activeNode === 'BMS-03' ? 'border-[#5c6f84] bg-[#5c6f84]/5 scale-[1.02]' : 'border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-slate-500 uppercase">Node ID: BMS-03</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
                  </div>
                  <p className="font-bold text-sm text-white">BMSIT - Main Plaza</p>
                </div>
                <div className="text-right flex flex-col items-end gap-1.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">6.0k/mo reach</span>
                  <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded bg-[#5c6f84]/20 text-[#5c6f84] border border-[#5c6f84]/10">Standee</span>
                </div>
              </motion.div>

              {/* Acharya */}
              <motion.div 
                variants={fadeIn} 
                onClick={() => setActiveNode('AIT-01')}
                className={`glass p-5 rounded-2xl cursor-pointer select-none transition-all duration-300 flex items-center justify-between border ${
                  activeNode === 'AIT-01' ? 'border-[#4f75be] bg-[#4f75be]/5 scale-[1.02]' : 'border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-slate-500 uppercase">Node ID: AIT-01</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
                  </div>
                  <p className="font-bold text-sm text-white">Acharya Institute - Gate 1</p>
                </div>
                <div className="text-right flex flex-col items-end gap-1.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">7.0k/mo reach</span>
                  <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded bg-[#4f75be]/20 text-[#4f75be] border border-[#4f75be]/10">Billboard</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Simulated TV Screen Previewer */}
            <div className="lg:col-span-2">
              <div className="border border-white/10 bg-[#080916] rounded-3xl p-5 md:p-6 flex flex-col justify-between h-[360px] relative overflow-hidden shadow-2xl">
                {/* Bezels / TV Cam */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-10 h-1 bg-white/25 rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4f75be]/75"></span>
                </div>
                
                {/* Visual Ad Screen Area */}
                <div className="flex-grow flex flex-col items-center justify-center border border-white/5 rounded-2xl bg-[#02030a] relative p-6 mt-4 overflow-hidden">
                  <AnimatePresence mode="wait">
                    {adSlide === 0 && (
                      <motion.div 
                        key="ad0" 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                        className="text-center flex flex-col items-center justify-center"
                      >
                        <Laptop size={32} className="text-[#4f75be] mb-3" />
                        <h4 className="text-[11px] font-black uppercase text-[#4f75be] tracking-wider leading-tight">DELL STUDENT EXCLUSIVES</h4>
                        <p className="text-[9px] text-slate-400 mt-2 font-bold max-w-[190px]">Get up to ₹15,000 off XPS notebooks with verified college IDs.</p>
                      </motion.div>
                    )}
                    {adSlide === 1 && (
                      <motion.div 
                        key="ad1" 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                        className="text-center flex flex-col items-center justify-center"
                      >
                        <GraduationCap size={32} className="text-[#7e94b2] mb-3" />
                        <h4 className="text-[11px] font-black uppercase text-[#7e94b2] tracking-wider leading-tight">COURSERA CAREER PATHWAYS</h4>
                        <p className="text-[9px] text-slate-400 mt-2 font-bold max-w-[190px]">Unlock Google and IBM certificate programs at zero cost.</p>
                      </motion.div>
                    )}
                    {adSlide === 2 && (
                      <motion.div 
                        key="ad2" 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                        className="text-center flex flex-col items-center justify-center"
                      >
                        <Cpu size={32} className="text-[#5c6f84] mb-3" />
                        <h4 className="text-[11px] font-black uppercase text-[#5c6f84] tracking-wider leading-tight">GITHUB COPILOT STUDENT</h4>
                        <p className="text-[9px] text-slate-400 mt-2 font-bold max-w-[190px]">Claim your free subscription to code smarter, faster, and easier.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Active node details tag */}
                  <div className="absolute bottom-2 left-3 right-3 flex justify-between items-center text-[7px] text-slate-500 font-black tracking-widest uppercase">
                    <span className="flex items-center gap-1.5"><Wifi size={10} className="text-green-500" /> ONLINE</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span> Live Broadcast</span>
                  </div>
                </div>

                {/* Display Specs Footer */}
                <div className="mt-4 border-t border-white/5 pt-3.5 flex justify-between items-center">
                  <div className="overflow-hidden pr-2">
                    <span className="text-[7px] font-black uppercase text-slate-500 tracking-widest block">Active Screen Node</span>
                    <span className="font-bold text-white text-[10px] truncate block">{nodesData[activeNode].name}</span>
                  </div>
                  <div className="text-right shrink-0 border-l border-white/5 pl-4">
                    <span className="text-[7px] font-black uppercase text-slate-500 tracking-widest block">Sync Spec</span>
                    <span className="font-black text-[#4f75be] text-[10px]">{nodesData[activeNode].resolution}</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* GOVERNANCE & FOCUS */}
      <section id="ecosystem" className="py-32 px-6 md:px-8 bg-black/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            
            {/* Curation Policy */}
            <motion.div 
              initial={{ opacity: 0, x: -35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight tracking-tighter font-outfit">
                Strict <span className="accent-text font-jakarta">Professional</span><br />Curation Policy.
              </h2>
              <p className="text-lg md:text-xl text-slate-400 mb-8 font-medium leading-relaxed">
                To maintain institutional harmony, Adsverz operates on a "Career-First" mandate. We eliminate digital noise to focus on what matters to students.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass p-8 rounded-3xl border-green-500/20 bg-green-500/5">
                  <h4 className="text-neon-green font-black text-xs uppercase mb-4 flex items-center gap-2">
                    <CircleCheck size={14} /> Approved Categories
                  </h4>
                  <ul className="text-xs space-y-3 font-bold text-slate-300">
                    <li>Laptops & Computing</li>
                    <li>Upskilling Certificates</li>
                    <li>Career & Job Platforms</li>
                    <li>Student Banking & SaaS</li>
                  </ul>
                </div>
                <div className="glass p-8 rounded-3xl border-red-500/20 bg-red-500/5">
                  <h4 className="text-red-500 font-black text-xs uppercase mb-4 flex items-center gap-2">
                    <CircleX size={14} /> Restricted Content
                  </h4>
                  <ul className="text-xs space-y-3 font-bold text-slate-500">
                    <li>Non-local F&B Outlets</li>
                    <li>Fast Fashion / Lifestyle</li>
                    <li>Gaming / Betting Apps</li>
                    <li>General Entertainment</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Grid Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="glass p-10 rounded-3xl border-white/5 hover:border-neon-green/30 transition group">
                <Laptop className="w-10 h-10 accent-text mb-6 group-hover:scale-110 transition duration-300" />
                <h3 className="text-lg font-bold mb-3 text-white font-outfit">Tech Hardware</h3>
                <p className="text-xs text-slate-500 font-medium">Laptops, peripherals, and engineering tools for 50k+ students.</p>
              </div>
              <div className="glass p-10 rounded-3xl border-white/5 hover:border-neon-green/30 transition group">
                <GraduationCap className="w-10 h-10 accent-text mb-6 group-hover:scale-110 transition duration-300" />
                <h3 className="text-lg font-bold mb-3 text-white font-outfit">EdTech Giants</h3>
                <p className="text-xs text-slate-500 font-medium">Promote certificates and bootcamps at the exact point of intent.</p>
              </div>
              <div className="glass p-10 rounded-3xl border-white/5 hover:border-neon-green/30 transition group">
                <Smartphone className="w-10 h-10 accent-text mb-6 group-hover:scale-110 transition duration-300" />
                <h3 className="text-lg font-bold mb-3 text-white font-outfit">Growth Apps</h3>
                <p className="text-xs text-slate-500 font-medium">LinkedIn, Glassdoor, and productivity tools for the modern student.</p>
              </div>
              <div className="glass p-10 rounded-3xl border-white/5 hover:border-neon-green/30 transition group">
                <Cpu className="w-10 h-10 accent-text mb-6 group-hover:scale-110 transition duration-300" />
                <h3 className="text-lg font-bold mb-3 text-white font-outfit">SaaS & AI</h3>
                <p className="text-xs text-slate-500 font-medium">Target early-adopters with coding copilots and cloud software.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* RATE CARD */}
      {/* RATE CARD */}
      <section id="pricing" className="py-32 px-6 md:px-8 bg-[#0b0f19] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter uppercase italic font-outfit">
              The Rate <span className="accent-text font-jakarta">Card.</span>
            </h2>
            <p className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-widest">
              Transparent monthly subscriptions for educational brands.
            </p>
          </div>

          {/* Interactive Calculator Slider Widget */}
          <div className="glass p-8 rounded-3xl border-white/5 max-w-3xl mx-auto mb-16 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
              <div>
                <h3 className="text-lg font-black uppercase text-white font-outfit">Interactive Campaign Calculator</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Estimate your targeted student impressions & reach</p>
              </div>
              <div className="bg-[#111827] border border-white/5 px-5 py-2.5 rounded-2xl flex items-baseline gap-1 shadow-lg shrink-0">
                <span className="text-[10px] font-black text-slate-500 uppercase mr-1">Budget:</span>
                <span className="text-2xl font-black text-[#4f75be]">₹{(budget).toLocaleString()}</span>
                <span className="text-slate-500 text-[10px] font-bold">/mo</span>
              </div>
            </div>

            {/* Range Slider */}
            <div className="flex flex-col gap-2.5">
              <input 
                type="range" 
                min="8000" 
                max="80000" 
                step="2000" 
                value={budget} 
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-1.5 bg-[#1f2937] rounded-lg appearance-none cursor-pointer accent-[#4f75be]" 
              />
              <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">
                <span>Min: ₹8,000</span>
                <span>Mid: ₹44,000</span>
                <span>Max: ₹80,000+</span>
              </div>
            </div>

            {/* Calculated Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="border border-white/5 bg-[#0b0f19] p-4 rounded-2xl">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Est. Impressions</span>
                <span className="text-lg font-black text-white flex items-center gap-2"><Zap size={14} className="text-[#4f75be]" /> {(budget * 1.25).toLocaleString()}/mo</span>
              </div>
              <div className="border border-white/5 bg-[#0b0f19] p-4 rounded-2xl">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Student Eyeballs</span>
                <span className="text-lg font-black text-white flex items-center gap-2"><Network size={14} className="text-[#7e94b2]" /> {(budget * 0.45).toLocaleString()}/mo</span>
              </div>
              <div className="border border-white/5 bg-[#0b0f19] p-4 rounded-2xl">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Campus Nodes</span>
                <span className="text-lg font-black text-white flex items-center gap-2"><Monitor size={14} className="text-[#5c6f84]" /> {budget < 15000 ? "1 Campus" : budget < 35000 ? "2 Campuses" : "4 Campuses"}</span>
              </div>
            </div>
          </div>

          {/* Pricing cards wrapper */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Skill Launcher */}
            <div className={`glass p-10 rounded-[2.5rem] pricing-card flex flex-col justify-between transition-all duration-300 border ${
              budget < 15000 ? 'border-[#4f75be] bg-[#4f75be]/5 scale-102 shadow-[0_0_20px_rgba(79,117,190,0.06)]' : 'border-white/5 opacity-60'
            }`}>
              <div>
                <h3 className="text-xl font-black mb-2 text-white font-outfit">Skill Launcher</h3>
                <p className="text-[10px] font-black text-slate-500 mb-10 tracking-widest uppercase">Local Training Hubs</p>
                <div className="mb-10">
                  <span className="text-5xl font-black italic">₹8k</span>
                  <span className="text-slate-600 text-xs font-bold"> /mo per campus</span>
                </div>
                <ul className="space-y-4 text-slate-400 font-bold text-xs">
                  <li className="flex items-center gap-3"><Check size={14} className="text-[#4f75be]" /> 15s Static Ad Loop</li>
                  <li className="flex items-center gap-3"><Check size={14} className="text-[#4f75be]" /> Single Department Focus</li>
                  <li className="flex items-center gap-3"><Check size={14} className="text-[#4f75be]" /> QR Performance Tracking</li>
                </ul>
              </div>
              <Link 
                to={`/register?role=brand&budget=${budget}`}
                className="mt-12 w-full py-4 rounded-xl border-2 border-[#4f75be] text-[#4f75be] font-black hover:bg-[#4f75be] hover:text-black transition uppercase tracking-widest text-[10px] text-center"
              >
                Request Slot
              </Link>
            </div>

            {/* Tech Titan */}
            <div className={`glass p-10 rounded-[2.5rem] pricing-card flex flex-col justify-between transition-all duration-300 relative border ${
              budget >= 15000 && budget < 35000 ? 'border-[#7e94b2] bg-[#7e94b2]/5 scale-102 shadow-[0_0_20px_rgba(126,148,178,0.06)]' : 'border-white/5 opacity-60'
            }`}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#7e94b2] text-black px-6 py-1.5 rounded-full text-[9px] font-black tracking-[0.25em] uppercase whitespace-nowrap">
                Recommended for Tech Brands
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-black mb-2 text-[#7e94b2] font-outfit">Tech Titan</h3>
                <p className="text-[10px] font-black text-slate-400 mb-10 tracking-widest uppercase italic">High Frequency Hardware & SaaS</p>
                <div className="mb-10">
                  <span className="text-5xl font-black italic">₹20k</span>
                  <span className="text-slate-600 text-xs font-bold"> /mo per campus</span>
                </div>
                <ul className="space-y-4 text-slate-300 font-bold text-xs">
                  <li className="flex items-center gap-3"><Check size={14} className="text-[#7e94b2]" /> 30s 4K Motion Graphics</li>
                  <li className="flex items-center gap-3"><Check size={14} className="text-[#7e94b2]" /> Prime Cafeteria Placement</li>
                  <li className="flex items-center gap-3"><Check size={14} className="text-[#7e94b2]" /> Product Launch Mentions</li>
                  <li className="flex items-center gap-3"><Check size={14} className="text-[#7e94b2]" /> Reach Data Reports</li>
                </ul>
              </div>
              <Link 
                to={`/register?role=brand&budget=${budget}`}
                className="mt-12 w-full bg-[#7e94b2] text-black py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition shadow-lg shadow-[#7e94b2]/20 text-center"
              >
                Request Slot
              </Link>
            </div>

            {/* Network Leader */}
            <div className={`glass p-10 rounded-[2.5rem] pricing-card flex flex-col justify-between transition-all duration-300 border ${
              budget >= 35000 ? 'border-[#4f75be] bg-[#4f75be]/5 scale-102 shadow-[0_0_20px_rgba(79,117,190,0.06)]' : 'border-white/5 opacity-60'
            }`}>
              <div>
                <h3 className="text-xl font-black mb-2 text-white font-outfit">Network Leader</h3>
                <p className="text-[10px] font-black text-slate-500 mb-10 tracking-widest uppercase">Multi-Campus Blitz</p>
                <div className="mb-10">
                  <span className="text-5xl font-black italic">₹45k</span>
                  <span className="text-slate-600 text-xs font-bold"> /mo / 3 campuses</span>
                </div>
                <ul className="space-y-4 text-slate-400 font-bold text-xs">
                  <li className="flex items-center gap-3"><Check size={14} className="text-[#4f75be]" /> Priority Network-Wide Sync</li>
                  <li className="flex items-center gap-3"><Check size={14} className="text-[#4f75be]" /> Career Workshop Inclusion</li>
                  <li className="flex items-center gap-3"><Check size={14} className="text-[#4f75be]" /> Direct App-Install QR Links</li>
                </ul>
              </div>
              <Link 
                to={`/register?role=brand&budget=${budget}`}
                className="mt-12 w-full py-4 rounded-xl border-2 border-[#4f75be] text-[#4f75be] font-black hover:bg-[#4f75be] hover:text-black transition uppercase tracking-widest text-[10px] text-center"
              >
                Request Slot
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* BUSINESS MODEL CANVAS (STRATEGY & ARCHITECTURE) */}
      <section id="bmc" className="py-32 px-6 md:px-8 bg-white text-black">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.8] mb-6 font-outfit">
                Strategy <span className="text-slate-300 font-jakarta">&</span> Architecture.
              </h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                A blueprint for professional campus integration.
              </p>
            </div>
            <div className="text-right glass border-black/10 p-4 rounded-xl hidden md:block">
              <p className="text-[9px] font-black uppercase text-slate-400">
                Institutional Governance Code: ADZ-BENG-001
              </p>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-5 md:grid-rows-2 gap-4">
            
            {/* Key Partners */}
            <div className="bmc-item md:row-span-2 flex flex-col justify-between">
              <div>
                <h4 className="font-black text-[9px] uppercase tracking-[0.2em] mb-6 border-b-2 border-black pb-2">
                  Key Partners
                </h4>
                <div className="space-y-4 text-[10px] font-black uppercase leading-tight">
                  <div className="p-3 bg-slate-50 rounded">
                    <p className="text-slate-400 mb-1 italic">Campuses</p>
                    <p>RVCE, PESU, BMSIT, AIT</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded">
                    <p className="text-slate-400 mb-1 italic">Advertisers</p>
                    <p>Dell, Apple, Coursera, LinkedIn</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Activities */}
            <div className="bmc-item">
              <h4 className="font-black text-[9px] uppercase tracking-[0.2em] mb-4 border-b-2 border-black pb-2">
                Activities
              </h4>
              <p className="text-[11px] font-bold leading-relaxed">
                Network installation, Ad-CMS engineering, Educational curation, Brand onboarding.
              </p>
            </div>

            {/* Value Proposition */}
            <div className="bmc-item md:row-span-2 bg-[#deff9a] border-black flex flex-col justify-between shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
              <div>
                <h4 className="font-black text-[9px] uppercase tracking-[0.2em] mb-6 border-b-2 border-black pb-2">
                  Value Prop
                </h4>
                <div className="space-y-6">
                  <div>
                    <p className="text-[8px] font-black uppercase text-black/50 mb-1 tracking-widest">For Institutions</p>
                    <p className="text-xs font-black leading-tight">5% Profit Share + Free Smart Screen Setup + Zero Noise.</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black uppercase text-black/50 mb-1 tracking-widest">For Students</p>
                    <p className="text-xs font-black leading-tight">Exclusive discounts on tech products & career certifications.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Relationships */}
            <div className="bmc-item">
              <h4 className="font-black text-[9px] uppercase tracking-[0.2em] mb-4 border-b-2 border-black pb-2">
                Relationships
              </h4>
              <p className="text-[11px] font-bold">
                Self-service advertiser console, transparent analytics reports, long-term MoUs.
              </p>
            </div>

            {/* Customer Segments */}
            <div className="bmc-item md:row-span-2 flex flex-col justify-between">
              <div>
                <h4 className="font-black text-[9px] uppercase tracking-[0.2em] mb-6 border-b-2 border-black pb-2">
                  Segments
                </h4>
                <div className="space-y-4 text-[10px] font-black uppercase leading-tight">
                  <p><strong>EdTech:</strong> Providers targeting verified students.</p>
                  <p><strong>Hardware:</strong> Brands selling laptops & development boards.</p>
                  <p><strong>SaaS:</strong> Cloud tools and career applications.</p>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="bmc-item">
              <h4 className="font-black text-[9px] uppercase tracking-[0.2em] mb-4 border-b-2 border-black pb-2">
                Resources
              </h4>
              <p className="text-[11px] font-bold">
                Smart CMS, Prime Campus Estate, IoT screen hardware, Bengaluru Sales Team.
              </p>
            </div>

            {/* Channels */}
            <div className="bmc-item">
              <h4 className="font-black text-[9px] uppercase tracking-[0.2em] mb-4 border-b-2 border-black pb-2">
                Channels
              </h4>
              <p className="text-[11px] font-bold">
                Adsverz Web Console, Direct B2B Outreaches, Placement Cell Integrations.
              </p>
            </div>

            {/* Cost Structure */}
            <div className="bmc-item md:col-span-2">
              <h4 className="font-black text-[9px] uppercase tracking-[0.2em] mb-4 border-b-2 border-black pb-2">
                Cost Structure
              </h4>
              <p className="text-[11px] font-bold">
                IoT Screen installations, Electricity/Broadband, Sales commission, Profit share, Cloud maintenance.
              </p>
            </div>

            {/* Revenue Streams */}
            <div className="bmc-item md:col-span-3">
              <h4 className="font-black text-[9px] uppercase tracking-[0.2em] mb-4 border-b-2 border-black pb-2">
                Revenue Streams
              </h4>
              <p className="text-[11px] font-bold">
                Monthly advertising rentals (₹8k-45k), Creative management services, Sponsored Tips campaigns.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ABOUT US */}
      <section id="about-us" className="py-32 px-6 md:px-8 bg-black/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          
          <div className="max-w-3xl mb-20">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6 font-outfit">
              About <span className="accent-text font-jakarta">Adsverz.</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed">
              Adsverz is building India’s first professional-first campus media infrastructure — engineered to connect brands and students at the moment of career intent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mission */}
            <div className="glass p-10 rounded-3xl border-white/10 hover:border-[#deff9a]/30 transition duration-300">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#deff9a] mb-4">
                Our Mission
              </h3>
              <p className="text-slate-400 font-medium leading-relaxed text-sm">
                To empower students with relevant, career-focused opportunities while helping brands achieve ethical, measurable, and high-impact visibility inside premium campuses.
              </p>
            </div>

            {/* Vision */}
            <div className="glass p-10 rounded-3xl border-white/10 hover:border-[#deff9a]/30 transition duration-300">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#deff9a] mb-4">
                Our Vision
              </h3>
              <p className="text-slate-400 font-medium leading-relaxed text-sm">
                To become India’s most trusted professional campus media network, seamlessly integrated across top institutions nationwide.
              </p>
            </div>

            {/* Target Goals */}
            <div className="glass p-10 rounded-3xl border-white/10 hover:border-[#deff9a]/30 transition duration-300">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#deff9a] mb-4">
                Target Goals
              </h3>
              <ul className="text-slate-400 font-medium space-y-3 leading-relaxed text-xs list-disc list-inside">
                <li>Deploy 500+ smart media nodes across Indian campuses</li>
                <li>Partner with leading EdTech & technology brands</li>
                <li>Maintain a strict career-first content policy</li>
                <li>Deliver transparent ROI via real-time analytics</li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* BRAND CTA */}
      <section className="py-24 px-6 md:px-8 bg-gradient-to-r from-black via-black/80 to-black">
        <div className="max-w-6xl mx-auto glass rounded-3xl p-10 md:p-16 border border-white/10 text-center">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 font-outfit">
            Ready to <span className="accent-text font-jakarta">Activate</span> Your Campaign?
          </h2>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Reach verified student and professional audiences inside high-impact, institution-approved environments.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="mailto:sales@adsverz.com"
              className="accent-bg px-10 py-4.5 rounded-2xl font-black text-sm md:text-base uppercase tracking-widest hover:scale-105 transition"
            >
              Contact Sales
            </a>
            <a 
              href="#pricing"
              className="glass px-10 py-4.5 rounded-2xl font-black text-sm md:text-base uppercase tracking-widest hover:bg-white/5 transition"
            >
              View Rate Card
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
