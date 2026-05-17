import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
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
  Activity,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SidebarItem = ({ icon: Icon, label, to, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => `
        flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative
        ${isActive 
          ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20' 
          : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'}
      `}
    >
      {({ isActive }) => (
        <>
          <Icon size={22} className={isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
          <span className="font-bold text-sm tracking-tight">{label}</span>
          {isActive && (
            <motion.div
              layoutId="active-pill"
              className="absolute -right-2 w-1.5 h-8 bg-emerald-600 rounded-full"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </>
      )}
    </NavLink>
  );
};

const Sidebar = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const getMenuItems = () => {
    switch (user?.role?.toLowerCase()) {
      case 'doctor':
        return [
          { icon: LayoutDashboard, label: t('dashboard.menu.overview'), to: '/doctor/dashboard' },
          { icon: Calendar, label: t('dashboard.menu.appointments'), to: '/doctor/appointments' },
          { icon: MessageSquare, label: 'Messages', to: '/doctor/messages' },
          { icon: Users, label: 'Profile', to: '/doctor/profile' },
          { icon: Settings, label: t('dashboard.menu.settings'), to: '/doctor/settings' },
        ];
      case 'admin':
        return [
          { icon: LayoutDashboard, label: t('dashboard.menu.overview'), to: '/admin/dashboard' },
          { icon: Users, label: 'Manage Doctors', to: '/admin/users' },
          { icon: MessageSquare, label: 'System Messages', to: '/admin/messages' },
          { icon: Activity, label: t('dashboard.menu.billing'), to: '/admin/system' },
          { icon: Settings, label: t('dashboard.menu.settings'), to: '/admin/settings' },
        ];
      default:
        return [
          { icon: LayoutDashboard, label: t('dashboard.menu.overview'), to: '/patient/dashboard' },
          { icon: Calendar, label: t('dashboard.menu.appointments'), to: '/patient/appointments' },
          { icon: FileText, label: t('dashboard.menu.records'), to: '/patient/records' },
          { icon: Users, label: t('dashboard.menu.doctors'), to: '/patient/doctors' },
          { icon: MessageSquare, label: 'Messages', to: '/patient/messages' },
          { icon: Bell, label: t('dashboard.menu.notifications'), to: '/patient/notifications' },
          { icon: CreditCard, label: t('dashboard.menu.billing'), to: '/patient/billing' },
          { icon: Settings, label: t('dashboard.menu.settings'), to: '/patient/settings' },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-gray-900/40 backdrop-blur-md lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-6 left-6 z-[70] h-[calc(100vh-48px)] w-72 
        bg-white/80 backdrop-blur-2xl border border-white/20 rounded-[40px] shadow-2xl
        transition-all duration-500 lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-[120%]'}
      `}>
        <div className="flex flex-col h-full p-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12 px-2">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-600/20 text-white">
              <Activity size={28} />
            </div>
            <div>
              <span className="text-xl font-black text-gray-900 tracking-tighter block leading-none">Sheger</span>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none">Health Connect</span>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="mb-10 p-5 bg-gray-50 rounded-3xl border border-gray-100 flex items-center gap-4 group cursor-pointer hover:bg-white hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg border-4 border-white shadow-md">
              {user?.full_name?.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-black text-gray-900 text-sm truncate">{user?.full_name}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{user?.role} Portal</p>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar pr-2 -mr-2">
            {menuItems.map((item) => (
              <SidebarItem 
                key={item.to}
                {...item}
                onClick={() => window.innerWidth < 1024 && onClose()}
              />
            ))}
          </nav>

          {/* Logout */}
          <button
            onClick={logout}
            className="mt-8 flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all group"
          >
            <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm tracking-tight">{t('auth.logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
