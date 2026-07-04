import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { motion } from 'framer-motion';
import { 
  Plus, Calendar, MapPin, Film, Trash2, HelpCircle, 
  CheckCircle2, XCircle, AlertCircle, Clock, Upload, ArrowRight
} from 'lucide-react';

export const BrandDashboard = ({ initialTab = 'overview' }) => {
  const [activeTab, setActiveTab] = useState(initialTab); // 'overview', 'create', 'support'

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  const [campaigns, setCampaigns] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states - Create Campaign
  const [campName, setCampName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const [campError, setCampError] = useState('');
  const [campSuccess, setCampSuccess] = useState('');

  // Form states - Upload media
  const [uploadCampaignId, setUploadCampaignId] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  // Form states - Tickets
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('technical');
  const [ticketMsg, setTicketMsg] = useState('');
  const [ticketError, setTicketError] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [campRes, hospRes, ticketRes] = await Promise.all([
        axios.get('/api/v1/brands/my-campaigns'),
        axios.get('/api/v1/campaigns/hospitals'),
        axios.get('/api/v1/support/')
      ]);
      setCampaigns(campRes.data);
      setHospitals(hospRes.data);
      setTickets(ticketRes.data);
    } catch (err) {
      console.error("Error loading dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    setCampError('');
    setCampSuccess('');

    if (!campName || !startDate || !endDate || !selectedHospital) {
      setCampError('Please fill in all campaign fields.');
      return;
    }

    try {
      const response = await axios.post('/api/v1/campaigns/', {
        name: campName,
        start_date: startDate,
        end_date: endDate,
        target_hospital_id: parseInt(selectedHospital)
      });
      setCampSuccess(`Campaign "${response.data.name}" created! You can now upload advertisements for it.`);
      setCampName('');
      setStartDate('');
      setEndDate('');
      setSelectedHospital('');
      fetchDashboardData();
      
      // Auto-set the campaign for media upload
      setUploadCampaignId(response.data.id);
    } catch (err) {
      setCampError(err.response?.data?.detail || 'Failed to create campaign.');
    }
  };

  const handleUploadMedia = async (e) => {
    e.preventDefault();
    setUploadError('');
    setUploadSuccess('');

    if (!uploadCampaignId || !uploadFile) {
      setUploadError('Please select a campaign and a media file.');
      return;
    }

    setUploadLoading(true);
    const formData = new FormData();
    formData.append('campaign_id', uploadCampaignId);
    formData.append('file', uploadFile);

    try {
      await axios.post('/api/v1/advertisements/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadSuccess('Media uploaded and linked successfully!');
      setUploadFile(null);
      
      // Reset file input in UI
      const fileInput = document.getElementById('ad-file-input');
      if (fileInput) fileInput.value = '';
      
      fetchDashboardData();
    } catch (err) {
      setUploadError(err.response?.data?.detail || 'Media upload failed.');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteCampaign = async (id) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;

    try {
      await axios.delete(`/api/v1/campaigns/${id}`);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Could not delete campaign.');
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setTicketError('');
    setTicketSuccess('');

    if (!ticketSubject || !ticketMsg) {
      setTicketError('Please provide both subject and message.');
      return;
    }

    try {
      await axios.post('/api/v1/support/', {
        subject: ticketSubject,
        category: ticketCategory,
        message: ticketMsg
      });
      setTicketSuccess('Support ticket filed successfully.');
      setTicketSubject('');
      setTicketMsg('');
      fetchDashboardData();
    } catch (err) {
      setTicketError(err.response?.data?.detail || 'Failed to file ticket.');
    }
  };

  const pendingCampaigns = campaigns.filter(c => c.status === 'pending');
  const approvedCampaigns = campaigns.filter(c => c.status === 'approved');

  return (
    <DashboardLayout title="Brand Dashboard">
      {/* Mini tabs */}
      <div className="flex gap-4 border-b border-white/5 pb-4 mb-8">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition ${
            activeTab === 'overview' ? 'accent-bg text-black' : 'glass text-slate-400 hover:text-white'
          }`}
        >
          My Campaigns
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition ${
            activeTab === 'create' ? 'accent-bg text-black' : 'glass text-slate-400 hover:text-white'
          }`}
        >
          Submit Campaign
        </button>
        <button
          onClick={() => setActiveTab('support')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition ${
            activeTab === 'support' ? 'accent-bg text-black' : 'glass text-slate-400 hover:text-white'
          }`}
        >
          Support Desk ({tickets.length})
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-2 border-neon-green border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-10">
              {/* Counters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-8 rounded-[2rem] border-white/10 hover:border-neon-green/20 hover:shadow-[0_15px_30px_rgba(222,255,154,0.02)] transition-all duration-300">
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">Total Submissions</span>
                  <h3 className="text-5xl font-black mt-3 font-outfit tracking-tighter text-white">{campaigns.length}</h3>
                </div>
                <div className="glass p-8 rounded-[2rem] border-neon-green/10 hover:border-neon-green/20 hover:shadow-[0_15px_30px_rgba(222,255,154,0.05)] transition-all duration-300">
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-neon-green">Active Loops</span>
                  <h3 className="text-5xl font-black mt-3 text-neon-green font-outfit tracking-tighter">{approvedCampaigns.length}</h3>
                </div>
                <div className="glass p-8 rounded-[2rem] border-white/10 hover:border-neon-green/20 hover:shadow-[0_15px_30px_rgba(222,255,154,0.02)] transition-all duration-300">
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-orange-400">Pending Review</span>
                  <h3 className="text-5xl font-black mt-3 text-orange-400 font-outfit tracking-tighter">{pendingCampaigns.length}</h3>
                </div>
              </div>

              {/* Campaign Table */}
              <div className="glass rounded-[2rem] border-white/5 overflow-hidden">
                <div className="p-8 border-b border-white/5 flex justify-between items-center">
                  <h3 className="text-lg font-black uppercase font-outfit">Campaign Directory</h3>
                </div>

                {campaigns.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 text-xs font-bold uppercase tracking-wider">
                    No campaigns submitted yet. Start by clicking "Submit Campaign".
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-bold uppercase tracking-wider">
                      <thead className="bg-white/5 text-slate-400 border-b border-white/5 text-[9px]">
                        <tr>
                          <th className="p-5">Campaign Name</th>
                          <th className="p-5">Target Location</th>
                          <th className="p-5">Start Date</th>
                          <th className="p-5">End Date</th>
                          <th className="p-5">Ad Count</th>
                          <th className="p-5">Status</th>
                          <th className="p-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-slate-300">
                        {campaigns.map((camp) => (
                          <tr key={camp.id} className="hover:bg-white/[0.02] transition">
                            <td className="p-5 font-black text-white">{camp.name}</td>
                            <td className="p-5 flex items-center gap-1.5 normal-case">
                              <MapPin size={12} className="accent-text shrink-0" />
                              {camp.hospital_name || 'Campus'}
                            </td>
                            <td className="p-5">{camp.start_date}</td>
                            <td className="p-5">{camp.end_date}</td>
                            <td className="p-5">
                              {camp.advertisements?.length || 0} File(s)
                            </td>
                            <td className="p-5">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black ${
                                camp.status === 'approved' 
                                  ? 'bg-green-500/10 text-green-400' 
                                  : camp.status === 'rejected' 
                                    ? 'bg-red-500/10 text-red-400' 
                                    : 'bg-orange-500/10 text-orange-400'
                              }`}>
                                {camp.status === 'approved' && <CheckCircle2 size={10} />}
                                {camp.status === 'rejected' && <XCircle size={10} />}
                                {camp.status === 'pending' && <Clock size={10} />}
                                {camp.status}
                              </span>
                            </td>
                            <td className="p-5 text-right">
                              {camp.status === 'pending' && (
                                <button
                                  onClick={() => handleDeleteCampaign(camp.id)}
                                  className="p-2 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                                  title="Delete Campaign"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
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

          {/* TAB 2: CREATE & UPLOAD */}
          {activeTab === 'create' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              
              {/* Form 1: Setup Details */}
              <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6">
                <div>
                  <h3 className="text-xl font-black uppercase font-outfit">1. Setup Campaign</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Specify date slots and target campus</p>
                </div>

                {campError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold">
                    <AlertCircle size={16} />
                    <span>{campError}</span>
                  </div>
                )}
                {campSuccess && (
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-center gap-3 text-neon-green text-xs font-bold">
                    <CheckCircle2 size={16} />
                    <span>{campSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleCreateCampaign} className="space-y-5">
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Campaign Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dell Student Back-to-School Promotion"
                      value={campName}
                      onChange={(e) => setCampName(e.target.value)}
                      className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-neon-green focus:outline-none transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Start Date</label>
                      <input
                        type="date"
                        required
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-neon-green focus:outline-none transition uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">End Date</label>
                      <input
                        type="date"
                        required
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-neon-green focus:outline-none transition uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Target Campus Node</label>
                    <select
                      required
                      value={selectedHospital}
                      onChange={(e) => setSelectedHospital(e.target.value)}
                      className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-neon-green focus:outline-none transition uppercase"
                    >
                      <option value="" className="bg-bg-dark text-slate-400">Select Target Campus</option>
                      {hospitals.map(h => (
                        <option key={h.id} value={h.id} className="bg-bg-dark">
                          {h.hospital_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full accent-bg py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-[1.01] transition flex items-center justify-center gap-3 shadow-lg shadow-neon-green/15"
                  >
                    Setup Campaign Slot
                    <ArrowRight size={14} />
                  </button>
                </form>
              </div>

              {/* Form 2: Media Uploader */}
              <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6">
                <div>
                  <h3 className="text-xl font-black uppercase font-outfit">2. Upload Advertisement Media</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Upload JPEG/PNG/MP4 and link to campaign</p>
                </div>

                {uploadError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold">
                    <AlertCircle size={16} />
                    <span>{uploadError}</span>
                  </div>
                )}
                {uploadSuccess && (
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-center gap-3 text-neon-green text-xs font-bold">
                    <CheckCircle2 size={16} />
                    <span>{uploadSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleUploadMedia} className="space-y-5">
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Select Campaign</label>
                    <select
                      required
                      value={uploadCampaignId}
                      onChange={(e) => setUploadCampaignId(e.target.value)}
                      className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-neon-green focus:outline-none transition uppercase"
                    >
                      <option value="">Select Pending Campaign</option>
                      {pendingCampaigns.map(c => (
                        <option key={c.id} value={c.id} className="bg-bg-dark">
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Choose File</label>
                    <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-8 hover:border-neon-green/30 transition flex flex-col items-center justify-center gap-3 bg-white/[0.01]">
                      <Upload size={32} className="text-slate-500" />
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Drag files here or click to browse</span>
                      <span className="text-[8px] text-slate-600 font-bold">JPEG, PNG, MP4. (Max 15MB)</span>
                      
                      <input
                        id="ad-file-input"
                        type="file"
                        required
                        accept="image/*,video/*"
                        onChange={(e) => setUploadFile(e.target.files[0])}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                    {uploadFile && (
                      <p className="mt-3 text-[10px] text-neon-green font-black uppercase tracking-widest flex items-center gap-1.5">
                        <Film size={12} />
                        Selected: {uploadFile.name} ({(uploadFile.size / (1024 * 1024)).toFixed(2)} MB)
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={uploadLoading}
                    className="w-full accent-bg py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-[1.01] transition flex items-center justify-center gap-3 shadow-lg shadow-neon-green/15 disabled:opacity-50"
                  >
                    {uploadLoading ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Upload Media File
                        <Film size={14} />
                      </>
                    )}
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* TAB 3: SUPPORT */}
          {activeTab === 'support' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Form to submit support query */}
              <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6 lg:col-span-1">
                <div>
                  <h3 className="text-xl font-black uppercase font-outfit">Open Support Ticket</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Get assistance from our network administrators</p>
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
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Subject / Headline</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Campaign media resolution issues"
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-neon-green focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Category</label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-neon-green focus:outline-none transition uppercase"
                    >
                      <option value="technical" className="bg-bg-dark">Technical Issue</option>
                      <option value="content" className="bg-bg-dark">Content Curation</option>
                      <option value="billing" className="bg-bg-dark">Billing Inquiry</option>
                      <option value="account" className="bg-bg-dark">Account Setting</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Detailed Message</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Describe your issue in detail..."
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

              {/* List of existing tickets */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-xl font-black uppercase font-outfit flex items-center gap-2">
                  My Tickets <span className="px-2 py-0.5 rounded bg-white/5 text-xs text-slate-400">{tickets.length}</span>
                </h3>

                {tickets.length === 0 ? (
                  <div className="glass p-12 text-center text-slate-500 text-xs font-bold uppercase tracking-wider rounded-3xl border-white/5">
                    No support tickets created.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tickets.map(ticket => (
                      <motion.div
                        key={ticket.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="glass p-6 rounded-3xl border-white/5 flex flex-col gap-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase bg-white/10 text-slate-400 mb-2">
                              {ticket.category}
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
                          <p className="text-xs text-slate-400 leading-relaxed normal-case font-medium">{ticket.message}</p>
                        </div>

                        {ticket.admin_reply ? (
                          <div className="p-4 bg-neon-green/5 border border-neon-green/10 rounded-2xl">
                            <span className="text-[8px] font-black text-neon-green uppercase tracking-widest mb-1.5 block">Response from Admin</span>
                            <p className="text-xs text-slate-300 leading-relaxed normal-case font-medium">{ticket.admin_reply}</p>
                          </div>
                        ) : (
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Awaiting Admin Response...</p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};
