import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthResponse } from '../services/authService';
import tokenService from '../services/tokenService';

interface AuthContextType {
  authData: AuthResponse | null;
  loading: boolean;
  login: (data: AuthResponse) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  authData: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [authData, setAuthData] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuthData = async () => {
      setLoading(true);
      try {
        const data = await tokenService.getAuthData();
        if (data) {
          setAuthData(data);
        }
      } catch (error) {
        console.error("Could not load auth data.", error);
      } finally {
        setLoading(false);
      }
    };

    loadAuthData();
  }, []);

  const login = async (data: AuthResponse) => {
    setAuthData(data);
    await tokenService.saveAuthData(data);
  };

  const logout = async () => {
    await tokenService.removeAuthData();
    setAuthData(null);
  };

  return (
    <AuthContext.Provider value={{ authData, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
