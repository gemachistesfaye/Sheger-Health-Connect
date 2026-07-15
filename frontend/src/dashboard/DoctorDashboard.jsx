import React, { useState, useEffect } from 'react';
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
import { api } from '../lib/api';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('schedule');
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [stats, setStats] = useState({ todayAppointments: 0, patientsSeen: 0, avgConsultation: '0m', medicalReports: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const fetchDashboardData = async () => {
      try {
        const [appointmentsRes, contactsRes] = await Promise.all([
          api.get('/api/v1/appointments?limit=20', { signal: controller.signal }),
          api.get('/api/v1/messages/contacts', { signal: controller.signal })
        ]);

        if (appointmentsRes.success) {
          setAppointments(appointmentsRes.data || []);
        }
        if (contactsRes.success) {
          setPatients(contactsRes.data || []);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Failed to load dashboard data:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    return () => controller.abort();
  }, []);

  const formatTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return 'N/A';
    try {
      const date = new Date(`${dateStr}T${timeStr}`);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return timeStr;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-emerald-100 text-emerald-700';
      case 'Pending': return 'bg-orange-100 text-orange-700';
      case 'Completed': return 'bg-blue-100 text-blue-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Clinical Workspace</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage your patients, schedules, and medical authoring.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {appointments.filter(a => a.status === 'Pending' || a.status === 'Confirmed').length} Patients Waiting
              </span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Appointments" value={appointments.length.toString()} icon={Calendar} color="bg-primary" />
        <StatCard title="Confirmed" value={appointments.filter(a => a.status === 'Confirmed').length.toString()} icon={CheckCircle2} color="bg-emerald-500" />
        <StatCard title="Completed" value={appointments.filter(a => a.status === 'Completed').length.toString()} icon={FileEdit} color="bg-blue-500" />
        <StatCard title="My Patients" value={patients.length.toString()} icon={Users} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-50">
                 {['schedule', 'patients'].map((tab) => (
                   <button
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-6 font-bold text-sm uppercase tracking-widest transition-all
                        ${activeTab === tab ? 'text-emerald-600 bg-emerald-50/30' : 'text-gray-500 hover:text-gray-700'}
                      `}
                   >
                      {tab}
                   </button>
                 ))}
              </div>

              <div className="p-8">
                 {activeTab === 'schedule' && (
                   <div className="space-y-6">
                      {appointments.length === 0 ? (
                        <div className="text-center py-12">
                          <Calendar className="mx-auto text-gray-300 mb-3" size={36} />
                          <p className="text-sm text-gray-500 font-semibold">No appointments yet</p>
                          <p className="text-xs text-gray-400 mt-1">Appointments will appear here once patients book with you.</p>
                        </div>
                      ) : (
                        appointments.map((app) => (
                          <div key={app.id} className="flex items-center justify-between p-6 bg-gray-50/50 border border-gray-100 rounded-3xl group hover:bg-white hover:shadow-xl hover:shadow-emerald-600/5 transition-all">
                             <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center text-gray-900 shadow-sm">
                                   <span className="text-xs font-black">{formatTime(app.appointment_date, app.appointment_time).split(' ')[0]}</span>
                                   <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{formatTime(app.appointment_date, app.appointment_time).split(' ')[1]}</span>
                                </div>
                                <div>
                                   <h4 className="font-bold text-gray-900">{app.Patient?.full_name || 'Patient'}</h4>
                                   <p className="text-xs text-gray-500 font-medium">{app.department}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-6">
                                <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(app.status)}`}>
                                   {app.status}
                                </span>
                                <button className="p-3 bg-white border border-gray-100 rounded-xl text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                                   <Stethoscope size={18} />
                                </button>
                             </div>
                          </div>
                        ))
                      )}
                   </div>
                 )}

                 {activeTab === 'patients' && (
                   <div className="space-y-4">
                      <div className="flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 mb-6">
                         <Search size={18} className="text-gray-500" />
                         <input type="text" placeholder="Search my assigned patients..." className="bg-transparent border-none outline-none text-sm font-medium w-full" />
                      </div>
                      {patients.length === 0 ? (
                        <div className="text-center py-12">
                          <Users className="mx-auto text-gray-300 mb-3" size={36} />
                          <p className="text-sm text-gray-500 font-semibold">No patients yet</p>
                          <p className="text-xs text-gray-400 mt-1">Patients who book with you will appear here.</p>
                        </div>
                      ) : (
                        patients.map((patient) => (
                          <div key={patient.id} className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-sm">
                                  {patient.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                   <p className="font-bold text-gray-900 text-sm">{patient.full_name}</p>
                                   <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{patient.role}</p>
                                </div>
                             </div>
                             <button className="text-emerald-600 font-bold text-xs hover:underline">View History</button>
                          </div>
                        ))
                      )}
                   </div>
                 )}
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <div className="bg-gray-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <ClipboardList size={150} />
              </div>
              <h4 className="text-xl font-black mb-6">Quick Actions</h4>
              <div className="space-y-4 relative z-10">
                <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2">
                  <FileEdit size={18} />
                  Create Medical Record
                </button>
                <button className="w-full py-4 bg-white/10 text-white rounded-2xl font-bold text-sm border border-white/10 flex items-center justify-center gap-2 hover:bg-white/20 transition-all">
                  <Calendar size={18} />
                  View Full Schedule
                </button>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
              <h4 className="font-black text-gray-900 mb-6 uppercase tracking-tighter flex items-center gap-2">
                <Activity size={20} className="text-emerald-500" />
                Overview
              </h4>
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                       <span>Appointments</span>
                       <span className="text-gray-900">{appointments.length}</span>
                    </div>
                    <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (appointments.length / 10) * 100)}%` }} />
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                       <span>Patients</span>
                       <span className="text-gray-900">{patients.length}</span>
                    </div>
                    <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, (patients.length / 10) * 100)}%` }} />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
