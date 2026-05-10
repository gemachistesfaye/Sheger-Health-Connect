import { useNotification } from '../context/NotificationContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BellIcon } from 'lucide-react';

const NotificationBell = () => {
  const { notifications, clear } = useNotification();
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full hover:bg-white/20 transition-colors"
        title="Notifications"
      >
        <BellIcon className="w-5 h-5 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-xs text-white rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border p-4 z-20"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-gray-700">Notifications</h4>
              <button onClick={clear} className="text-xs text-primary hover:underline">Clear</button>
            </div>
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-500">No new notifications.</p>
            ) : (
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.map((n, i) => (
                  <li key={i} className="text-sm text-gray-800 border-b pb-1">
                    {n.message}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
