import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user, fetchSocketToken } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    let socket;

    const connect = async () => {
      const token = await fetchSocketToken();
      if (!token) return;

      socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001', {
        auth: { token }
      });

      socketRef.current = socket;

      socket.on('notification', (payload) => {
        setNotifications((prev) => [...prev, payload]);
      });

      socket.on('connect_error', (err) => {
        console.error('Notification socket connection error:', err.message);
      });
    };

    connect();

    return () => {
      if (socket) {
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, [user, fetchSocketToken]);

  const clear = () => setNotifications([]);

  return (
    <NotificationContext.Provider value={{ notifications, clear }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
