import { createContext, useContext, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState(null);

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
        console.error('Auth fetch error:', error);
        return null;
      }
    },
    staleTime: Infinity,
  });

  const user = userResponse || null;

  const login = (userData, accessToken) => {
    queryClient.setQueryData(['authUser'], userData);
    if (accessToken) setToken(accessToken);
  };

  const logout = () => {
    queryClient.setQueryData(['authUser'], null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
