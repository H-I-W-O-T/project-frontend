// src/core/auth/authStorage.ts

const AUTH_KEY = 'vega_app_auth_info';

export interface UserAuthInfo {
  id: string;
  fullName: string;
  email: string;
  role: 'donor' | 'agent' | 'manager';
  token: string;
}

export const authStorage = {
  saveAuthInfo: (data: UserAuthInfo) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
  },
  
  getAuthInfo: (): UserAuthInfo | null => {
    const data = localStorage.getItem(AUTH_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data) as UserAuthInfo;
    } catch {
      return null;
    }
  },
  
  clearAuthInfo: () => {
    localStorage.removeItem(AUTH_KEY);
  }
};