import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getFromStorage, removeFromStorage, setInStorage } from '../utils/storage';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  email: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    setLoading(true);
    try {
      const accessToken = getFromStorage('accessToken');
      if (!accessToken) {
        setIsAuthenticated(false);
        setUsername(null);
        setEmail(null);
        setLoading(false);
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUsername(data.username || data.email);
        setEmail(data.email);
        setIsAuthenticated(true);
      } else {
        removeFromStorage('accessToken');
        removeFromStorage('refreshToken');
        setIsAuthenticated(false);
        setUsername(null);
        setEmail(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setUsername(null);
      setEmail(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    setInStorage('accessToken', data.accessToken);
    setInStorage('refreshToken', data.refreshToken);
    setUsername(data.username || email);
    setEmail(email);
    setIsAuthenticated(true);
  };

  const register = async (username: string, email: string, password: string) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const data = await response.json();
    setInStorage('accessToken', data.accessToken);
    setInStorage('refreshToken', data.refreshToken);
    setUsername(username);
    setEmail(email);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      const refreshToken = getFromStorage('refreshToken');
      if (refreshToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeFromStorage('accessToken');
      removeFromStorage('refreshToken');
      setIsAuthenticated(false);
      setUsername(null);
      setEmail(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      username,
      email,
      loading,
      login,
      register,
      logout,
      checkAuth,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
