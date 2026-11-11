import { useCallback, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import type { User } from '../types/User';
import api from '../services/api';
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token'),
  );
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('purchase');
    sessionStorage.removeItem('lastCompraId');
    window.dispatchEvent(new Event('kicket:clear-purchase'));
  }, []);
  const updateUser = (data: User) => {
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
  };
  const login = (newToken: string, data: User) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(data));
    setToken(newToken);
    setUser(data);
  };
  useEffect(() => {
    let active = true;
    const stored = localStorage.getItem('token');
    if (!stored) {
      setLoading(false);
      return;
    }
    api
      .get<User>('/users/me')
      .then((r) => {
        if (active) {
          setUser(r.data);
          localStorage.setItem('user', JSON.stringify(r.data));
        }
      })
      .catch(() => {
        if (active) logout();
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [logout]);
  useEffect(() => {
    window.addEventListener('kicket:logout', logout);
    return () => window.removeEventListener('kicket:logout', logout);
  }, [logout]);
  return (
    <AuthContext.Provider
      value={{ token, user, loading, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
