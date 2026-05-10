import React from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Download, 
  Plus, 
  CheckCircle2, 
  DollarSign, 
  ArrowUpRight, 
  History,
  ShieldCheck,
  Smartphone
} from 'lucide-react';

const BillingPage = () => {
  const transactions = [
    { id: 'TXN-9021', service: 'General Consultation', date: 'May 12, 2026', amount: 500, status: 'Success' },
    { id: 'TXN-8842', service: 'Lab: Blood Work', date: 'May 05, 2026', amount: 1200, status: 'Success' },
    { id: 'TXN-7731', service: 'Pediatric Visit', date: 'April 28, 2026', amount: 600, status: 'Success' },
    { id: 'TXN-6610', service: 'AI Health Plus (Monthly)', date: 'April 20, 2026', amount: 150, status: 'Success' },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Billing & Payments</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage your health insurance and payment history.</p>
        </div>
        <button className="flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-[24px] font-bold shadow-xl shadow-gray-900/10 hover:scale-105 transition-transform">
          <Plus size={20} />
          Add Payment Method
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
                       {transactions.map((txn) => (
                         <tr key={txn.id} className="hover:bg-gray-50/30 transition-colors group">
                            <td className="px-8 py-6">
                               <p className="font-bold text-gray-900">{txn.id}</p>
                               <p className="text-xs text-gray-400">{txn.date}</p>
                            </td>
                            <td className="px-8 py-6 text-sm font-medium text-gray-600">{txn.service}</td>
                            <td className="px-8 py-6 font-black text-gray-900">{txn.amount} <span className="text-[10px] font-bold">ETB</span></td>
                            <td className="px-8 py-6">
                               <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{txn.status}</span>
                               </div>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
              <div className="mt-8 flex justify-center">
                <button className="text-sm font-bold text-gray-400 hover:text-emerald-600 flex items-center gap-2 transition-all">
                   View Full Statement <ArrowUpRight size={18} />
                </button>
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
                    {/* QR Mockup */}
                    <CreditCard size={64} className="text-emerald-900" />
                 </div>
              </div>
              <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-600/20">
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
    </div>
  );
};

export default BillingPage;
