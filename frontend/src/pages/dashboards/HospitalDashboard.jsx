import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { getMediaUrl } from '../../utils/mediaHelper';
import { 
  Monitor, Play, Calendar, AlertCircle, CheckCircle2, 
  MapPin, HelpCircle, Power, RefreshCw, Plus, X
} from 'lucide-react';

export const HospitalDashboard = ({ initialTab = 'overview' }) => {
  const [activeTab, setActiveTab] = useState(initialTab); // 'overview', 'screens', 'support'

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  const [screens, setScreens] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Screen creation
  const [screenId, setScreenId] = useState('');
  const [screenName, setScreenName] = useState('');
  const [screenLoc, setScreenLoc] = useState('');
  const [screenSize, setScreenSize] = useState('55 inch');
  const [screenType, setScreenType] = useState('TV');
  const [screenError, setScreenError] = useState('');
  const [screenSuccess, setScreenSuccess] = useState('');

  // Ticket creation
  const [ticketSub, setTicketSub] = useState('');
  const [ticketMsg, setTicketMsg] = useState('');
  const [ticketError, setTicketError] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState('');

  // Virtual Screen Loop Player Modal
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [activeAdIndex, setActiveAdIndex] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [screenRes, campRes, ticketRes] = await Promise.all([
        axios.get('/api/v1/hospitals/my-screens'),
        axios.get('/api/v1/hospitals/active-campaigns'),
        axios.get('/api/v1/support/')
      ]);
      setScreens(screenRes.data);
      setCampaigns(campRes.data);
      setTickets(ticketRes.data);
    } catch (err) {
      console.error("Error loading hospital dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterScreen = async (e) => {
    e.preventDefault();
    setScreenError('');
    setScreenSuccess('');

    if (!screenId || !screenName) {
      setScreenError('Screen ID and Display Name are required.');
      return;
    }

    try {
      await axios.post('/api/v1/hospitals/my-screens', {
        screen_id: screenId,
        name: screenName,
        location_detail: screenLoc,
        size: screenSize,
        screen_type: screenType
      });
      setScreenSuccess('Display node registered successfully!');
      setScreenId('');
      setScreenName('');
      setScreenLoc('');
      fetchDashboardData();
    } catch (err) {
      setScreenError(err.response?.data?.detail || 'Screen registration failed.');
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setTicketError('');
    setTicketSuccess('');

    if (!ticketSub || !ticketMsg) {
      setTicketError('Please provide subject and message.');
      return;
    }

    try {
      await axios.post('/api/v1/support/', {
        subject: ticketSub,
        category: 'screen',
        message: ticketMsg
      });
      setTicketSuccess('Technical ticket filed successfully.');
      setTicketSub('');
      setTicketMsg('');
      fetchDashboardData();
    } catch (err) {
      setTicketError(err.response?.data?.detail || 'Failed to file ticket.');
    }
  };

  // Extract all advertisements from active approved campaigns
  const getAllActiveAds = () => {
    const ads = [];
    campaigns.forEach(camp => {
      if (camp.advertisements && camp.advertisements.length > 0) {
        camp.advertisements.forEach(ad => {
          ads.push({
            ...ad,
            campaign_name: camp.name,
            brand_name: camp.brand_company_name
          });
        });
      }
    });
    return ads;
  };

  const activeAds = getAllActiveAds();

  // Media Loop Timer for Virtual Player
  useEffect(() => {
    if (!selectedScreen || activeAds.length <= 1) return;

    const currentAd = activeAds[activeAdIndex];
    const duration = (currentAd?.duration_seconds || 15) * 1000;

    const timer = setTimeout(() => {
      setActiveAdIndex((prevIndex) => (prevIndex + 1) % activeAds.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [selectedScreen, activeAdIndex, activeAds]);

  const openVirtualPlayer = (screen) => {
    setSelectedScreen(screen);
    setActiveAdIndex(0);
  };

  const closeVirtualPlayer = () => {
    setSelectedScreen(null);
  };

  const onlineScreens = screens.filter(s => s.is_online);

  return (
    <DashboardLayout title="Hospital Console">
      {/* Mini tabs */}
      <div className="flex gap-4 border-b border-white/5 pb-4 mb-8">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition ${
            activeTab === 'overview' ? 'accent-bg text-black' : 'glass text-slate-400 hover:text-white'
          }`}
        >
          Active Campaigns
        </button>
        <button
          onClick={() => setActiveTab('screens')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition ${
            activeTab === 'screens' ? 'accent-bg text-black' : 'glass text-slate-400 hover:text-white'
          }`}
        >
          My Screens ({screens.length})
        </button>
        <button
          onClick={() => setActiveTab('support')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition ${
            activeTab === 'support' ? 'accent-bg text-black' : 'glass text-slate-400 hover:text-white'
          }`}
        >
          Technical Help
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-2 border-neon-green border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* TAB 1: ACTIVE CAMPAIGNS */}
          {activeTab === 'overview' && (
            <div className="space-y-10">
              
              {/* Stats row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-8 rounded-[2rem] border-white/10 hover:border-neon-green/20 hover:shadow-[0_15px_30px_rgba(222,255,154,0.02)] transition-all duration-300">
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">Registered Screens</span>
                  <h3 className="text-5xl font-black mt-3 font-outfit tracking-tighter text-white">{screens.length}</h3>
                </div>
                <div className="glass p-8 rounded-[2rem] border-neon-green/10 hover:border-neon-green/20 hover:shadow-[0_15px_30px_rgba(222,255,154,0.05)] transition-all duration-300">
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-neon-green">Live Hardware Nodes</span>
                  <h3 className="text-5xl font-black mt-3 text-neon-green font-outfit tracking-tighter">{onlineScreens.length}</h3>
                </div>
                <div className="glass p-8 rounded-[2rem] border-white/10 hover:border-neon-green/20 hover:shadow-[0_15px_30px_rgba(222,255,154,0.02)] transition-all duration-300">
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">Approved Campaigns</span>
                  <h3 className="text-5xl font-black mt-3 text-white font-outfit tracking-tighter">{campaigns.length}</h3>
                </div>
              </div>

              {/* Active Campaigns List */}
              <div className="glass rounded-[2rem] border-white/5 overflow-hidden">
                <div className="p-8 border-b border-white/5">
                  <h3 className="text-lg font-black uppercase font-outfit">Approved Campaign Broadcasts</h3>
                  <p className="text-[9px] font-bold uppercase text-slate-500 mt-1">Campaigns cleared for display at this hospital location</p>
                </div>

                {campaigns.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 text-xs font-bold uppercase tracking-wider">
                    No approved campaign schedules targeting this location.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-bold uppercase tracking-wider">
                      <thead className="bg-white/5 text-slate-400 border-b border-white/5 text-[9px]">
                        <tr>
                          <th className="p-5">Campaign Name</th>
                          <th className="p-5">Brand Owner</th>
                          <th className="p-5">Start Date</th>
                          <th className="p-5">End Date</th>
                          <th className="p-5">Media Count</th>
                          <th className="p-5">Broadcast Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-slate-300">
                        {campaigns.map((camp) => (
                          <tr key={camp.id} className="hover:bg-white/[0.02] transition">
                            <td className="p-5 font-black text-white">{camp.name}</td>
                            <td className="p-5 normal-case">{camp.brand_company_name || 'Brand'}</td>
                            <td className="p-5">{camp.start_date}</td>
                            <td className="p-5">{camp.end_date}</td>
                            <td className="p-5">{camp.advertisements?.length || 0} Ad(s)</td>
                            <td className="p-5">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black bg-green-500/10 text-green-400 uppercase">
                                <CheckCircle2 size={10} />
                                Broadcasting
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MANAGE SCREENS */}
          {activeTab === 'screens' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Form: Register Screen */}
              <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6 lg:col-span-1">
                <div>
                  <h3 className="text-xl font-black uppercase font-outfit">Register Display Node</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Link a new IoT player to the Adsverz cloud</p>
                </div>

                {screenError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold">
                    <AlertCircle size={16} />
                    <span>{screenError}</span>
                  </div>
                )}
                {screenSuccess && (
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-center gap-3 text-neon-green text-xs font-bold">
                    <CheckCircle2 size={16} />
                    <span>{screenSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleRegisterScreen} className="space-y-5">
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Unique Screen ID</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., CAMPUS-01, ENT-LOBBY-3"
                      value={screenId}
                      onChange={(e) => setScreenId(e.target.value)}
                      className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-neon-green focus:outline-none transition uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Display Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Block A Placement Lobby"
                      value={screenName}
                      onChange={(e) => setScreenName(e.target.value)}
                      className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-neon-green focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Location Detail</label>
                    <input
                      type="text"
                      placeholder="e.g. Next to lift B, reception desk"
                      value={screenLoc}
                      onChange={(e) => setScreenLoc(e.target.value)}
                      className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-neon-green focus:outline-none transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Dimensions</label>
                      <select
                        value={screenSize}
                        onChange={(e) => setScreenSize(e.target.value)}
                        className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-neon-green focus:outline-none transition"
                      >
                        <option value="55 inch" className="bg-bg-dark">55 inch</option>
                        <option value="65 inch" className="bg-bg-dark">65 inch</option>
                        <option value="75 inch" className="bg-bg-dark">75 inch</option>
                        <option value="Standard Billboard" className="bg-bg-dark">Billboard</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Category</label>
                      <select
                        value={screenType}
                        onChange={(e) => setScreenType(e.target.value)}
                        className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-neon-green focus:outline-none transition"
                      >
                        <option value="TV" className="bg-bg-dark">TV Screen</option>
                        <option value="Digital Standee" className="bg-bg-dark">Standee</option>
                        <option value="Kiosk" className="bg-bg-dark">Interactive Kiosk</option>
                        <option value="Billboard" className="bg-bg-dark">Large Billboard</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full accent-bg py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-[1.01] transition flex items-center justify-center gap-3 shadow-lg shadow-neon-green/15"
                  >
                    Activate Screen Node
                    <Plus size={14} />
                  </button>
                </form>
              </div>

              {/* Screens List */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-xl font-black uppercase font-outfit">Hardware Nodes</h3>

                {screens.length === 0 ? (
                  <div className="glass p-12 text-center text-slate-500 text-xs font-bold uppercase tracking-wider rounded-3xl border-white/5">
                    No display screens registered. Fill the form to add one.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {screens.map(screen => (
                      <div
                        key={screen.id}
                        className="glass p-6 rounded-3xl border-white/5 flex flex-col justify-between gap-6"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-black text-slate-500 uppercase">{screen.screen_id}</span>
                            <h4 className="text-sm font-black text-white mt-1">{screen.name}</h4>
                            <p className="text-[9px] text-slate-500 font-bold uppercase flex items-center gap-1 mt-1">
                              <MapPin size={10} className="accent-text" />
                              {screen.location_detail || 'No location detail'}
                            </p>
                          </div>

                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] font-black uppercase ${
                            screen.is_online 
                              ? 'bg-green-500/10 text-green-400 shadow-[0_0_5px_rgba(34,197,94,0.15)]' 
                              : 'bg-red-500/10 text-red-400'
                          }`}>
                            <Power size={8} />
                            {screen.is_online ? 'online' : 'offline'}
                          </span>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-white/5">
                          <span className="text-[9px] font-black text-slate-500 uppercase">
                            {screen.screen_type} • {screen.size}
                          </span>
                          
                          <button
                            onClick={() => openVirtualPlayer(screen)}
                            className="accent-bg px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center gap-1.5 hover:scale-105 transition shadow-lg shadow-neon-green/10"
                          >
                            <Play size={10} fill="black" />
                            Live Playback
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: TECHNICAL SUPPORT */}
          {activeTab === 'support' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Form to submit support query */}
              <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6 lg:col-span-1">
                <div>
                  <h3 className="text-xl font-black uppercase font-outfit">Report Screen Error</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Submit technical reports for on-site media hardware</p>
                </div>

                {ticketError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold">
                    <AlertCircle size={16} />
                    <span>{ticketError}</span>
                  </div>
                )}
                {ticketSuccess && (
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-center gap-3 text-neon-green text-xs font-bold">
                    <CheckCircle2 size={16} />
                    <span>{ticketSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleCreateTicket} className="space-y-5">
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Display Node / Screen ID</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., RVCE-01, Monitor down"
                      value={ticketSub}
                      onChange={(e) => setTicketSub(e.target.value)}
                      className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-neon-green focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Issue Description</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Describe the display, network, or hardware issue..."
                      value={ticketMsg}
                      onChange={(e) => setTicketMsg(e.target.value)}
                      className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-neon-green focus:outline-none transition"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full accent-bg py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-[1.01] transition flex items-center justify-center gap-3 shadow-lg shadow-neon-green/15"
                  >
                    File Help Ticket
                    <HelpCircle size={14} />
                  </button>
                </form>
              </div>

              {/* Tickets list */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-xl font-black uppercase font-outfit">Filed Reports ({tickets.length})</h3>

                {tickets.length === 0 ? (
                  <div className="glass p-12 text-center text-slate-500 text-xs font-bold uppercase tracking-wider rounded-3xl border-white/5">
                    No technical support tickets created.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tickets.map(ticket => (
                      <div
                        key={ticket.id}
                        className="glass p-6 rounded-3xl border-white/5 flex flex-col gap-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase bg-white/10 text-slate-400 mb-2">
                              Technical Screen Report
                            </span>
                            <h4 className="text-sm font-black text-white">{ticket.subject}</h4>
                            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Submitted on {new Date(ticket.created_at).toLocaleDateString()}</p>
                          </div>
                          
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
                            ticket.status === 'open' 
                              ? 'bg-green-500/10 text-green-400' 
                              : ticket.status === 'in_progress' 
                                ? 'bg-orange-500/10 text-orange-400' 
                                : 'bg-white/5 text-slate-500'
                          }`}>
                            {ticket.status}
                          </span>
                        </div>

                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                          <p className="text-xs text-slate-400 normal-case font-medium">{ticket.message}</p>
                        </div>

                        {ticket.admin_reply ? (
                          <div className="p-4 bg-neon-green/5 border border-neon-green/10 rounded-2xl">
                            <span className="text-[8px] font-black text-neon-green uppercase tracking-widest mb-1.5 block">Response from Admin</span>
                            <p className="text-xs text-slate-300 normal-case font-medium">{ticket.admin_reply}</p>
                          </div>
                        ) : (
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Awaiting Admin Response...</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* VIRTUAL DIGITAL SIGNAGE LOOP PLAYER MODAL */}
          {selectedScreen && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
              <div className="w-full max-w-4xl glass border-white/10 rounded-[3rem] p-8 relative flex flex-col gap-6">
                
                {/* Modal Header */}
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <div>
                    <h3 className="text-xl font-black uppercase font-outfit text-white flex items-center gap-2">
                      <Monitor size={18} className="text-neon-green" />
                      Virtual Display Loop Viewer
                    </h3>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">
                      Screen Node: {selectedScreen.screen_id} • Location: {selectedScreen.name}
                    </p>
                  </div>
                  <button 
                    onClick={closeVirtualPlayer}
                    className="p-2.5 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Virtual Display Player Panel Bezel Bevel */}
                <div className="p-4 bg-zinc-900 border-4 border-zinc-800 rounded-3xl shadow-[0_0_80px_rgba(222,255,154,0.1)] relative">
                  {/* Status Indicator Bezel Light */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
                    <span className="text-[6px] text-zinc-600 font-bold uppercase tracking-widest">LIVE</span>
                  </div>

                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-black relative flex items-center justify-center select-none">
                    {activeAds.length > 0 ? (
                      <div className="w-full h-full relative">
                        {/* Media Renderer */}
                        {activeAds[activeAdIndex].media_type === 'video' ? (
                          <video 
                            key={activeAds[activeAdIndex].id}
                            src={getMediaUrl(activeAds[activeAdIndex].media_url)}
                            autoPlay 
                            muted 
                            loop={activeAds.length === 1}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img 
                            key={activeAds[activeAdIndex].id}
                            src={getMediaUrl(activeAds[activeAdIndex].media_url)}
                            alt="Active Loop"
                            className="w-full h-full object-cover"
                          />
                        )}

                        {/* Display Info Overlay */}
                        <div className="absolute bottom-6 left-6 right-6 p-4 glass rounded-xl border-white/10 flex justify-between items-end backdrop-blur-md">
                          <div>
                            <span className="inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase bg-neon-green text-black mb-1 tracking-widest font-jakarta">
                              Broadcasting Now
                            </span>
                            <h4 className="text-sm font-black text-white truncate max-w-md">{activeAds[activeAdIndex].campaign_name}</h4>
                            <p className="text-[9px] text-slate-400 font-bold uppercase truncate mt-0.5">Brand: {activeAds[activeAdIndex].brand_name}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-black text-neon-green uppercase tracking-widest block font-jakarta">
                              Loop {activeAdIndex + 1}/{activeAds.length}
                            </span>
                            <span className="text-[9px] text-slate-500 font-bold uppercase mt-1 block">
                              Duration: {activeAds[activeAdIndex].duration_seconds}s
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Fallback default loop player layout */
                      <div className="text-center p-8 flex flex-col items-center gap-4 bg-gradient-to-br from-[#0c0d0a] to-[#040404] w-full h-full justify-center">
                        <div className="w-12 h-12 rounded-xl bg-logo-red flex items-center justify-center font-black text-white text-2xl shadow-[0_0_20px_rgba(204,0,0,0.5)]">
                          A
                        </div>
                        
                        <div className="space-y-1">
                          <h4 className="text-2xl font-black tracking-tight text-white font-outfit uppercase">
                            ADSVERZ<span className="accent-text">.</span> MEDIA NETWORK
                          </h4>
                          <p className="text-[10px] text-neon-green font-black uppercase tracking-[0.2em] font-jakarta">
                            Digitizing Professional Campus Life
                          </p>
                        </div>

                        <div className="max-w-md glass border-neon-green/20 p-4 rounded-xl mt-4">
                          <p className="text-[11px] text-slate-400 leading-normal font-bold uppercase tracking-wider">
                            Institutional Policy: zero-distraction. Only career-focus hardware updates and cert notifications loop here.
                          </p>
                        </div>

                        <div className="flex items-center gap-2 mt-4 text-[9px] text-slate-600 font-black uppercase tracking-widest">
                          <RefreshCw size={10} className="animate-spin text-neon-green" />
                          Idle Node Feed Active • Awaiting Brand Placements
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Footer Controls */}
                <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <span>Displaying {activeAds.length} approved slots</span>
                  <div className="flex gap-2">
                    {activeAds.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveAdIndex(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition ${
                          idx === activeAdIndex ? 'bg-neon-green' : 'bg-white/10 hover:bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};
