import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!token || !user) return;
    const socket = io(`${import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001'}`, {
      auth: { token }
    });

    // Join personal room for this user
    socket.emit('join', user.id);

    socket.on('notification', (payload) => {
      setNotifications((prev) => [...prev, payload]);
    });

    return () => {
      socket.disconnect();
    };
  }, [token, user]);

  const clear = () => setNotifications([]);

  return (
    <NotificationContext.Provider value={{ notifications, clear }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
