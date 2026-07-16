import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  Shield, 
  Trash2,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import ConfirmModal from '../../components/ConfirmModal';
import api from '../../lib/api';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ full_name: '', username: '', password: '', specialization: 'General' });
  const [banConfirm, setBanConfirm] = useState({ open: false, id: null, banned: false });
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  // Fetch doctors
  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const data = await api.get('/api/admin/doctors');
      if (data.success) setDoctors(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleOnboard = async (e) => {
    e.preventDefault();
    try {
      const data = await api.post('/api/admin/doctors', newDoctor);
      if (data.success) {
        toast.success('Doctor onboarded successfully!');
        setIsModalOpen(false);
        setNewDoctor({ full_name: '', username: '', password: '', specialization: 'General' });
        fetchDoctors();
      } else {
        toast.error(data.message || 'Onboarding failed');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  const handleToggleBan = async (id, currentBannedStatus) => {
    setBanConfirm({ open: true, id, banned: currentBannedStatus });
  };

  const confirmToggleBan = async () => {
    const { id, banned } = banConfirm;
    setBanConfirm({ open: false, id: null, banned: false });
    try {
      const data = await api.put(`/api/admin/doctors/${id}/ban`, { banned: !banned });
      if (data.success) {
        toast.success(data.message || `Doctor ${banned ? 'unbanned' : 'banned'} successfully`);
        fetchDoctors();
      } else {
        toast.error(data.message || 'Action failed');
      }
    } catch (err) {
      toast.error('Failed to connect to server');
    }
  };

  const handleDeleteDoctor = async (id) => {
    setDeleteConfirm({ open: true, id });
  };

  const confirmDeleteDoctor = async () => {
    const { id } = deleteConfirm;
    setDeleteConfirm({ open: false, id: null });
    try {
      const data = await api.delete(`/api/admin/doctors/${id}`);
      if (data.success) {
        toast.success('Doctor deleted successfully');
        fetchDoctors();
      } else {
        toast.error(data.message || 'Delete failed');
      }
    } catch (err) {
      toast.error('Failed to connect to server');
    }
  };

  const filteredDoctors = doctors.filter(doc => 
    (doc.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     doc.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     doc.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Doctor Management</h1>
          <p className="text-gray-500 font-medium">Verified medical professionals on the ShegerHealth platform.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-emerald-600/20 hover:scale-105 transition-transform"
        >
          <UserPlus size={20} />
          Onboard New Doctor
        </button>
      </div>

      {/* Onboarding Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-lg rounded-[40px] p-10 shadow-2xl relative"
          >
            <h2 className="text-2xl font-black text-gray-900 mb-2">Onboard Specialist</h2>
            <p className="text-gray-500 mb-8 font-medium">Create a new doctor account for the platform.</p>
            
            <form onSubmit={handleOnboard} className="space-y-4">
               <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl outline-none focus:border-emerald-500 text-sm font-medium" 
                    value={newDoctor.full_name}
                    onChange={(e) => setNewDoctor({...newDoctor, full_name: e.target.value})}
                    required 
                  />
               </div>
               <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">Username</label>
                  <input 
                    type="text" 
                    className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl outline-none focus:border-emerald-500 text-sm font-medium" 
                    value={newDoctor.username}
                    onChange={(e) => setNewDoctor({...newDoctor, username: e.target.value})}
                    required 
                  />
               </div>
               <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">Password</label>
                  <input 
                    type="password" 
                    className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl outline-none focus:border-emerald-500 text-sm font-medium" 
                    value={newDoctor.password}
                    onChange={(e) => setNewDoctor({...newDoctor, password: e.target.value})}
                    required 
                  />
               </div>
               <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">Specialization</label>
                  <select 
                    className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl outline-none focus:border-emerald-500 text-sm font-medium"
                    value={newDoctor.specialization}
                    onChange={(e) => setNewDoctor({...newDoctor, specialization: e.target.value})}
                  >
                    <option value="General">General Consultation</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Neurology">Neurology</option>
                  </select>
               </div>
               
               <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-600/20"
                  >
                    Onboard Now
                  </button>
               </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 bg-white border border-gray-100 px-6 py-4 rounded-[24px] flex items-center gap-4 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
          <Search className="text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, email, or department..."
            className="bg-transparent border-none outline-none text-sm font-medium w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="px-8 py-4 bg-gray-50 text-gray-600 rounded-[24px] font-bold flex items-center gap-2 hover:bg-gray-100 transition-all border border-gray-100">
          <Filter size={20} /> Filter Dept
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto table-responsive">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Specialist</th>
                <th className="px-8 py-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-8 py-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-8 py-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined Date</th>
                <th className="px-8 py-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-400 font-bold">Synchronizing medical directory...</p>
                  </td>
                </tr>
              ) : filteredDoctors.length > 0 ? (
                filteredDoctors.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                          {doc.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{doc.full_name}</p>
                          <p className="text-xs text-gray-400">{doc.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">
                         {doc.specialization || 'General'}
                       </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        {doc.banned ? (
                          <>
                            <XCircle size={16} className="text-red-500" />
                            <span className="text-xs font-bold text-red-600">Banned</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={16} className="text-emerald-500" />
                            <span className="text-xs font-bold text-emerald-600">Active</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-500 font-medium">{new Date(doc.created_at).toLocaleDateString()}</td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleToggleBan(doc.id, doc.banned)}
                          className={`p-2.5 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${doc.banned ? 'focus:ring-red-500' : 'focus:ring-emerald-500'} ${
                            doc.banned 
                              ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                              : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={doc.banned ? "Unban Doctor" : "Ban Doctor"}
                          aria-label={doc.banned ? "Unban doctor" : "Ban doctor"}
                        >
                          <Shield size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteDoctor(doc.id)}
                          className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          title="Delete Doctor"
                          aria-label="Delete doctor"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-gray-500 font-bold">No doctors found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal 
        isOpen={banConfirm.open}
        onClose={() => setBanConfirm({ open: false, id: null, banned: false })}
        onConfirm={confirmToggleBan}
        title={banConfirm.banned ? "Unban Doctor?" : "Ban Doctor?"}
        message={banConfirm.banned ? "This will restore the doctor's access to the platform." : "This will revoke the doctor's access to the platform. They will not be able to log in."}
        confirmText={banConfirm.banned ? "Unban" : "Ban"}
        cancelText="Cancel"
        type={banConfirm.banned ? "info" : "danger"}
      />

      <ConfirmModal 
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, id: null })}
        onConfirm={confirmDeleteDoctor}
        title="Delete Doctor?"
        message="This will permanently delete this doctor account and all associated data. This action cannot be undone."
        confirmText="Delete Permanently"
        cancelText="Keep Account"
        type="danger"
      />
    </div>
  );
};

export default DoctorManagement;
