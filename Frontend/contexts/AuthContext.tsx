import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'employer' | 'employee';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: 'employer' | 'employee') => Promise<boolean>;
  signup: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'employer' | 'employee';
  }) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock users
  const mockUsers = [
    {
      id: '1',
      email: 'employer@company.com',
      password: 'employer123',
      firstName: 'Emma',
      lastName: 'Employer',
      role: 'employer',
    },
    {
      id: '2',
      email: 'employee@company.com',
      password: 'employee123',
      firstName: 'John',
      lastName: 'Employee',
      role: 'employee',
    },
  ];

  const login = async (email: string, password: string, role: 'employer' | 'employee'): Promise<boolean> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Check mock users
      const found = mockUsers.find(u => u.email === email && u.password === password && u.role === role);
      if (found) {
        setUser({
          id: found.id,
          email: found.email,
          firstName: found.firstName,
          lastName: found.lastName,
          role: found.role as 'employer' | 'employee',
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'employer' | 'employee';
  }): Promise<boolean> => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Simulate successful signup
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};