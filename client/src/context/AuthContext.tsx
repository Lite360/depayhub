import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { apiFetch } from '../services/api';

export type Role = 'SUBSCRIBER' | 'VENDOR' | 'ADMIN';

export interface User {
  id: string;
  username: string;
  fullName?: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and restore session
    const initAuth = async () => {
      const token = localStorage.getItem('depayhub_token');
      if (token) {
        try {
          // Fetch user profile to verify token (requires an endpoint in backend)
          // For now, we'll decode the user from token or rely on a generic /api/auth/me if we build it
          const res = await apiFetch('/auth/me'); 
          setUser(res.user);
        } catch (err) {
          console.error("Token invalid, clearing session.");
          localStorage.removeItem('depayhub_token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('depayhub_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('depayhub_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
