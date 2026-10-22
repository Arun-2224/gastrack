import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

export type UserRole = 'ADMIN' | 'MANAGER' | 'DELIVERY_STAFF' | 'INVENTORY_STAFF' | 'MAINTENANCE_STAFF';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  status: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  quickSwitch: (role: UserRole) => Promise<void>;
  hasRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('gastrack_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMe = async () => {
      const storedToken = localStorage.getItem('gastrack_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.get<{ success: boolean; user: User }>('/auth/me');
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          localStorage.removeItem('gastrack_token');
          setToken(null);
        }
      } catch (err) {
        console.error('Session verification failed:', err);
        localStorage.removeItem('gastrack_token');
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMe();
  }, []);

  const login = async (email: string, password = 'Password123!') => {
    setIsLoading(true);
    try {
      const res = await api.post<{ success: boolean; token: string; user: User }>('/auth/login', {
        email,
        password,
      });

      if (res.success && res.token) {
        localStorage.setItem('gastrack_token', res.token);
        setToken(res.token);
        setUser(res.user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('gastrack_token');
    setToken(null);
    setUser(null);
  };

  const quickSwitch = async (role: UserRole) => {
    const roleEmailMap: Record<UserRole, string> = {
      ADMIN: 'admin@gastrack.com',
      MANAGER: 'manager1@gastrack.com',
      DELIVERY_STAFF: 'delivery1@gastrack.com',
      INVENTORY_STAFF: 'inventory1@gastrack.com',
      MAINTENANCE_STAFF: 'maint1@gastrack.com',
    };
    await login(roleEmailMap[role], 'Password123!');
  };

  const hasRole = (...roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        quickSwitch,
        hasRole,
      }}
    >
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
