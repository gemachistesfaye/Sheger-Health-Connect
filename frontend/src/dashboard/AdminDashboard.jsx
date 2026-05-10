import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Activity, 
  DollarSign, 
  Calendar, 
  ArrowUpRight, 
  Settings, 
  ShieldCheck,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/dashboard/StatCard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

const data = [
  { name: 'Mon', patients: 40, revenue: 2400 },
  { name: 'Tue', patients: 30, revenue: 1398 },
  { name: 'Wed', patients: 65, revenue: 9800 },
  { name: 'Thu', patients: 27, revenue: 3908 },
  { name: 'Fri', patients: 48, revenue: 4800 },
  { name: 'Sat', patients: 23, revenue: 3800 },
  { name: 'Sun', patients: 34, revenue: 4300 },
];

const AdminDashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Command Center</h1>
          <p className="text-gray-500 mt-1">System-wide health metrics and management.</p>
        </div>
        <button className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-gray-900/10">
          <ShieldCheck size={20} />
          System Health
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Patients" value="1,248" icon={Users} color="bg-primary" trend={12} />
        <StatCard title="Active Doctors" value="24" icon={Activity} color="bg-blue-500" />
        <StatCard title="Weekly Revenue" value="45,200 ETB" icon={DollarSign} color="bg-emerald-500" trend={8} />
        <StatCard title="Total Appointments" value="856" icon={Calendar} color="bg-purple-500" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-900">Patient Analytics</h3>
            <select className="bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-gray-500 focus:outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorPat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="patients" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorPat)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-900">Revenue Growth</h3>
            <BarChart3 className="text-emerald-500" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[10, 10, 10, 10]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* User & Doctor Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-gray-900">Recent System Activity</h3>
            <button className="text-sm font-bold text-primary">View All Logs</button>
          </div>
          <div className="space-y-4">
             {[
               { user: "Dr. Samuel", action: "Completed Consultation", time: "2 mins ago", type: "medical" },
               { user: "Abebe B.", action: "Registered New Account", time: "15 mins ago", type: "user" },
               { user: "System", action: "Database Backup Success", time: "1 hour ago", type: "system" }
             ].map((log, idx) => (
               <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <Activity size={18} className="text-emerald-600" />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-gray-900">{log.user} <span className="font-medium text-gray-400">{log.action}</span></p>
                        <p className="text-[10px] font-black text-gray-400 uppercase">{log.time}</p>
                     </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-200" />
               </div>
             ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <Users size={120} />
          </div>
          <h4 className="text-xl font-black mb-6">Create Doctor Account</h4>
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            alert('Doctor account created and credentials sent to email.');
          }}>
             <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Doctor Name</label>
                <input type="text" placeholder="Dr. Full Name" className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl outline-none focus:border-emerald-500 text-sm" />
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Official Email</label>
                <input type="email" placeholder="doctor@sheger.care" className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl outline-none focus:border-emerald-500 text-sm" />
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Department</label>
                <select className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl outline-none focus:border-emerald-500 text-sm">
                   <option className="bg-gray-900">General Consultation</option>
                   <option className="bg-gray-900">Cardiology</option>
                   <option className="bg-gray-900">Pediatrics</option>
                </select>
             </div>
             <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-600/20 mt-4">
                Onboard Specialist
             </button>
          </form>
        </motion.div>
      </div>

    </div>
  );
};

export default AdminDashboard;
