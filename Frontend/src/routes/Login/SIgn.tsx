// components/LoginForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../../context/Authcontext';
import { createFileRoute } from '@tanstack/react-router';
import { AuthProvider } from '../../context/Authcontext';
import { useNavigate } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { api } from '../../Services/Api'; // Se agrega la importación de la API

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();              

  const [errors, setErrors] = useState<Partial<{ email: string; password: string; general?: string }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manejar el cambio de input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors: Partial<{ email: string; password: string; general?: string }> = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await api.login(formData.email, formData.password);
      console.log('Login successful:', result);
      login(formData.email);
      // ✅ Redirige a /FlujoDeBalance después del login exitoso
      navigate({ to: '/FlujoDeBalance', replace: true });
    } catch (error) {
      setErrors({ general: 'Login failed. Please check your credentials.' });
      console.error('Error during login:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl border border-blue-100">
        {/* Imagen decorativa superior */}
        <div className="flex justify-center mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/942/942751.png"
            alt="Login Illustration"
            className="w-24 h-24 object-contain drop-shadow-lg"
          />
        </div>

        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Iniciar Sesión
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Correo electrónico"
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            {errors.email && (
              <span className="text-sm text-red-500">{errors.email}</span>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Contraseña"
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            {errors.password && (
              <span className="text-sm text-red-500">{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 mt-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-lg hover:from-sky-600 hover:to-blue-700 transition-all"
          >
            {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>

        {errors.general && (
          <p className="text-center text-red-500 mt-3">{errors.general}</p>
        )}

        <div className="text-center mt-5">
          <p className="text-gray-600 text-sm">
            ¿No tienes una cuenta?
          </p>
          <Link to="/Login/Register">
            <button className="mt-2 text-sky-600 font-medium hover:underline">
              Crear una cuenta
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Ruta del LoginForm
export const Route = createFileRoute('/Login/SIgn')({
  component: (props) => {
    const switchToRegister = () => {
      console.log('Switching to register');
    };

    return (
      <AuthProvider>
        <LoginForm {...props} onSwitchToRegister={switchToRegister} />
      </AuthProvider>
    );
  },
});

export default LoginForm;
