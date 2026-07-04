import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, User, Building, MapPin, Phone } from 'lucide-react';

export const ProfilePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Brand-specific fields
  const [companyName, setCompanyName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [industry, setIndustry] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Hospital-specific fields
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalType, setHospitalType] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      if (user.role === 'brand') {
        const res = await axios.get('/api/v1/brands/profile');
        setCompanyName(res.data.company_name);
        setGstNumber(res.data.gst_number || '');
        setIndustry(res.data.industry_category || '');
        setContactPhone(res.data.contact_phone || '');
      } else if (user.role === 'hospital') {
        const res = await axios.get('/api/v1/hospitals/profile');
        setHospitalName(res.data.hospital_name);
        setHospitalType(res.data.hospital_type || '');
        setAddress(res.data.address || '');
        setContactPhone(res.data.contact_phone || '');
      }
    } catch (err) {
      console.error("Error loading profile details", err);
      setError("Failed to load profile details.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (user.role === 'brand') {
        await axios.put('/api/v1/brands/profile', {
          company_name: companyName,
          gst_number: gstNumber,
          industry_category: industry,
          contact_phone: contactPhone
        });
      } else if (user.role === 'hospital') {
        await axios.put('/api/v1/hospitals/profile', {
          hospital_name: hospitalName,
          hospital_type: hospitalType,
          address: address,
          contact_phone: contactPhone
        });
      }
      setSuccess('Profile updated successfully.');
      fetchProfile();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile.');
    }
  };

  return (
    <DashboardLayout title="Account Settings">
      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-2 border-neon-green border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="max-w-2xl">
          <div className="glass p-8 md:p-10 rounded-[2.5rem] border-white/5 space-y-6">
            <div>
              <h3 className="text-xl font-black uppercase font-outfit">Manage Profile</h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
                Maintain your account metadata
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-center gap-3 text-neon-green text-xs font-bold">
                <CheckCircle2 size={16} />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Common Account Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    Email Address (Immutable)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user?.email}
                    className="w-full px-5 py-4 rounded-xl bg-white/[0.02] border border-white/5 text-slate-500 text-xs cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    Role Claim
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user?.role?.toUpperCase()}
                    className="w-full px-5 py-4 rounded-xl bg-white/[0.02] border border-white/5 text-slate-500 text-xs cursor-not-allowed font-black"
                  />
                </div>
              </div>

              {/* Brand-Specific profile fields */}
              {user?.role === 'brand' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-neon-green focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                        GST Registration
                      </label>
                      <input
                        type="text"
                        placeholder="29AAAAA0000A1Z1"
                        value={gstNumber}
                        onChange={(e) => setGstNumber(e.target.value)}
                        className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-neon-green focus:outline-none transition uppercase"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                        Industry Category
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. EdTech, Tech Hardware"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-neon-green focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-neon-green focus:outline-none transition"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Hospital-Specific profile fields */}
              {user?.role === 'hospital' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                        Hospital / Campus Name
                      </label>
                      <input
                        type="text"
                        required
                        value={hospitalName}
                        onChange={(e) => setHospitalName(e.target.value)}
                        className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-neon-green focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                        Campus Type
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. University Campus, Specialty Hospital"
                        value={hospitalType}
                        onChange={(e) => setHospitalType(e.target.value)}
                        className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-neon-green focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Campus Location Address
                    </label>
                    <input
                      type="text"
                      placeholder="Street, City, State, ZIP Code"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-neon-green focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Placement Cell / Contact Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="080-XXXXXXXX"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-neon-green focus:outline-none transition"
                    />
                  </div>
                </div>
              )}

              {user?.role === 'admin' && (
                <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl text-xs text-slate-500 leading-relaxed font-bold uppercase tracking-wider">
                  Admin profiles do not have specific metadata attachments. System configurations can be configured inside core environmental values.
                </div>
              )}

              {user?.role !== 'admin' && (
                <button
                  type="submit"
                  className="w-full accent-bg py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-[1.01] transition shadow-lg shadow-neon-green/15"
                >
                  Save Profile Details
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
