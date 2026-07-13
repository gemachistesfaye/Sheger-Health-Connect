import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  CheckCircle2, 
  DollarSign, 
  Clock, 
  Eye, 
  User, 
  X,
  TrendingUp,
  FileCheck2,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const AdminPayments = () => {
  const { token } = useAuth();
  const [payments, setPayments] = useState([]);
  const [activeSlip, setActiveSlip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/payments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPayments(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchPayments();
  }, [token]);

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/payments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'Paid' })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Payment slip approved successfully!');
        fetchPayments();
      } else {
        toast.error(data.message || 'Approval failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error updating payment status.');
    }
  };

  // Stats calculation
  const totalReceived = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const pendingAmount = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const totalTransactions = payments.length;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Payments & Ledger</h1>
        <p className="text-gray-500 mt-1 font-medium">Verify patient transaction slips and manage clinic revenue flow.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 p-8 rounded-[40px] shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center shadow-md">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Total Approved Revenue</p>
            <p className="text-3xl font-black text-gray-900 tracking-tighter mt-1">{totalReceived.toLocaleString()} <span className="text-xs font-bold text-emerald-600">ETB</span></p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-8 rounded-[40px] shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center shadow-md">
            <Clock size={28} className="animate-pulse" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Pending Verification</p>
            <p className="text-3xl font-black text-gray-900 tracking-tighter mt-1">{pendingAmount.toLocaleString()} <span className="text-xs font-bold text-amber-500">ETB</span></p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-8 rounded-[40px] shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center shadow-md">
            <CreditCard size={28} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Total Slip Submissions</p>
            <p className="text-3xl font-black text-gray-900 tracking-tighter mt-1">{totalTransactions} <span className="text-xs font-bold text-blue-500">Slips</span></p>
          </div>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Revenue Operations Ledger</h3>
          <span className="text-xs font-black bg-gray-50 text-gray-500 px-4 py-2 rounded-full border border-gray-100">Live Verification Feed</span>
        </div>
        
        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <th className="px-8 py-4">Transaction ID</th>
              <th className="px-8 py-4">Patient Name</th>
              <th className="px-8 py-4">Amount</th>
              <th className="px-8 py-4">Slip Reference</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="px-8 py-10 text-center text-gray-400 font-medium">Fetching payment ledger feed...</td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-8 py-10 text-center text-gray-400 font-medium">No transaction records submitted.</td>
              </tr>
            ) : (
              payments.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="font-bold text-gray-900">TXN-{txn.id}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <Calendar size={12} />
                      {new Date(txn.created_at || txn.createdAt).toLocaleString()}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                        {txn.patient_name.charAt(0)}
                      </div>
                      <span className="font-bold text-gray-900 text-sm">{txn.patient_name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-black text-gray-900">{parseFloat(txn.amount).toLocaleString()} <span className="text-[10px] font-bold text-emerald-600">ETB</span></td>
                  <td className="px-8 py-6">
                    {txn.screenshot ? (
                      <button 
                        onClick={() => setActiveSlip(txn)}
                        className="flex items-center gap-2 text-xs font-black text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl transition-all border border-emerald-100"
                      >
                        <Eye size={14} />
                        View Slip
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 font-semibold italic">No Slip Uploaded</span>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${txn.status === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${txn.status === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {txn.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {txn.status === 'Pending' ? (
                      <button 
                        onClick={() => handleApprove(txn.id)}
                        className="flex items-center gap-1.5 ml-auto text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/10 transition-all hover:scale-105"
                      >
                        <FileCheck2 size={14} />
                        Verify & Approve
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 justify-end text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl w-fit ml-auto">
                        <CheckCircle2 size={14} /> Approved
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Slip Viewer Lightbox Modal */}
      <AnimatePresence>
        {activeSlip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[40px] border border-gray-100 shadow-2xl p-8 max-w-2xl w-full relative overflow-hidden"
            >
              <button 
                onClick={() => setActiveSlip(null)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-2xl transition-all"
              >
                <X size={20} />
              </button>
              
              <h3 className="text-2xl font-black text-gray-900 mb-1 uppercase tracking-tight">Verify Payment Screenshot</h3>
              <p className="text-xs text-gray-400 mb-6 font-medium">Submitted by: <strong className="text-gray-950 font-black">{activeSlip.patient_name}</strong> &bull; Amount: <strong className="text-emerald-600 font-black">{parseFloat(activeSlip.amount).toLocaleString()} ETB</strong></p>

              <div className="bg-gray-50 rounded-3xl p-4 border border-gray-100 flex items-center justify-center mb-6 overflow-hidden max-h-96">
                <img 
                  src={activeSlip.screenshot} 
                  alt="Transaction confirmation slip" 
                  className="max-h-80 object-contain rounded-2xl shadow-sm"
                />
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setActiveSlip(null)}
                  className="flex-1 py-4 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-2xl font-black text-sm transition-all"
                >
                  Close Viewer
                </button>
                {activeSlip.status === 'Pending' && (
                  <button 
                    onClick={() => {
                      const id = activeSlip.id;
                      setActiveSlip(null);
                      handleApprove(id);
                    }}
                    className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={18} />
                    Approve Payment
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPayments;
