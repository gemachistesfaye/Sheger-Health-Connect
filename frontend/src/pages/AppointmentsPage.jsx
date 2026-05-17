import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MoreVertical, 
  Plus, 
  ChevronRight,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AppointmentBooking from '../components/AppointmentBooking';

const AppointmentsPage = () => {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setAppointments(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [token]);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Appointments</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage your clinical visits and consultations.</p>
        </div>
        <button 
          onClick={() => setIsBookingOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-[24px] font-bold shadow-xl shadow-emerald-600/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={20} />
          New Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Upcoming & Past List */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="text-emerald-500" size={20} />
              Upcoming Visits
            </h3>
            
            {isLoading ? (
               <div className="space-y-4">
                 {[1, 2].map(i => <div key={i} className="h-32 bg-white rounded-[32px] animate-pulse border border-gray-100" />)}
               </div>
            ) : appointments.filter(a => a.status !== 'Completed' && a.status !== 'Cancelled').length === 0 ? (
              <div className="bg-white rounded-[40px] p-16 text-center border border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                  <CalendarIcon size={40} />
                </div>
                <p className="text-gray-500 font-bold">No upcoming appointments found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.filter(a => a.status !== 'Completed' && a.status !== 'Cancelled').map((app) => (
                  <motion.div 
                    layout
                    key={app.id}
                    className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-xl hover:shadow-emerald-600/5 transition-all group"
                  >
                    <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex flex-col items-center justify-center text-emerald-600 border border-emerald-100">
                        <span className="text-[10px] font-black uppercase tracking-tighter">
                          {new Date(app.appointment_date).toLocaleString('default', { month: 'short' })}
                        </span>
                        <span className="text-xl font-black">
                          {new Date(app.appointment_date).getDate()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{app.department}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-400 font-medium">
                          <span className="flex items-center gap-1"><Clock size={14} /> {app.appointment_time}</span>
                          <span className="flex items-center gap-1"><MapPin size={14} /> Sheger Clinic HQ</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <span className={`px-4 py-2 rounded-full text-xs font-bold ${
                        app.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' :
                        app.status === 'Pending' ? 'bg-orange-50 text-orange-600' :
                        'bg-red-50 text-red-600'
                      }`}>
                        {app.status}
                      </span>
                      <button className="p-3 hover:bg-gray-50 rounded-xl transition-colors">
                        <MoreVertical size={20} className="text-gray-300" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <CheckCircle2 className="text-gray-300" size={20} />
              Appointment History
            </h3>
            <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden">
               {appointments.filter(a => a.status === 'Completed' || a.status === 'Cancelled').length === 0 ? (
                 <p className="p-12 text-center text-gray-400 font-medium">No past appointments recorded.</p>
               ) : (
                 <table className="w-full text-left">
                    <thead className="bg-gray-50/50">
                      <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <th className="px-8 py-4">Specialist</th>
                        <th className="px-8 py-4">Date</th>
                        <th className="px-8 py-4">Status</th>
                        <th className="px-8 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {appointments.filter(a => a.status === 'Completed' || a.status === 'Cancelled').map((app) => (
                        <tr key={app.id} className="hover:bg-gray-50/30 transition-colors">
                          <td className="px-8 py-6">
                             <p className="font-bold text-gray-900">{app.department}</p>
                             <p className="text-xs text-gray-400">Regular Visit</p>
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-sm font-medium text-gray-600">{new Date(app.appointment_date).toLocaleDateString()}</p>
                          </td>
                          <td className="px-8 py-6">
                             <span className={`text-[10px] font-black uppercase tracking-widest ${app.status === 'Completed' ? 'text-emerald-500' : 'text-red-400'}`}>
                               {app.status}
                             </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <button className="text-emerald-600 font-bold text-xs hover:underline">Rebook</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               )}
            </div>
          </section>
        </div>

        {/* Right: Sidebar Info */}
        <div className="space-y-8">
           <div className="bg-emerald-600 p-8 rounded-[40px] text-white shadow-2xl shadow-emerald-600/20 relative overflow-hidden">
             <div className="absolute -right-10 -bottom-10 opacity-10">
               <CalendarIcon size={200} />
             </div>
             <h4 className="text-xl font-black mb-4">Telemedicine Guide</h4>
             <ul className="space-y-4 mb-8">
                {[
                  "Stable internet connection",
                  "Private, quiet space",
                  "List of your symptoms",
                  "ID card ready"
                ].map((t, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium">
                    <CheckCircle2 size={16} className="text-emerald-300" /> {t}
                  </li>
                ))}
             </ul>
             <button className="w-full py-4 bg-white text-emerald-600 rounded-2xl font-black text-sm hover:scale-[1.02] transition-transform">
               Read Instructions
             </button>
           </div>

           <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
             <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
               <AlertCircle className="text-orange-500" size={20} />
               Cancellation Policy
             </h4>
             <p className="text-sm text-gray-500 leading-relaxed">
               Please cancel at least <strong>24 hours</strong> before your scheduled time to avoid a cancellation fee.
             </p>
           </div>
        </div>
      </div>

      {/* Booking Modal Overlay */}
      <AnimatePresence>
        {isBookingOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-md"
              onClick={() => setIsBookingOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="bg-emerald-600 p-8 text-white flex justify-between items-center">
                <h2 className="text-2xl font-black">Schedule Visit</h2>
                <button onClick={() => setIsBookingOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <XCircle size={24} />
                </button>
              </div>
              <div className="max-h-[70vh] overflow-y-auto no-scrollbar">
                <AppointmentBooking onBookingSuccess={() => {
                   fetchAppointments();
                   setTimeout(() => setIsBookingOpen(false), 2000);
                }} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppointmentsPage;
