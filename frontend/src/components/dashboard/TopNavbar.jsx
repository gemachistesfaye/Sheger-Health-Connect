import React from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, Search, Settings, Sparkles, Sun, Moon } from 'lucide-react';
import LanguageSwitcher from '../LanguageSwitcher';
import NotificationBell from '../NotificationBell';
import { useTheme } from '../../context/ThemeContext';

const TopNavbar = ({ onOpenSidebar }) => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="sticky top-6 z-[50] w-full px-6 mb-2" role="banner">
      <div className="h-20 bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl border border-white/20 dark:border-gray-700/20 rounded-[32px] shadow-2xl px-6 flex items-center justify-between">
        <div className="flex items-center gap-6 flex-1">
          <button 
            onClick={onOpenSidebar} 
            className="p-3 text-gray-500 dark:text-gray-400 lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            aria-label="Open navigation menu"
          >
            <Menu size={24} />
          </button>
          <div className="hidden md:flex items-center gap-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 px-6 py-3 rounded-2xl w-full max-w-lg group focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
            <Search size={18} className="text-gray-400 group-focus-within:text-emerald-600" aria-hidden="true" />
            <input 
              type="text" 
              placeholder="Search medical records, specialists, or AI insights..." 
              className="bg-transparent border-none outline-none text-sm font-medium w-full dark:text-gray-200"
              aria-label="Search medical records, specialists, or AI insights"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-bold border border-emerald-100 dark:border-emerald-800" aria-label="AI Diagnosis status: Active">
             <Sparkles size={14} aria-hidden="true" /><span>AI Diagnosis: Active</span>
          </div>
          <div className="w-px h-8 bg-gray-100 dark:bg-gray-700 mx-2 hidden sm:block" aria-hidden="true"></div>
          <button 
            onClick={toggleTheme}
            className="p-3 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
          </button>
          <LanguageSwitcher />
          <NotificationBell />
          <button 
            className="p-3 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all group focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2" 
            aria-label="Settings"
          >
            <Settings size={20} className="group-hover:rotate-90 transition-transform" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
