import React from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, Search, Settings, SearchIcon, Sparkles } from 'lucide-react';
import LanguageSwitcher from '../LanguageSwitcher';
import NotificationBell from '../NotificationBell';

const TopNavbar = ({ onOpenSidebar }) => {
  const { t } = useTranslation();

  return (
    <header className="sticky top-6 z-[50] w-full px-6 mb-2">
      <div className="h-20 bg-white/60 backdrop-blur-2xl border border-white/20 rounded-[32px] shadow-2xl px-6 flex items-center justify-between">
        {/* Mobile Toggle & Search */}
        <div className="flex items-center gap-6 flex-1">
          <button 
            onClick={onOpenSidebar}
            className="p-3 text-gray-500 lg:hidden hover:bg-gray-100 rounded-2xl transition-colors"
          >
            <Menu size={24} />
          </button>

          <div className="hidden md:flex items-center gap-4 bg-gray-50/50 border border-gray-100 px-6 py-3 rounded-2xl w-full max-w-lg group focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
            <Search size={18} className="text-gray-400 group-focus-within:text-emerald-600" />
            <input 
              type="text" 
              placeholder="Search medical records, specialists, or AI insights..."
              className="bg-transparent border-none outline-none text-sm font-medium w-full"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-100">
             <Sparkles size={14} />
             <span>AI Diagnosis: Active</span>
          </div>

          <div className="w-px h-8 bg-gray-100 mx-2 hidden sm:block"></div>
          
          <LanguageSwitcher />
          <NotificationBell />
          
          <button className="p-3 text-gray-500 hover:bg-gray-100 rounded-2xl transition-all group">
            <Settings size={20} className="group-hover:rotate-90 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
