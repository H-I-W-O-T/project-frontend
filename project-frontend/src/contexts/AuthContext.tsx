import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authStorage } from '../core/auth/authStorage';
import type { UserAuthInfo } from '../core/auth/authStorage';

interface AuthContextType {
  user: UserAuthInfo | null;
  login: (userData: UserAuthInfo) => void;
  logout: () => void;
  isInitialized: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserAuthInfo | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load saved auth info from the separate folder (authStorage)
    const savedUser = authStorage.getAuthInfo();
    if (savedUser) {
      setUser(savedUser);
    }
    setIsInitialized(true);
  }, []);

  const login = (userData: UserAuthInfo) => {
    setUser(userData);
    authStorage.saveAuthInfo(userData);
  };

  const logout = () => {
    setUser(null);
    authStorage.clearAuthInfo();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
};
