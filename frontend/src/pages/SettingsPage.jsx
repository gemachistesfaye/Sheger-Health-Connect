import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Shield, 
  Bell, 
  Globe, 
  CreditCard, 
  Lock, 
  Smartphone,
  ChevronRight,
  LogOut,
  Trash2,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SettingsSection = ({ icon: Icon, title, desc, children }) => (
  <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
     <div className="flex items-start justify-between">
        <div className="flex gap-6">
           <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Icon size={28} />
           </div>
           <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">{title}</h3>
              <p className="text-sm text-gray-400 font-medium">{desc}</p>
           </div>
        </div>
     </div>
     <div className="pt-4 space-y-6">
        {children}
     </div>
  </div>
);

const SettingsPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Account Settings</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage your profile, security, and platform preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
           {/* Profile Section */}
           <SettingsSection 
             icon={User} 
             title="Personal Information" 
             desc="Update your name, photo, and basic contact details."
           >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Full Name</label>
                    <input type="text" defaultValue={user?.full_name} className="w-full bg-gray-50 border border-gray-100 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Email Address</label>
                    <input type="email" defaultValue={user?.email} className="w-full bg-gray-50 border border-gray-100 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium" />
                 </div>
              </div>
              <div className="flex justify-end pt-4">
                 <button className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-emerald-600/20 hover:scale-[1.02] transition-transform">Save Changes</button>
              </div>
           </SettingsSection>

           {/* Security Section */}
           <SettingsSection 
             icon={Shield} 
             title="Security & Privacy" 
             desc="Manage your password and two-factor authentication."
           >
              <div className="space-y-4">
                 {[
                   { icon: Lock, label: 'Change Password', status: 'Last changed 3 months ago' },
                   { icon: Smartphone, label: 'Two-Factor Authentication', status: 'Enabled' },
                   { icon: Activity, label: 'Login History', status: 'Addis Ababa, Ethiopia' }
                 ].map((item, idx) => (
                   <button key={idx} className="w-full p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-between hover:bg-white hover:shadow-lg transition-all group">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-emerald-600 transition-colors">
                            <item.icon size={20} />
                         </div>
                         <div className="text-left">
                            <p className="font-bold text-gray-900 text-sm">{item.label}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.status}</p>
                         </div>
                      </div>
                      <ChevronRight size={20} className="text-gray-300" />
                   </button>
                 ))}
              </div>
           </SettingsSection>

           {/* Danger Zone */}
           <div className="bg-red-50 p-10 rounded-[40px] border border-red-100 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                 <h4 className="text-xl font-black text-red-900 mb-2">Delete Account</h4>
                 <p className="text-sm text-red-700/70 max-w-sm">Permanently remove your medical data and account access. This action cannot be undone.</p>
              </div>
              <button className="px-8 py-4 bg-red-600 text-white rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-red-600/20">
                 <Trash2 size={20} /> Delete Data
              </button>
           </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
           <div className="bg-gray-900 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
              <h4 className="text-xl font-black mb-6 flex items-center gap-2">
                 <Globe size={24} className="text-emerald-400" /> Language
              </h4>
              <div className="space-y-3">
                 {['English (US)', 'አማርኛ (Amharic)', 'Oromoo (Afaan Oromo)'].map((l, i) => (
                   <button key={i} className={`w-full p-4 rounded-2xl text-left text-sm font-bold flex items-center justify-between transition-all ${i === 0 ? 'bg-emerald-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                      {l}
                      {i === 0 && <CheckCircle2 size={16} />}
                   </button>
                 ))}
              </div>
           </div>

           <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                 <LogOut size={40} />
              </div>
              <h4 className="font-black text-gray-900 mb-2 uppercase tracking-tighter">Sign Out</h4>
              <p className="text-xs text-gray-400 leading-relaxed mb-8">Ready to leave? We'll save your progress and keep your records safe.</p>
              <button onClick={logout} className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-black text-sm hover:bg-red-100 transition-colors">
                 Log Out Now
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
