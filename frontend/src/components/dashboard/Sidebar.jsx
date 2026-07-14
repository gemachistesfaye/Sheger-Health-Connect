import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ConfirmModal from '../ConfirmModal';
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Users, 
  MessageSquare, 
  Bell, 
  CreditCard, 
  Settings, 
  LogOut,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SidebarItem = ({ icon: Icon, label, to, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => `
        flex items-center gap-4 px-5 py-4 min-h-[48px] rounded-2xl transition-all duration-300 group relative
        focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
        ${isActive 
          ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20' 
          : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50'}
      `}
      aria-label={label}
    >
      {({ isActive }) => (
        <>
          <Icon size={22} className={isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'} aria-hidden="true" />
          <span className="font-bold text-sm tracking-tight">{label}</span>
        </>
      )}
    </NavLink>
  );
};

const Sidebar = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const getMenuItems = () => {
    switch (user?.role?.toLowerCase()) {
      case 'doctor':
        return [
          { icon: LayoutDashboard, label: t('dashboard.menu.overview'), to: '/doctor/dashboard' },
          { icon: Calendar, label: t('dashboard.menu.appointments'), to: '/doctor/appointments' },
          { icon: MessageSquare, label: t('dashboard.menu.messages'), to: '/doctor/messages' },
          { icon: Users, label: t('dashboard.menu.profile'), to: '/doctor/profile' },
          { icon: Settings, label: t('dashboard.menu.settings'), to: '/doctor/settings' },
        ];
      case 'admin':
        return [
          { icon: LayoutDashboard, label: t('dashboard.menu.overview'), to: '/admin/dashboard' },
          { icon: Users, label: t('dashboard.menu.manageDoctors'), to: '/admin/users' },
          { icon: MessageSquare, label: t('dashboard.menu.systemMessages'), to: '/admin/messages' },
          { icon: CreditCard, label: t('dashboard.menu.billing'), to: '/admin/payments' },
          { icon: Activity, label: t('dashboard.menu.systemStatus'), to: '/admin/system' },
          { icon: Settings, label: t('dashboard.menu.settings'), to: '/admin/settings' },
        ];
      default:
        return [
          { icon: LayoutDashboard, label: t('dashboard.menu.overview'), to: '/patient/dashboard' },
          { icon: Calendar, label: t('dashboard.menu.appointments'), to: '/patient/appointments' },
          { icon: FileText, label: t('dashboard.menu.records'), to: '/patient/records' },
          { icon: Users, label: t('dashboard.menu.doctors'), to: '/patient/doctors' },
          { icon: MessageSquare, label: t('dashboard.menu.messages'), to: '/patient/messages' },
          { icon: Bell, label: t('dashboard.menu.notifications'), to: '/patient/notifications' },
          { icon: CreditCard, label: t('dashboard.menu.billing'), to: '/patient/billing' },
          { icon: Settings, label: t('dashboard.menu.settings'), to: '/patient/settings' },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-gray-900/40 backdrop-blur-md lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside 
        className={`
          fixed top-6 left-6 z-[70] h-[calc(100vh-48px)] w-72 
          bg-white/80 backdrop-blur-2xl border border-white/20 rounded-[40px] shadow-2xl
          transition-all duration-500 lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-[120%]'}
        `}
        role="navigation"
        aria-label="Dashboard navigation"
      >
        <div className="flex flex-col h-full p-8">
          <div className="flex items-center gap-3 mb-12 px-2">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-600/20 text-white" aria-hidden="true">
              <Activity size={28} />
            </div>
            <div>
              <span className="text-xl font-black text-gray-900 tracking-tighter block leading-none">Sheger</span>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none">Health Connect</span>
            </div>
          </div>

          <div className="mb-10 p-5 bg-gray-50 rounded-3xl border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg border-4 border-white shadow-md" aria-hidden="true">
              {user?.full_name?.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-black text-gray-900 text-sm truncate">{user?.full_name}</p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">{user?.role} Portal</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar pr-2 -mr-2">
            {menuItems.map((item) => (
              <SidebarItem 
                key={item.to}
                {...item}
                onClick={() => window.innerWidth < 1024 && onClose()}
              />
            ))}
          </nav>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="mt-8 flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all group focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label={t('auth.logout')}
          >
            <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
            <span className="font-bold text-sm tracking-tight">{t('auth.logout')}</span>
          </button>
        </div>
      </aside>

      <ConfirmModal 
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={logout}
        title="Sign Out?"
        message="Are you sure you want to sign out of Sheger Health Connect? We will save your progress and keep your records secure."
        confirmText="Sign Out"
        cancelText="Stay Logged In"
        type="danger"
      />
    </>
  );
};

export default Sidebar;
