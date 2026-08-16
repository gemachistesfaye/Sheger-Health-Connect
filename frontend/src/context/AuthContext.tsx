import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  socketToken: string | null;
  login: (userData: User) => void;
  logout: () => void;
  fetchSocketToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [socketToken, setSocketToken] = useState<string | null>(null);

  const { data: userResponse, isLoading: loading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const data = await api.get('/api/auth/me');
        if (data && data.success) {
          return data.data as User;
        }
        return null;
      } catch {
        return null;
      }
    },
    staleTime: Infinity,
    retry: false,
  });

  const user = userResponse || null;

  const login = (userData: User) => {
    queryClient.setQueryData(['authUser'], userData);
  };

  const logout = () => {
    queryClient.setQueryData(['authUser'], null);
    setSocketToken(null);
  };

  const fetchSocketToken = useCallback(async (): Promise<string | null> => {
    try {
      const data = await api.get('/api/auth/socket-token');
      if (data && data.success) {
        const token = (data.data as { token: string }).token;
        setSocketToken(token);
        return token;
      }
    } catch {
      // Failed to fetch socket token
    }
    return null;
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, socketToken, fetchSocketToken }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
