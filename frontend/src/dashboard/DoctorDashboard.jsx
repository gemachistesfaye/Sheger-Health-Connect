import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  Clock, 
  Search, 
  FileEdit, 
  CheckCircle2, 
  MoreVertical, 
  Stethoscope,
  Activity,
  User,
  Plus,
  Filter,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/dashboard/StatCard';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('schedule');

  const appointments = [
    { id: 1, patient: 'Kebede Kassahun', time: '09:00 AM', type: 'General Checkup', status: 'In Progress' },
    { id: 2, patient: 'Sara Tadesse', time: '10:30 AM', type: 'Follow-up', status: 'Waiting' },
    { id: 3, patient: 'Yonas Abebe', time: '01:00 PM', type: 'Consultation', status: 'Scheduled' },
    { id: 4, patient: 'Marta G.', time: '02:30 PM', type: 'Lab Review', status: 'Scheduled' },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Clinical Workspace</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage your patients, schedules, and medical authoring.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live: 4 Patients Waiting</span>
           </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Today's Appointments" value="12" icon={Calendar} color="bg-primary" />
        <StatCard title="Patients Seen" value="8" icon={CheckCircle2} color="bg-emerald-500" />
        <StatCard title="Avg. Consultation" value="18m" icon={Clock} color="bg-blue-500" />
        <StatCard title="Medical Reports" value="15" icon={FileEdit} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Schedule & Patients */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-50">
                 {['schedule', 'patients', 'reports'].map((tab) => (
                   <button
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={`flex-1 py-6 font-bold text-sm uppercase tracking-widest transition-all
                       ${activeTab === tab ? 'text-emerald-600 bg-emerald-50/30' : 'text-gray-400 hover:text-gray-600'}
                     `}
                   >
                     {tab}
                   </button>
                 ))}
              </div>

              <div className="p-8">
                 {activeTab === 'schedule' && (
                   <div className="space-y-6">
                      {appointments.map((app) => (
                        <div key={app.id} className="flex items-center justify-between p-6 bg-gray-50/50 border border-gray-100 rounded-3xl group hover:bg-white hover:shadow-xl hover:shadow-emerald-600/5 transition-all">
                           <div className="flex items-center gap-6">
                              <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center text-gray-900 shadow-sm">
                                 <span className="text-xs font-black">{app.time.split(' ')[0]}</span>
                                 <span className="text-[10px] font-bold text-gray-400 uppercase">{app.time.split(' ')[1]}</span>
                              </div>
                              <div>
                                 <h4 className="font-bold text-gray-900">{app.patient}</h4>
                                 <p className="text-xs text-gray-400 font-medium">{app.type}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-6">
                              <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest
                                ${app.status === 'In Progress' ? 'bg-emerald-100 text-emerald-600' : 
                                  app.status === 'Waiting' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}
                              `}>
                                 {app.status}
                              </span>
                              <button className="p-3 bg-white border border-gray-100 rounded-xl text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                                 <Stethoscope size={18} />
                              </button>
                           </div>
                        </div>
                      ))}
                   </div>
                 )}

                 {activeTab === 'patients' && (
                   <div className="space-y-4">
                      <div className="flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 mb-6">
                         <Search size={18} className="text-gray-400" />
                         <input type="text" placeholder="Search my assigned patients..." className="bg-transparent border-none outline-none text-sm font-medium w-full" />
                      </div>
                      {[1, 2, 3].map(i => (
                         <div key={i} className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-sm">AB</div>
                               <div>
                                  <p className="font-bold text-gray-900 text-sm">Patient #{i}042</p>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last Visit: 2 Weeks Ago</p>
                               </div>
                            </div>
                            <button className="text-emerald-600 font-bold text-xs hover:underline">View History</button>
                         </div>
                      ))}
                   </div>
                 )}
              </div>
           </div>
        </div>

        {/* Right: Record Editor Preview */}
        <div className="space-y-8">
           <div className="bg-gray-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <ClipboardList size={150} />
              </div>
              <h4 className="text-xl font-black mb-6">Active Diagnosis</h4>
              <div className="space-y-6 relative z-10">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Patient Details</label>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                       <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-xs font-bold">KK</div>
                       <span className="font-bold text-sm">Kebede Kassahun</span>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Diagnosis Notes</label>
                    <textarea 
                       placeholder="Enter clinical observations..." 
                       className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-emerald-500 transition-all resize-none"
                    />
                 </div>
                 <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-600/20">
                    Finalize & Prescribe
                 </button>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
              <h4 className="font-black text-gray-900 mb-6 uppercase tracking-tighter flex items-center gap-2">
                <Activity size={20} className="text-emerald-500" />
                Department Stats
              </h4>
              <div className="space-y-6">
                 {[
                   { label: 'Patient Satisfaction', val: '98%', color: 'bg-emerald-500' },
                   { label: 'Report Accuracy', val: '100%', color: 'bg-blue-500' },
                   { label: 'Wait Time', val: '12m', color: 'bg-orange-500' }
                 ].map((s, i) => (
                   <div key={i}>
                      <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                         <span>{s.label}</span>
                         <span className="text-gray-900">{s.val}</span>
                      </div>
                      <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                         <div className={`h-full ${s.color} w-3/4`} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
