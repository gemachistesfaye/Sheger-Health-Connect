import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo credentials
const DEMO_USERS = [
  { id: '1', email: 'admin@shegercare.com', password: 'admin123', name: 'Dr. Abebe Kebede', role: 'admin' as const },
  { id: '2', email: 'staff@shegercare.com', password: 'staff123', name: 'Nurse Tigist Haile', role: 'staff' as const },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('sheger-care-user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password: _, ...userData } = foundUser;
      setUser(userData);
      localStorage.setItem('sheger-care-user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sheger-care-user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
