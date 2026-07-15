import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  FileText, 
  Activity, 
  Bell, 
  ArrowUpRight, 
  Clock, 
  User, 
  Stethoscope,
  ChevronRight,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/dashboard/StatCard';
import HealthSmartCards from '../components/dashboard/HealthSmartCards';
import api from '../lib/api';

const PatientDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activePrescriptions, setActivePrescriptions] = useState(0);

  const fetchData = useCallback(async (signal) => {
    try {
      const appData = await api.get('/api/appointments', { signal });
      if (appData.success) setAppointmentCount(appData.data.length);

      if (user) {
        const recData = await api.get(`/api/records/${user.id}`, { signal });
        if (recData.success) {
          setMedicalRecords(recData.data);
          const prescriptionCount = recData.data.filter(r => r.prescriptions && r.prescriptions.trim()).length;
          setActivePrescriptions(prescriptionCount);
        }
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        console.error(e);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, [fetchData]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('dashboard.welcome')}, {user?.full_name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 mt-1">{t('dashboard.subtitle') || "Your health overview is ready for today."}</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
          <Plus size={20} />
          {t('dashboard.bookAppointment')}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" role="region" aria-label="Health statistics">
        <StatCard 
          title={t('dashboard.myAppointments')} 
          value={appointmentCount} 
          icon={Calendar} 
          color="bg-emerald-500" 
          trend={12} 
        />
        <StatCard 
          title={t('dashboard.medicalRecords')} 
          value={medicalRecords.length} 
          icon={FileText} 
          color="bg-blue-500" 
          trend={8} 
        />
        <StatCard 
          title={t('dashboard.prescriptions')} 
          value={activePrescriptions} 
          icon={Activity} 
          color="bg-purple-500" 
          subtext="Active"
        />
        <StatCard 
          title={t('dashboard.healthScore')} 
          value="85%" 
          icon={Bell} 
          color="bg-orange-500" 
          subtext="Good"
        />
      </div>

      {/* Smart Health Cards */}
      <HealthSmartCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area (Left 2/3) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Health Summary Card */}
          <motion.div variants={itemVariants} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Stethoscope size={120} className="text-primary" />
            </div>
            <div className="relative z-10">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Activity className="text-primary" />
                Recent Health Summary
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6" aria-live="polite">
                {[
                  { label: 'Weight', value: '—', unit: 'Not recorded' },
                  { label: 'Height', value: '—', unit: 'Not recorded' },
                  { label: 'Blood Type', value: '—', unit: 'Not recorded' },
                  { label: 'BP', value: '—', unit: 'Not recorded' }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col">
                   <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{item.label}</span>
                   <span className="text-2xl font-bold text-gray-900 tabular-nums">{item.value}</span>
                   <span className="text-xs text-gray-500 font-semibold">{item.unit}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Records Timeline */}
          <motion.div variants={itemVariants} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900">{t('dashboard.recentRecords')}</h2>
              <button className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                View All <ChevronRight size={16} />
              </button>
            </div>
            
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="h-24 bg-gray-50 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : medicalRecords.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl">
                <FileText className="mx-auto text-gray-300 mb-2" size={40} />
                <p className="text-gray-500 font-medium">No medical records found yet.</p>
              </div>
            ) : (
              <div className="space-y-6" aria-live="polite">
                {medicalRecords.slice(0, 3).map((record, idx) => (
                  <div key={record.id} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border-2 border-white group-hover:scale-110 transition-transform">
                        <Clock size={18} />
                      </div>
                      {idx !== medicalRecords.slice(0, 3).length - 1 && (
                        <div className="w-0.5 h-full bg-gray-100 my-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-6 border-b border-gray-50 last:border-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-gray-900">Diagnosis: {record.diagnosis}</h4>
                        <span className="text-xs text-gray-500 font-semibold">
                          {new Date(record.visit_date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-1">{record.prescriptions || 'No medication prescribed'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Sidebar (1/3) */}
        <div className="space-y-8">
          {/* Digital Patient ID */}
          <motion.div variants={itemVariants} className="bg-gray-900 p-8 rounded-[32px] text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
               <Activity size={120} />
            </div>
            <div className="relative z-10 text-center">
               <h3 className="text-lg font-black mb-6 uppercase tracking-tighter text-emerald-400">Digital Patient ID</h3>
               <div className="bg-white p-4 rounded-[24px] inline-block mb-6 shadow-2xl">
                  {/* Mock QR Code */}
                  <div className="w-32 h-32 bg-gray-50 flex items-center justify-center border-4 border-gray-900 rounded-xl">
                     <div className="grid grid-cols-3 gap-1">
                        {[...Array(9)].map((_, i) => (
                          <div key={i} className={`w-6 h-6 rounded-sm ${i % 2 === 0 ? 'bg-gray-900' : 'bg-gray-200'}`} />
                        ))}
                     </div>
                  </div>
               </div>
               <p className="font-black text-xl mb-1">{user?.full_name}</p>
               <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-6">SHC-ID: 9021-4432-88</p>
               <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-bold transition-all">
                  Quick Check-in
               </button>
            </div>
          </motion.div>

          {/* Assigned Doctor Card */}
          <motion.div variants={itemVariants} className="bg-white border border-gray-100 p-8 rounded-[32px] text-gray-900 shadow-sm relative overflow-hidden">
            <h3 className="text-lg font-bold mb-6">Assigned Doctor</h3>
            <div className="text-center py-6">
               <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4 text-gray-300">
                  <User size={32} />
               </div>
               <p className="font-bold text-sm text-gray-900">No Doctor Assigned</p>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">Pending Consultation</p>
            </div>
            <button className="w-full mt-6 py-3 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20">
               Find a Specialist
            </button>
          </motion.div>

          {/* Health Tips Section */}
          <motion.div variants={itemVariants} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Activity className="text-emerald-500" />
              Health Tips
            </h3>
            <div className="space-y-4">
              {[
                { title: 'Hydration', text: 'Drink at least 8 glasses of water today.' },
                { title: 'Movement', text: 'Take a 10-minute walk after lunch.' },
                { title: 'Sleep', text: 'Try to get 8 hours of rest tonight.' }
              ].map((tip, idx) => (
                <div key={idx} className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-50">
                  <h4 className="text-sm font-bold text-emerald-700 mb-1">{tip.title}</h4>
                  <p className="text-xs text-emerald-600/80 leading-relaxed">{tip.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PatientDashboard;
