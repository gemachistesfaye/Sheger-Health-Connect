import React, { useState, useRef, useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Info } from 'lucide-react';

const NotificationBell = () => {
  const { notifications, clear } = useNotification();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.length;

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2.5 bg-gray-50 border border-gray-100 text-gray-500 hover:bg-gray-100 rounded-2xl transition-all relative group focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        title="Notifications"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Bell size={20} className="group-hover:rotate-12 transition-transform" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-bounce" aria-hidden="true" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-gray-100 rounded-[32px] shadow-2xl z-50 overflow-hidden"
            role="menu"
            aria-label="Notifications list"
          >
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <div>
                <h4 className="font-bold text-gray-900">Notifications</h4>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">You have {unreadCount} unread</p>
              </div>
              <button 
                onClick={() => { clear(); setOpen(false); }}
                className="text-xs font-bold text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
              >
                Clear All
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto no-scrollbar p-2">
              {notifications.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="text-gray-200" size={32} aria-hidden="true" />
                  </div>
                  <p className="text-sm font-bold text-gray-500">All caught up!</p>
                </div>
              ) : (
                <div className="space-y-1" role="list">
                  {notifications.map((n, i) => (
                    <motion.div 
                      key={i}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="p-4 rounded-2xl hover:bg-gray-50 transition-colors flex gap-4 border border-transparent hover:border-gray-100"
                      role="listitem"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                        <Info size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 leading-relaxed font-medium">{n.message}</p>
                        <span className="text-[10px] text-gray-400 font-bold">Just now</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50/50 border-t border-gray-50 text-center">
              <button className="text-xs font-bold text-gray-500 hover:text-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 rounded-lg px-3 py-1">
                View All Notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
