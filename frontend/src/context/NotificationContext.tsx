import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { Notification } from '../types';

interface NotificationContextType {
  notifications: Notification[];
  clear: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user, fetchSocketToken } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user) return;

    let socket: Socket;

    const connect = async () => {
      const token = await fetchSocketToken();
      if (!token) return;

      socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001', {
        auth: { token },
      });

      socketRef.current = socket;

      socket.on('notification', (payload: Notification) => {
        setNotifications((prev) => [...prev, payload]);
      });

      socket.on('connect_error', (err: Error) => {
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

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
