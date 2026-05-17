import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Download, 
  Plus, 
  CheckCircle2, 
  DollarSign, 
  ArrowUpRight, 
  History,
  ShieldCheck,
  Smartphone,
  Upload,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BillingPage = () => {
  const { user, token } = useAuth();
  const [payments, setPayments] = useState([]);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [screenshot, setScreenshot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPayments = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPayments(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) fetchPayments();
  }, [token]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshot(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitSlip = async (e) => {
    e.preventDefault();
    if (!amount || !screenshot) return alert('Please enter amount and upload screenshot!');
    
    setIsSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: parseFloat(amount), screenshot })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setIsSubmitOpen(false);
        setAmount('');
        setScreenshot('');
        fetchPayments();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Connection error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Billing & Payments</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage your health insurance and payment history.</p>
        </div>
        <button 
          onClick={() => setIsSubmitOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-[24px] font-bold shadow-xl shadow-emerald-600/10 hover:scale-105 transition-transform"
        >
          <Upload size={20} />
          Submit Payment Slip
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Billing Content */}
        <div className="lg:col-span-2 space-y-10">
           {/* Card Overview */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-emerald-600 p-8 rounded-[40px] text-white shadow-2xl shadow-emerald-600/20 relative overflow-hidden h-64 flex flex-col justify-between">
                 <div className="absolute top-0 right-0 p-8 opacity-10">
                   <CreditCard size={120} />
                 </div>
                 <div className="flex justify-between items-start">
                   <Smartphone size={32} />
                   <span className="text-[10px] font-black uppercase tracking-widest border border-white/20 px-3 py-1 rounded-full">Primary Method</span>
                 </div>
                 <div>
                   <p className="text-xs opacity-70 mb-1">Current Balance</p>
                   <p className="text-4xl font-black tracking-tighter">2,450.00 <span className="text-sm font-bold">ETB</span></p>
                 </div>
              </div>

              <div className="bg-white border border-gray-100 p-8 rounded-[40px] shadow-sm flex flex-col justify-between h-64">
                 <div className="flex justify-between items-start">
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                       <DollarSign size={24} />
                    </div>
                    <button className="text-xs font-bold text-primary hover:underline">Manage Wallet</button>
                 </div>
                 <div>
                    <h4 className="font-bold text-gray-900 mb-2">Auto-Refill: Enabled</h4>
                    <p className="text-sm text-gray-400 mb-4 leading-relaxed">Funds will be added automatically from TeleBirr when balance is below 100 ETB.</p>
                    <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 w-3/4" />
                    </div>
                 </div>
              </div>
           </div>

           {/* Transaction History */}
           <section>
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <History className="text-gray-300" size={20} />
                Recent Transactions
              </h3>
              <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
                 <table className="w-full text-left">
                    <thead className="bg-gray-50/50">
                       <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <th className="px-8 py-4">Transaction ID</th>
                          <th className="px-8 py-4">Service</th>
                          <th className="px-8 py-4">Amount</th>
                          <th className="px-8 py-4">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {payments.length === 0 ? (
                         <tr>
                           <td colSpan="4" className="px-8 py-6 text-center text-gray-400 font-medium">No transaction slips submitted yet.</td>
                         </tr>
                       ) : (
                         payments.map((txn) => (
                           <tr key={txn.id} className="hover:bg-gray-50/30 transition-colors group">
                              <td className="px-8 py-6">
                                 <p className="font-bold text-gray-900">TXN-{txn.id}</p>
                                 <p className="text-xs text-gray-400">{new Date(txn.created_at || txn.createdAt).toLocaleDateString()}</p>
                              </td>
                              <td className="px-8 py-6 text-sm font-medium text-gray-600">Medical Service / Consultation</td>
                              <td className="px-8 py-6 font-black text-gray-900">{txn.amount} <span className="text-[10px] font-bold">ETB</span></td>
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-2">
                                    <div className={`w-2.5 h-2.5 rounded-full ${txn.status === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${txn.status === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                      {txn.status}
                                    </span>
                                 </div>
                              </td>
                           </tr>
                         ))
                       )}
                    </tbody>
                 </table>
              </div>
           </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
           <div className="bg-emerald-50 p-8 rounded-[40px] border border-emerald-100 text-emerald-900">
              <h4 className="font-black mb-4 uppercase tracking-tighter">Quick Payment</h4>
              <p className="text-xs text-emerald-700/70 mb-8 leading-relaxed">Scan this QR to pay directly using <strong>TeleBirr</strong>, <strong>CBE Birr</strong>, or <strong>Amole</strong>.</p>
              <div className="bg-white p-6 rounded-3xl flex items-center justify-center border border-emerald-200 mb-8 shadow-sm">
                 <div className="w-32 h-32 bg-gray-50 flex items-center justify-center opacity-30">
                    <CreditCard size={64} className="text-emerald-900" />
                 </div>
              </div>
              <button 
                onClick={() => setIsSubmitOpen(true)}
                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-600/20"
              >
                 Pay Outstanding Balance
              </button>
           </div>

           <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center mb-6">
                 <ShieldCheck size={32} />
              </div>
              <h4 className="font-black text-gray-900 mb-2 uppercase tracking-tighter">Secure Checkout</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                 Your financial data is protected by bank-level encryption. We never store your full card details.
              </p>
           </div>
        </div>
      </div>

      {/* Submit Payment Slip Modal */}
      <AnimatePresence>
        {isSubmitOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[40px] border border-gray-100 shadow-2xl p-8 max-w-md w-full relative overflow-hidden"
            >
              <button 
                onClick={() => setIsSubmitOpen(false)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-2xl transition-all"
              >
                <X size={20} />
              </button>
              
              <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Submit Payment Slip</h3>
              <p className="text-xs text-gray-400 mb-6 leading-relaxed">Upload a screenshot of your TeleBirr or CBE Birr payment slip to credit your clinic balance.</p>

              <form onSubmit={handleSubmitSlip} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Amount (ETB)</label>
                  <input 
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount paid"
                    className="w-full bg-gray-50 border border-gray-100 px-5 py-4 rounded-2xl text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Payment Screenshot</label>
                  <div className="border-2 border-dashed border-gray-100 hover:border-emerald-300 rounded-[24px] p-6 flex flex-col items-center justify-center cursor-pointer transition-colors relative min-h-36">
                    {screenshot ? (
                      <div className="w-full flex flex-col items-center gap-2">
                        <img src={screenshot} alt="Payment slip" className="max-h-32 object-contain rounded-xl" />
                        <button type="button" onClick={() => setScreenshot('')} className="text-xs font-bold text-red-500 hover:underline">Remove Image</button>
                      </div>
                    ) : (
                      <>
                        <Upload size={32} className="text-gray-300 mb-3" />
                        <span className="text-xs font-bold text-gray-500 mb-1">Click to Upload Slip Image</span>
                        <span className="text-[10px] text-gray-400">PNG, JPG or JPEG files only</span>
                        <input 
                          type="file"
                          accept="image/*"
                          required
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </>
                    )}
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Submitting slip...' : 'Submit Payment Slip'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BillingPage;
