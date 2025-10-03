// context/AuthContext.tsx
import React, { createContext, useState, useContext } from 'react';
import type {ReactNode} from 'react';
interface AuthContextType {
  user: string | null;
  login: (username: string) => void;
  logout: () => void;
}

// Definir el tipo para las propiedades de AuthProvider
interface AuthProviderProps {
  children: ReactNode; // Esto asegura que "children" sea del tipo adecuado
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);

  const login = (username: string) => {
    setUser(username);
    // Guarda el token o los detalles en el localStorage o cualquier otra persistencia.
    localStorage.setItem('userToken', 'some-jwt-token');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userToken');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
