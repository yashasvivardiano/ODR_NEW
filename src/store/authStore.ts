import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  
  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      // Call your backend API
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
      
      const data = await response.json();
      
      const user: User = {
        id: data.user?.id || '1',
        email: data.user?.email || email,
        name: data.user?.fullName || email.split('@')[0],
      };
      
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  signup: async (fullName: string, email: string, password: string) => {
    set({ isLoading: true });
    try {
      // Call your backend API
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email, password }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }
      
      const data = await response.json();
      
      const user: User = {
        id: data.user?.id || Date.now().toString(),
        email: data.user?.email || email,
        name: data.user?.fullName || fullName,
      };
      
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  logout: () => {
    set({ 
      user: null, 
      isAuthenticated: false, 
      isLoading: false 
    });
  },
  
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
