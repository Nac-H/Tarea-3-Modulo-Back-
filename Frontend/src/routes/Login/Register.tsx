import React, { useState } from 'react';
import { useAuth } from '../../context/Authcontext';
import { z } from 'zod';
import type { RegisterUser } from '../../Types/Users';
import { UserSchema } from '../../Types/Users';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { AuthProvider } from '../../context/Authcontext';
import { Link } from '@tanstack/react-router';
import { api } from "../../Services/Api";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

interface FormErrors extends Partial<RegisterUser> {
  general?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterUser>({
    email: '',
    Firstname: '',
    Lastname: '',
    password: '',
    age: undefined,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (data: RegisterUser) => {
    try {
      UserSchema.parse(data);
      return null;
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        const zodErrors = error.errors.reduce((acc: any, curr: any) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {});
        return zodErrors;
      }
      console.error('Unexpected error', error);
      return null;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validateForm(formData);

    if (validationErrors) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      await api.registerUser(formData);
      navigate({ to: '/Login/SIgn', replace: true });
    } catch (error) {
      setErrors({ general: 'Registration failed. Please try again.' });
      console.error('Error during registration:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl border border-blue-100">
        <div className="flex justify-center mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/295/295128.png"
            alt="Register Illustration"
            className="w-24 h-24 object-contain drop-shadow-lg"
          />
        </div>

        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Crear Cuenta
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="Firstname"
            value={formData.Firstname}
            onChange={handleChange}
            placeholder="Nombre"
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          {errors.Firstname && <span className="text-sm text-red-500">{errors.Firstname}</span>}

          <input
            type="text"
            name="Lastname"
            value={formData.Lastname}
            onChange={handleChange}
            placeholder="Apellido"
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          {errors.Lastname && <span className="text-sm text-red-500">{errors.Lastname}</span>}

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Correo electrónico"
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          {errors.email && <span className="text-sm text-red-500">{errors.email}</span>}

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Contraseña"
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          {errors.password && <span className="text-sm text-red-500">{errors.password}</span>}

          <input
            type="number"
            name="age"
            value={formData.age || ''}
            onChange={handleChange}
            placeholder="Edad (opcional)"
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          {errors.age && <span className="text-sm text-red-500">{errors.age}</span>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 mt-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-lg hover:from-sky-600 hover:to-blue-700 transition-all"
          >
            {isSubmitting ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        {errors.general && (
          <p className="text-center text-red-500 mt-3">{errors.general}</p>
        )}

        <div className="text-center mt-5">
          <p className="text-gray-600 text-sm">¿Ya tienes una cuenta?</p>
          <Link to="/Login/SIgn">
            <button className="mt-2 text-sky-600 font-medium hover:underline">
              Inicia sesión
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/Login/Register')({
  component: () => {
    const switchToLogin = () => {
      console.log('Switching to login');
    };

    return <AuthProvider><RegisterForm onSwitchToLogin={switchToLogin} /></AuthProvider>;
  }
});

export default RegisterForm;
