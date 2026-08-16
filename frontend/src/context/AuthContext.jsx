import { createContext, useContext, useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [socketToken, setSocketToken] = useState(null);

  const { data: userResponse, isLoading: loading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const data = await api.get('/api/auth/me');
        if (data && data.success) {
          return data.data;
        }
        return null;
      } catch (error) {
        return null;
      }
    },
    staleTime: Infinity,
    retry: false,
  });

  const user = userResponse || null;

  const login = (userData) => {
    queryClient.setQueryData(['authUser'], userData);
  };

  const logout = () => {
    queryClient.setQueryData(['authUser'], null);
    setSocketToken(null);
  };

  // Fetch a short-lived token for Socket.io connections
  const fetchSocketToken = useCallback(async () => {
    try {
      const data = await api.get('/api/auth/socket-token');
      if (data && data.success) {
        setSocketToken(data.data.token);
        return data.data.token;
      }
    } catch (error) {
      console.error('Failed to fetch socket token:', error);
    }
    return null;
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, socketToken, fetchSocketToken }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
