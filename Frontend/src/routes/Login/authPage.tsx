// pages/AuthPage.tsx
import React, { useState } from 'react';
import LoginForm from './SIgn';
import RegisterForm from './Register';
import { AuthProvider } from '../../context/Authcontext'; // Ajusta la ruta
import { createFileRoute } from '@tanstack/react-router';

// Definimos la ruta para AuthPage usando createFileRoute
export const Route = createFileRoute('/Login/authPage')({
  component: () => <AuthPage />,
});
const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const switchToRegister = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  return (
    <AuthProvider>
      {isLogin ? (
        <LoginForm onSwitchToRegister={switchToRegister} />
      ) : (
        <RegisterForm onSwitchToLogin={switchToLogin} />
      )}
    </AuthProvider>
  );
};

export default AuthPage;
