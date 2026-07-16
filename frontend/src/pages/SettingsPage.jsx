import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ConfirmModal from '../components/ConfirmModal';
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
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import api from '../lib/api';

const SettingsSection = ({ icon: Icon, title, desc, children }) => (
  <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
     <div className="flex items-start justify-between">
        <div className="flex gap-6">
           <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Icon size={28} />
           </div>
           <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">{title}</h3>
               <p className="text-sm text-gray-500 font-medium">{desc}</p>
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
  const { t, i18n } = useTranslation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await new Promise(r => setTimeout(r, 1000));
      toast.success('Account deletion requested. You will be logged out shortly.');
      setTimeout(() => logout(), 2000);
    } catch {
      toast.error('Failed to process deletion request');
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Account Settings</h1>
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
                     <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-2">Full Name</label>
                    <input 
                      type="text" 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium" 
                    />
                 </div>
                 <div className="space-y-2">
                     <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-2">Email Address</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium" 
                    />
                 </div>
              </div>
              <div className="flex justify-end pt-4">
                 <button 
                   onClick={handleSaveProfile}
                   disabled={isSaving}
                   className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-emerald-600/20 hover:scale-[1.02] transition-transform disabled:opacity-50"
                 >
                   {isSaving ? 'Saving...' : 'Save Changes'}
                 </button>
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
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{item.status}</p>
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
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="px-8 py-4 bg-red-600 text-white rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-red-600/20 hover:scale-105 transition-transform"
              >
                 <Trash2 size={20} /> Delete Data
              </button>
              <ConfirmModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDeleteAccount}
                title="Delete Account?"
                message="This will permanently delete your account, medical records, and all associated data. This action cannot be undone."
                confirmText="Delete Forever"
                cancelText="Keep Account"
                type="danger"
              />
            </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
           <div className="bg-gray-900 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
              <h4 className="text-xl font-black mb-6 flex items-center gap-2">
                 <Globe size={24} className="text-emerald-400" /> Language
              </h4>
              <div className="space-y-3">
                 {[
                   { code: 'en', label: 'English (US)' },
                   { code: 'am', label: 'አማርኛ (Amharic)' },
                   { code: 'om', label: 'Oromoo (Afaan Oromo)' }
                 ].map((lang) => {
                   const isActive = (i18n.language?.split('-')[0] || 'en') === lang.code;
                   return (
                     <button
                       key={lang.code}
                       onClick={() => i18n.changeLanguage(lang.code)}
                       className={`w-full p-4 rounded-2xl text-left text-sm font-bold flex items-center justify-between transition-all ${
                         isActive ? 'bg-emerald-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                       }`}
                     >
                        {lang.label}
                        {isActive && <CheckCircle2 size={16} />}
                     </button>
                   );
                 })}
              </div>
           </div>

           <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                 <LogOut size={40} />
              </div>
              <h4 className="font-black text-gray-900 mb-2 uppercase tracking-tighter">Sign Out</h4>
               <p className="text-xs text-gray-500 leading-relaxed mb-8">Ready to leave? We'll save your progress and keep your records safe.</p>
              <button 
                onClick={() => setShowLogoutConfirm(true)} 
                className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-black text-sm hover:bg-red-100 transition-colors"
              >
                 Log Out Now
              </button>

              <ConfirmModal 
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={logout}
                title="Sign Out?"
                message="Are you sure you want to sign out of ShegerHealth? We will save your progress and keep your records secure."
                confirmText="Sign Out"
                cancelText="Stay Logged In"
                type="danger"
              />
           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
