import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { motion } from 'framer-motion';
import { getMediaUrl } from '../../utils/mediaHelper';
import { 
  CheckCircle2, XCircle, Clock, Users, Building, Monitor, 
  HelpCircle, Sparkles, MessageSquare, AlertCircle, Plus
} from 'lucide-react';

export const AdminDashboard = ({ initialTab = 'overview' }) => {
  const [activeTab, setActiveTab] = useState(initialTab); // 'overview', 'campaigns', 'support', 'screens'

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  const [stats, setStats] = useState({
    total_hospitals: 0,
    total_brands: 0,
    total_screens: 0,
    total_campaigns: 0,
    active_campaigns: 0,
    active_screens: 0,
    tickets_open: 0
  });
  const [campaigns, setCampaigns] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [brands, setBrands] = useState([]);
  const [screens, setScreens] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Screen creation (Admin version)
  const [hospId, setHospId] = useState('');
  const [screenId, setScreenId] = useState('');
  const [screenName, setScreenName] = useState('');
  const [screenLoc, setScreenLoc] = useState('');
  const [screenSize, setScreenSize] = useState('55 inch');
  const [screenType, setScreenType] = useState('TV');
  const [screenError, setScreenError] = useState('');
  const [screenSuccess, setScreenSuccess] = useState('');

  // Ticket reply state
  const [replyTicketId, setReplyTicketId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, campRes, hospRes, brandRes, screenRes, ticketRes] = await Promise.all([
        axios.get('/api/v1/admin/stats'),
        axios.get('/api/v1/admin/campaigns'),
        axios.get('/api/v1/admin/hospitals'),
        axios.get('/api/v1/admin/brands'),
        axios.get('/api/v1/admin/screens'),
        axios.get('/api/v1/support/')
      ]);
      setStats(statsRes.data);
      setCampaigns(campRes.data);
      setHospitals(hospRes.data);
      setBrands(brandRes.data);
      setScreens(screenRes.data);
      setTickets(ticketRes.data);
    } catch (err) {
      console.error("Error loading admin console details", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, statusVal) => {
    try {
      await axios.post(`/api/v1/admin/campaigns/${id}/status`, { status: statusVal });
      fetchAdminData();
    } catch (err) {
      alert('Failed to update campaign status.');
    }
  };

  const handleRegisterScreen = async (e) => {
    e.preventDefault();
    setScreenError('');
    setScreenSuccess('');

    if (!hospId || !screenId || !screenName) {
      setScreenError('Please select a target hospital, provide screen ID, and display name.');
      return;
    }

    try {
      await axios.post('/api/v1/admin/screens', {
        hospital_id: parseInt(hospId),
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
      setHospId('');
      fetchAdminData();
    } catch (err) {
      setScreenError(err.response?.data?.detail || 'Screen registration failed.');
    }
  };

  const handleReplyTicket = async (e) => {
    e.preventDefault();
    if (!replyText) return;

    setReplyLoading(true);
    try {
      await axios.post(`/api/v1/support/${replyTicketId}/reply`, {
        admin_reply: replyText,
        status: 'closed' // Auto close on reply in v1 for simplicity
      });
      setReplyText('');
      setReplyTicketId(null);
      fetchAdminData();
    } catch (err) {
      alert('Failed to send reply.');
    } finally {
      setReplyLoading(false);
    }
  };

  const pendingCampaigns = campaigns.filter(c => c.status === 'pending');

  return (
    <DashboardLayout title="Admin Console">
      {/* Mini tabs */}
      <div className="flex gap-4 border-b border-white/5 pb-4 mb-8 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition ${
            activeTab === 'overview' ? 'accent-bg text-black' : 'glass text-slate-400 hover:text-white'
          }`}
        >
          Network Overview
        </button>
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition ${
            activeTab === 'campaigns' ? 'accent-bg text-black' : 'glass text-slate-400 hover:text-white'
          }`}
        >
          Campaign Reviews ({pendingCampaigns.length})
        </button>
        <button
          onClick={() => setActiveTab('screens')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition ${
            activeTab === 'screens' ? 'accent-bg text-black' : 'glass text-slate-400 hover:text-white'
          }`}
        >
          Display Nodes ({screens.length})
        </button>
        <button
          onClick={() => setActiveTab('support')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition ${
            activeTab === 'support' ? 'accent-bg text-black' : 'glass text-slate-400 hover:text-white'
          }`}
        >
          Tickets ({tickets.filter(t => t.status !== 'closed').length} open)
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-2 border-neon-green border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* TAB 1: SYSTEM OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-10">
              
              {/* Counters */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass p-8 rounded-[2rem] border-white/10 hover:border-neon-green/20 hover:shadow-[0_15px_30px_rgba(222,255,154,0.02)] transition-all duration-300 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">Brands</span>
                    <Building size={16} className="text-slate-500" />
                  </div>
                  <h3 className="text-5xl font-black mt-4 font-outfit tracking-tighter text-white">{stats.total_brands}</h3>
                </div>

                <div className="glass p-8 rounded-[2rem] border-white/10 hover:border-neon-green/20 hover:shadow-[0_15px_30px_rgba(222,255,154,0.02)] transition-all duration-300 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">Campuses</span>
                    <Users size={16} className="text-slate-500" />
                  </div>
                  <h3 className="text-5xl font-black mt-4 font-outfit tracking-tighter text-white">{stats.total_hospitals}</h3>
                </div>

                <div className="glass p-8 rounded-[2rem] border-white/10 hover:border-neon-green/20 hover:shadow-[0_15px_30px_rgba(222,255,154,0.02)] transition-all duration-300 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">Screens</span>
                    <Monitor size={16} className="text-slate-500" />
                  </div>
                  <h3 className="text-5xl font-black mt-4 font-outfit tracking-tighter text-white">{stats.total_screens}</h3>
                </div>

                <div className="glass p-8 rounded-[2rem] border-neon-green/10 hover:border-neon-green/20 hover:shadow-[0_15px_30px_rgba(222,255,154,0.05)] transition-all duration-300 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-neon-green">Active Loops</span>
                    <Sparkles size={16} className="text-neon-green" />
                  </div>
                  <h3 className="text-5xl font-black mt-4 text-neon-green font-outfit tracking-tighter">{stats.active_campaigns}</h3>
                </div>
              </div>

              {/* Brands and Hospitals list summary */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Brand List */}
                <div className="glass rounded-3xl border-white/5 overflow-hidden">
                  <div className="p-6 border-b border-white/5">
                    <h3 className="text-sm font-black uppercase font-outfit">Registered Brands ({brands.length})</h3>
                  </div>
                  {brands.length === 0 ? (
                    <p className="p-6 text-slate-500 text-xs font-bold uppercase">No brands registered.</p>
                  ) : (
                    <div className="divide-y divide-white/5 max-h-80 overflow-y-auto">
                      {brands.map(brand => (
                        <div key={brand.id} className="p-5 flex justify-between items-center text-xs font-bold uppercase">
                          <span className="text-white font-black">{brand.company_name}</span>
                          <span className="text-[10px] text-slate-500">ID: {brand.id}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Hospital List */}
                <div className="glass rounded-3xl border-white/5 overflow-hidden">
                  <div className="p-6 border-b border-white/5">
                    <h3 className="text-sm font-black uppercase font-outfit">Campus Members ({hospitals.length})</h3>
                  </div>
                  {hospitals.length === 0 ? (
                    <p className="p-6 text-slate-500 text-xs font-bold">No campuses registered.</p>
                  ) : (
                    <div className="divide-y divide-white/5 max-h-80 overflow-y-auto">
                      {hospitals.map(hosp => (
                        <div key={hosp.id} className="p-5 flex justify-between items-center text-xs font-bold uppercase">
                          <span className="text-white font-black">{hosp.hospital_name}</span>
                          <span className="text-[10px] text-slate-500">ID: {hosp.id}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: CAMPAIGN REVIEWS */}
          {activeTab === 'campaigns' && (
            <div className="space-y-6">
              <h3 className="text-xl font-black uppercase font-outfit">Pending Approvals ({pendingCampaigns.length})</h3>

              {pendingCampaigns.length === 0 ? (
                <div className="glass p-12 text-center text-slate-500 text-xs font-bold uppercase tracking-wider rounded-3xl border-white/5">
                  All submitted campaigns have been reviewed!
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingCampaigns.map(camp => (
                    <div
                      key={camp.id}
                      className="glass p-6 rounded-3xl border-white/5 flex flex-col gap-6"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Campaign Review Request</span>
                          <h4 className="text-lg font-black text-white mt-1">{camp.name}</h4>
                          <p className="text-xs text-slate-400 font-bold uppercase mt-1">
                            Brand: <span className="text-white">{camp.brand_company_name}</span> • Target: <span className="text-white">{camp.hospital_name}</span>
                          </p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">
                            Schedule: {camp.start_date} to {camp.end_date}
                          </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-3 shrink-0">
                          <button
                            onClick={() => handleUpdateStatus(camp.id, 'rejected')}
                            className="glass px-5 py-3 rounded-xl text-red-400 border-red-500/20 hover:bg-red-500/10 hover:text-red-300 font-black text-xs uppercase tracking-widest flex items-center gap-1.5 transition"
                          >
                            <XCircle size={14} />
                            Reject
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(camp.id, 'approved')}
                            className="accent-bg px-5 py-3 rounded-xl text-black font-black text-xs uppercase tracking-widest flex items-center gap-1.5 hover:scale-105 transition shadow-lg shadow-neon-green/10"
                          >
                            <CheckCircle2 size={14} />
                            Approve
                          </button>
                        </div>
                      </div>

                      {/* Advertisements Media block preview */}
                      <div className="border-t border-white/5 pt-4">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-3">Linked Media Attachments</span>
                        {camp.advertisements?.length === 0 ? (
                          <p className="text-xs text-slate-500 font-bold uppercase">No media uploaded for this campaign yet.</p>
                        ) : (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {camp.advertisements.map(ad => (
                              <div key={ad.id} className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/5 group">
                                {ad.media_type === 'video' ? (
                                  <video src={getMediaUrl(ad.media_url)} className="w-full h-full object-cover" muted />
                                ) : (
                                  <img src={getMediaUrl(ad.media_url)} alt="Review Media" className="w-full h-full object-cover" />
                                )}
                                <a 
                                  href={getMediaUrl(ad.media_url)} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-white transition"
                                >
                                  View Media
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DISPLAY NODES */}
          {activeTab === 'screens' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Form: Register Screen (Admin View) */}
              <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6 lg:col-span-1">
                <div>
                  <h3 className="text-xl font-black uppercase font-outfit">Register Display Node</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Add screen to any registered hospital</p>
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
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Hospital Campus</label>
                    <select
                      required
                      value={hospId}
                      onChange={(e) => setHospId(e.target.value)}
                      className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-neon-green focus:outline-none transition uppercase"
                    >
                      <option value="">Select Campus</option>
                      {hospitals.map(h => (
                        <option key={h.id} value={h.id} className="bg-bg-dark">
                          {h.hospital_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Unique Screen ID</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., BMS-04, PESU-03"
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
                      placeholder="e.g., Campus Cafeteria Monitor B"
                      value={screenName}
                      onChange={(e) => setScreenName(e.target.value)}
                      className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-neon-green focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Location Detail</label>
                    <input
                      type="text"
                      placeholder="e.g. Ground floor placement lobby"
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
                        <option value="55 inch">55 inch</option>
                        <option value="65 inch">65 inch</option>
                        <option value="75 inch">75 inch</option>
                        <option value="Standard Billboard">Billboard</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Category</label>
                      <select
                        value={screenType}
                        onChange={(e) => setScreenType(e.target.value)}
                        className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-neon-green focus:outline-none transition"
                      >
                        <option value="TV">TV Screen</option>
                        <option value="Digital Standee">Standee</option>
                        <option value="Kiosk">Interactive Kiosk</option>
                        <option value="Billboard">Large Billboard</option>
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
                <h3 className="text-xl font-black uppercase font-outfit">Display Registry</h3>

                {screens.length === 0 ? (
                  <p className="text-slate-500 font-bold">No screens registered.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {screens.map(screen => (
                      <div
                        key={screen.id}
                        className="glass p-6 rounded-3xl border-white/5 flex flex-col justify-between gap-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-black text-slate-500 uppercase">{screen.screen_id}</span>
                            <h4 className="text-sm font-black text-white mt-1">{screen.name}</h4>
                            <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Location: {screen.location_detail || 'N/A'}</p>
                          </div>
                          
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] font-black uppercase ${
                            screen.is_online ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            {screen.is_online ? 'online' : 'offline'}
                          </span>
                        </div>

                        <div className="pt-3 border-t border-white/5 flex justify-between items-center text-[9px] font-black text-slate-500 uppercase">
                          <span>{screen.screen_type} • {screen.size}</span>
                          <span>Last sync: {new Date(screen.last_sync).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 4: SUPPORT TICKETS */}
          {activeTab === 'support' && (
            <div className="space-y-6">
              <h3 className="text-xl font-black uppercase font-outfit">System Tickets</h3>

              {tickets.length === 0 ? (
                <div className="glass p-12 text-center text-slate-500 text-xs font-bold uppercase tracking-wider rounded-3xl border-white/5">
                  No support tickets found in database.
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
                            Category: {ticket.category}
                          </span>
                          <h4 className="text-sm font-black text-white">{ticket.subject}</h4>
                          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">
                            User: <span className="text-white">{ticket.user_email}</span> • Filed {new Date(ticket.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
                          ticket.status === 'open' 
                            ? 'bg-green-500/10 text-green-400 animate-pulse' 
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
                          <span className="text-[8px] font-black text-neon-green uppercase tracking-widest mb-1.5 block">Response sent</span>
                          <p className="text-xs text-slate-300 normal-case font-medium">{ticket.admin_reply}</p>
                        </div>
                      ) : (
                        <div>
                          {replyTicketId === ticket.id ? (
                            <form onSubmit={handleReplyTicket} className="mt-4 space-y-4">
                              <textarea
                                required
                                rows={3}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write reply and resolve ticket..."
                                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-neon-green focus:outline-none transition"
                              />
                              <div className="flex gap-2">
                                <button
                                  type="submit"
                                  disabled={replyLoading}
                                  className="accent-bg px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition disabled:opacity-50"
                                >
                                  {replyLoading ? 'Sending...' : 'Send Reply'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setReplyTicketId(null)}
                                  className="glass px-4 py-2.5 rounded-xl text-slate-400 hover:text-white font-black text-[10px] uppercase tracking-widest transition"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          ) : (
                            <button
                              onClick={() => { setReplyTicketId(ticket.id); setReplyText(''); }}
                              className="accent-bg px-4 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center gap-1.5 hover:scale-105 transition"
                            >
                              <MessageSquare size={10} />
                              Reply / Close Ticket
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};
