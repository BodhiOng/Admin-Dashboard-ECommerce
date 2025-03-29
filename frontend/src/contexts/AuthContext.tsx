"use client"

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { AuthState, LoginCredentials, User } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (options: LoginOptions) => Promise<void>;
  logout: () => void;
}

interface LoginOptions {
  credentials: LoginCredentials;
  rememberMe?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'SET_USER'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

interface AuthResponse {
  success: boolean;
  data: {
    isApplicant: boolean;
    user?: User;
    token?: string;
    message?: string;
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';

    if (token && userStr && rememberMe) {
      try {
        const user = JSON.parse(userStr) as User;
        dispatch({
          type: 'SET_USER',
          payload: { user, token },
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      // Clear storage if not remembered
      if (!rememberMe) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('rememberMe');
      }
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = async ({ credentials, rememberMe = false }: LoginOptions) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      
      if (!response.data.success) {
        throw new Error('Login failed');
      }

      const { isApplicant, user, token, message } = response.data.data;

      if (isApplicant) {
        // Don't store any auth data for applicants
        router.push('/pending-approval');
        return;
      }

      if (!user || !token) {
        throw new Error('Invalid response from server');
      }

      // Store remember me preference
      localStorage.setItem('rememberMe', rememberMe.toString());

      // Store auth data
      if (rememberMe) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }

      // Always set cookie for current session
      document.cookie = `token=${token}; path=/; ${rememberMe ? 'max-age=2592000' : ''}`; // 30 days if remember me

      dispatch({
        type: 'SET_USER',
        payload: { user, token },
      });

      // Force a hard navigation to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    dispatch({ type: 'LOGOUT' });
    router.replace('/login');
  };

  const value = {
    ...state,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
