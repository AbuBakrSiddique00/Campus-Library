import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'student' | 'teacher' | 'librarian';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  rollNumber?: string;
  session?: string;
}

interface AuthContextData {
  user: User | null;
  signIn: (email: string, pass: string) => Promise<boolean>;
  signUp: (userParams: Omit<User, 'id'>, pass: string) => Promise<boolean>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [mockDatabase, setMockDatabase] = useState<User[]>([]);

  const signIn = async (email: string, pass: string) => {
    // In our mock logic, any registered email works. 
    // If we haven't registered anyone, we can provide a fallback admin for testing.
    if (email === 'admin@library.com' && mockDatabase.length === 0) {
      setUser({
        id: '1',
        email,
        name: 'System Admin',
        role: 'librarian',
        department: 'Library HQ'
      });
      return true;
    }

    const foundUser = mockDatabase.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      setUser(foundUser);
      return true;
    }

    return false; // User not found
  };

  const signUp = async (userParams: Omit<User, 'id'>, pass: string) => {
    // Check if user already exists
    if (mockDatabase.find(u => u.email.toLowerCase() === userParams.email.toLowerCase())) {
      return false; // Email already in use
    }

    const newUser: User = { 
      ...userParams, 
      id: String(Date.now()) 
    };

    setMockDatabase(prev => [...prev, newUser]);
    return true; // Success
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
