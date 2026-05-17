import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Download, 
  Filter, 
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  Activity,
  HeartPulse
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RecordsPage = () => {
  const { user, token } = useAuth();
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        if (user) {
          const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/records/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success) setRecords(data.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecords();
  }, [token, user]);

  const filteredRecords = records.filter(r => 
    r.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.prescriptions?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Medical Vault</h1>
          <p className="text-gray-500 mt-1 font-medium">Your secure, AI-organized health history.</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
           <ShieldCheck size={20} />
           <span className="text-sm font-bold uppercase tracking-widest">End-to-End Encrypted</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 bg-white border border-gray-100 px-6 py-4 rounded-[24px] flex items-center gap-4 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
          <Search className="text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by diagnosis, medication, or specialist..."
            className="bg-transparent border-none outline-none text-sm font-medium w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="px-8 py-4 bg-white border border-gray-100 rounded-[24px] font-bold text-gray-600 flex items-center gap-2 hover:bg-gray-50 transition-all">
          <Filter size={20} /> Filter
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Main Records List */}
        <div className="lg:col-span-3 space-y-6">
           {isLoading ? (
             <div className="space-y-4">
               {[1, 2, 3].map(i => <div key={i} className="h-40 bg-white rounded-[40px] animate-pulse border border-gray-100" />)}
             </div>
           ) : filteredRecords.length === 0 ? (
             <div className="bg-white rounded-[40px] p-20 text-center border border-gray-100">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-200">
                  <FileText size={48} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">No records found</h3>
                <p className="text-gray-400">Try adjusting your search or contact the clinic if something is missing.</p>
             </div>
           ) : (
             <div className="space-y-6">
                {filteredRecords.map((record) => (
                  <motion.div 
                    layout
                    key={record.id}
                    className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-600/5 transition-all group"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
                      <div className="flex items-start gap-6">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <Stethoscope size={32} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Clinical Diagnosis</p>
                          <h4 className="text-2xl font-black text-gray-900 mb-2">{record.diagnosis}</h4>
                          <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                            <span>Dr. Samuel Kassa</span>
                            <span className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                            <span>{new Date(record.visit_date).toLocaleDateString('default', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                      <button className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-emerald-50 hover:text-emerald-600 transition-all flex items-center gap-2 text-sm font-bold">
                        <Download size={20} /> PDF
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-50 pt-8">
                       <div className="space-y-4">
                          <div className="flex items-center gap-3 text-gray-900">
                             <HeartPulse size={20} className="text-red-400" />
                             <span className="font-black text-sm uppercase tracking-tighter">Treatment Plan</span>
                          </div>
                          <p className="text-gray-500 text-sm leading-relaxed p-6 bg-gray-50 rounded-3xl border border-gray-100">
                            {record.prescriptions || "No medication prescribed for this visit."}
                          </p>
                       </div>
                       <div className="space-y-4">
                          <div className="flex items-center gap-3 text-gray-900">
                             <Activity size={20} className="text-purple-400" />
                             <span className="font-black text-sm uppercase tracking-tighter">Lab Notes & Findings</span>
                          </div>
                          <p className="text-gray-500 text-sm leading-relaxed p-6 bg-gray-50 rounded-3xl border border-gray-100">
                            {record.lab_results || "No laboratory tests were ordered during this visit."}
                          </p>
                       </div>
                    </div>
                  </motion.div>
                ))}
             </div>
           )}
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
           <div className="bg-gray-900 p-8 rounded-[40px] text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <ShieldCheck size={150} />
              </div>
              <h4 className="text-xl font-black mb-6">Health Trends</h4>
              <div className="space-y-6">
                 {[
                   { label: 'Blood Pressure', value: '120/80', status: 'Stable' },
                   { label: 'Blood Sugar', value: '95 mg/dL', status: 'Normal' },
                   { label: 'Cholesterol', value: '180 mg/dL', status: 'Optimal' }
                 ].map((t, i) => (
                   <div key={i}>
                      <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                        <span>{t.label}</span>
                        <span className="text-emerald-400">{t.status}</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <span className="text-xl font-black">{t.value}</span>
                         <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-3/4" />
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-8 py-4 bg-white/10 border border-white/10 rounded-2xl font-bold text-sm hover:bg-white/20 transition-all">
                Full Analytics
              </button>
           </div>

           <div className="bg-emerald-50 p-8 rounded-[40px] border border-emerald-100">
              <h4 className="font-black text-emerald-900 mb-4 flex items-center gap-2 uppercase tracking-tighter">
                <Download size={20} /> Export Summary
              </h4>
              <p className="text-xs text-emerald-700/70 mb-6 leading-relaxed">
                Download a comprehensive health report for your insurance or personal records.
              </p>
              <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-600/20">
                Generate Report
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RecordsPage;
