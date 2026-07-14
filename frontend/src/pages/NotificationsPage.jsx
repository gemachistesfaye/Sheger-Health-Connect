import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Settings, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Info,
  MoreHorizontal,
  Trash2,
  Activity,
  MessageSquare
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

const NotificationsPage = () => {
  const { notifications, clear } = useNotification();

  const getIcon = (type) => {
    switch(type) {
      case 'appointment': return { icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' };
      case 'alert': return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' };
      case 'success': return { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' };
      case 'message': return { icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-50' };
      default: return { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50' };
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Notification Center</h1>
          <p className="text-gray-500 mt-1 font-medium">Stay updated with your clinical alerts and health reminders.</p>
        </div>
        <div className="flex items-center gap-3">
           <button onClick={clear} className="px-6 py-4 bg-white border border-gray-100 rounded-2xl font-bold text-gray-500 hover:text-red-500 transition-all flex items-center gap-2">
             <Trash2 size={18} /> Clear All
           </button>
           <button className="p-4 bg-gray-900 text-white rounded-2xl shadow-xl shadow-gray-900/10 hover:scale-105 transition-transform">
             <Settings size={20} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
           {notifications.length === 0 ? (
             <div className="bg-white rounded-[40px] p-24 text-center border border-dashed border-gray-200">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-200">
                   <Bell size={48} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Inbox is empty</h3>
                <p className="text-gray-500">We'll notify you when something important happens.</p>
             </div>
           ) : (
             <div className="space-y-4">
                {notifications.map((n, i) => {
                  const style = getIcon(n.type || 'info');
                  return (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-emerald-600/5 transition-all flex gap-6 group"
                    >
                      <div className={`w-14 h-14 ${style.bg} ${style.color} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <style.icon size={24} />
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between items-start mb-2">
                             <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Just Now</span>
                            <button className="p-2 text-gray-200 hover:text-gray-400 transition-colors">
                               <MoreHorizontal size={20} />
                            </button>
                         </div>
                         <p className="text-gray-800 font-medium leading-relaxed">{n.message}</p>
                      </div>
                    </motion.div>
                  );
                })}
             </div>
           )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
           <div className="bg-emerald-600 p-10 rounded-[40px] text-white shadow-2xl shadow-emerald-600/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-10">
                <Activity size={150} />
              </div>
              <h4 className="text-xl font-black mb-6">Alert Settings</h4>
              <div className="space-y-6">
                 {[
                   { label: 'Appointment Reminders', active: true },
                   { label: 'Medication Alerts', active: true },
                   { label: 'System Updates', active: false },
                   { label: 'Health Tips', active: true }
                 ].map((s, i) => (
                   <div key={i} className="flex items-center justify-between">
                      <span className="text-sm font-bold opacity-80">{s.label}</span>
                      <div className={`w-10 h-6 rounded-full p-1 transition-colors ${s.active ? 'bg-emerald-400' : 'bg-white/20'}`}>
                         <div className={`w-4 h-4 bg-white rounded-full transition-transform ${s.active ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-3xl flex items-center justify-center mb-6">
                 <Bell size={32} />
              </div>
              <h4 className="font-black text-gray-900 mb-2 uppercase tracking-tighter">Stay Notified</h4>
               <p className="text-xs text-gray-500 leading-relaxed">
                 Enable browser notifications to never miss an important appointment or clinical update from your doctor.
              </p>
              <button className="mt-8 w-full py-4 border border-gray-100 rounded-2xl text-xs font-black text-gray-500 hover:bg-gray-50 transition-colors">
                Enable Browser Alerts
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
