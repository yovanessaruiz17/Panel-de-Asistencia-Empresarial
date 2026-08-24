import React, { createContext, useContext, useEffect, useState } from 'react';
import { INITIAL_USERS } from '../constants/mockData';
import { Role, User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  currentRole: Role;
  isAuthenticated: boolean;
  login: (email: string, role?: Role) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: Role) => void;
  hasRole: (roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'yordev_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Default to Super Admin for Phase 1 demo
    } catch {
      return INITIAL_USERS[0];
    }
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [currentUser]);

  const currentRole: Role = currentUser?.rol || 'EMPLOYEE';
  const isAuthenticated = !!currentUser;

  const login = async (email: string, overrideRole?: Role): Promise<boolean> => {
    const foundUser = INITIAL_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      const userToSet = overrideRole ? { ...foundUser, rol: overrideRole } : foundUser;
      setCurrentUser(userToSet);
      return true;
    }

    // Dynamic mock user creation
    const newUser: User = {
      user_id: `USR-${Date.now()}`,
      nombre: email.split('@')[0].replace('.', ' '),
      email,
      rol: overrideRole || 'HR',
      estado: 'ACTIVO',
      creado_en: new Date().toISOString(),
    };
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRole = (role: Role) => {
    const targetUser = INITIAL_USERS.find((u) => u.rol === role) || {
      user_id: `USR-${role.toLowerCase()}`,
      nombre: `Usuario ${role}`,
      email: `${role.toLowerCase()}@yordev.com`,
      rol: role,
      estado: 'ACTIVO' as const,
      creado_en: new Date().toISOString(),
    };
    setCurrentUser(targetUser);
  };

  const hasRole = (roles: Role[]): boolean => {
    if (!currentUser) return false;
    if (currentUser.rol === 'SUPER_ADMIN') return true; // Super Admin has access to all
    return roles.includes(currentUser.rol);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        isAuthenticated,
        login,
        logout,
        switchRole,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
