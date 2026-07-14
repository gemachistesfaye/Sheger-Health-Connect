import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, MessageSquare, User, Bell, FileText } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import TopNavbar from '../components/dashboard/TopNavbar';
import AIAssistant from '../components/AIAssistant';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const getNavLinks = () => {
    const role = user?.role?.toLowerCase();
    if (role === 'admin') {
      return [
        { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/admin/users', icon: User, label: 'Doctors' },
        { to: '/admin/messages', icon: MessageSquare, label: 'Messages' },
        { to: '/admin/payments', icon: FileText, label: 'Payments' },
        { to: '/admin/settings', icon: Bell, label: 'Settings' },
      ];
    }
    if (role === 'doctor') {
      return [
        { to: '/doctor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/doctor/appointments', icon: Calendar, label: 'Appointments' },
        { to: '/doctor/messages', icon: MessageSquare, label: 'Messages' },
        { to: '/doctor/settings', icon: User, label: 'Settings' },
      ];
    }
    return [
      { to: '/patient/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/patient/appointments', icon: Calendar, label: 'Appointments' },
      { to: '/patient/records', icon: FileText, label: 'Records' },
      { to: '/patient/messages', icon: MessageSquare, label: 'Messages' },
      { to: '/patient/settings', icon: User, label: 'Settings' },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen bg-gray-50/30">
      <a 
        href="#dashboard-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:bg-emerald-600 focus:text-white focus:px-6 focus:py-3 focus:rounded-2xl focus:font-bold focus:shadow-xl"
      >
        Skip to main content
      </a>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-72 pt-4 pb-24 lg:pb-8 px-4 md:px-8">
        <TopNavbar onOpenSidebar={() => setSidebarOpen(true)} />

        <main id="dashboard-content" className="mt-8" role="main" aria-label="Dashboard content">
          <Outlet />
        </main>
      </div>

      <AIAssistant />

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-[60] safe-area-bottom" role="navigation" aria-label="Mobile navigation">
        <div className="flex justify-around items-center py-3 px-4">
          {navLinks.slice(0, 5).map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `
                flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all min-w-[60px]
                ${isActive ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-700'}
              `}
              aria-label={link.label}
            >
              {({ isActive }) => (
                <>
                  <link.icon size={22} className={isActive ? 'text-emerald-600' : ''} aria-hidden="true" />
                  <span className="text-xs font-bold">{link.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default DashboardLayout;
