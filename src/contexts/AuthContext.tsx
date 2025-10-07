import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { loginUser, logoutUser, registerUser } from '../services/authService';
import { getProfile, updateProfile } from '../services/userService';

interface User {
  username: string;
  email: string;
  bio?: string;
  profile_picture?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (username: string, email: string, password: string, password2: string) => Promise<boolean | undefined>;
  updateUserInfo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const updateUserInfo = async () => {
    try {
      const userData = await getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user data', error);
    }
  };
  
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          await updateUserInfo();
        } catch (error) {
          // Token is invalid or expired
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setLoading(false);
    };
    
    initializeAuth();
  }, []);
  
  const login = async (username: string, password: string) => {
    try {
      const result = await loginUser(username, password);
      if (result) {
        await updateUserInfo();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string, password2: string) => {
    try {
      const result = await registerUser({
        username,
        email,
        password,
        password2,
      })
      if (result){
        return true;
      }

    }
    catch (error) {
      console.log("Login error:", error);
      return false;
    }
  };
  
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await logoutUser(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        register,
        updateUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};