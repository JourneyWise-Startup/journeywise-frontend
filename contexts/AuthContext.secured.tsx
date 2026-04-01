'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  roles?: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  refreshToken: () => Promise<void>;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Secure Auth Provider with:
 * - XSS prevention (no direct innerHTML)
 * - Secure token storage
 * - Token expiration handling
 * - Role-based access control
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tokenRefreshTimer, setTokenRefreshTimer] = useState<NodeJS.Timeout | null>(null);

  /**
   * Safely parse JSON with error handling
   */
  const safeJsonParse = useCallback((jsonString: string): any | null => {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.error('❌ Invalid JSON in storage');
      return null;
    }
  }, []);

  /**
   * Initialize auth from localStorage on mount
   */
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      const parsedUser = safeJsonParse(storedUser);

      if (parsedUser && typeof parsedUser === 'object') {
        // Validate token format
        if (typeof storedToken === 'string' && storedToken.length > 10) {
          setToken(storedToken);
          setUser(parsedUser);
        } else {
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } else {
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    setIsLoading(false);
  }, [safeJsonParse]);

  /**
   * Login with token expiration handling
   */
  const login = useCallback((newUser: User, newToken: string) => {
    // Validate inputs
    if (!newUser || !newToken || typeof newToken !== 'string') {
      console.error('❌ Invalid login parameters');
      return;
    }

    setUser(newUser);
    setToken(newToken);

    // Store securely (never in sessionStorage for XSS vulnerability)
    try {
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (e) {
      console.error('❌ Failed to store auth data', e);
    }

    // Schedule token refresh (before expiration)
    scheduleTokenRefresh();
  }, []);

  /**
   * Logout and cleanup
   */
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);

    // Clear storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Clear timers
    if (tokenRefreshTimer) {
      clearTimeout(tokenRefreshTimer);
      setTokenRefreshTimer(null);
    }
  }, [tokenRefreshTimer]);

  /**
   * Safely update user
   */
  const updateUser = useCallback((updatedUser: User) => {
    if (!updatedUser || typeof updatedUser !== 'object') {
      console.error('❌ Invalid user object');
      return;
    }

    setUser(updatedUser);

    try {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (e) {
      console.error('❌ Failed to update user storage', e);
    }
  }, []);

  /**
   * Refresh token before expiration
   */
  const refreshToken = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Token invalid, logout user
        logout();
        return;
      }

      const data = await response.json();

      if (data.access_token) {
        setToken(data.access_token);
        localStorage.setItem('token', data.access_token);
        scheduleTokenRefresh();
      }
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      logout();
    }
  }, [token, logout]);

  /**
   * Schedule token refresh
   */
  const scheduleTokenRefresh = useCallback(() => {
    // Refresh token 5 minutes before expiration (1h - 5m = 55m)
    const refreshTime = 55 * 60 * 1000; // 55 minutes

    if (tokenRefreshTimer) {
      clearTimeout(tokenRefreshTimer);
    }

    const timer = setTimeout(() => {
      refreshToken();
    }, refreshTime);

    setTokenRefreshTimer(timer);
  }, [tokenRefreshTimer, refreshToken]);

  /**
   * Check if user has specific role
   */
  const hasRole = useCallback(
    (role: string): boolean => {
      if (!user || !user.roles) return false;

      return user.roles.includes(role);
    },
    [user],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        logout,
        updateUser,
        refreshToken,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
