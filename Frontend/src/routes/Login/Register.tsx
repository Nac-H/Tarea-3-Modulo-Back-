import React, { useState } from 'react';
// Si este archivo está en: src/routes/Login/Register.tsx
import '../../styles/dark-auth.css';

import { z } from 'zod';
import type { RegisterUser } from '../../Types/Users';
import { UserSchema } from '../../Types/Users';
import { createFileRoute, Link } from '@tanstack/react-router';
import { AuthProvider } from '../../context/Authcontext';
import { api } from 'src/Services/Api';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

// Errores por campo (string) + general opcional
type FormErrors = Partial<Record<keyof RegisterUser, string>> & {
  general?: string;
};

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState<RegisterUser>({
    email: '',
    Firstname: '',
    Lastname: '',
    password: '',
    age: undefined,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (data: RegisterUser): FormErrors | null => {
    const res = UserSchema.safeParse(data);
    if (res.success) return null;

    // ZodError -> usar flatten para mapear por campo
    const { fieldErrors, formErrors } = res.error.flatten();
    const out: FormErrors = {};

    (Object.keys(fieldErrors) as Array<keyof RegisterUser>).forEach((k) => {
      const msgs = fieldErrors[k];
      if (msgs?.length) out[k] = msgs[0];
    });

    if (formErrors?.length) out.general = formErrors[0];
    return out;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'age') {
      setFormData((prev) => ({
        ...prev,
        age: value === '' ? undefined : Number(value), // number | undefined
      }));
      return;
    }

    type NonAgeKey = Exclude<keyof RegisterUser, 'age'>;
    const k = name as NonAgeKey;
    setFormData((prev) => ({
      ...prev,
      [k]: value,
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
      // Asegúrate de que api.registerUser use credentials: 'include'
      await api.registerUser(formData);
      onSwitchToLogin();
    } catch (error) {
      setErrors({ general: 'Registration failed. Please try again.' });
      console.error('Error during registration:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <div className="auth-wrapper">
        <div className="auth-card">
          {errors.general && <p className="error">{errors.general}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <input
                type="text"
                name="Firstname"
                value={formData.Firstname}
                onChange={handleChange}
                placeholder="First Name"
                autoComplete="given-name"
              />
              {errors.Firstname && <span className="error">{errors.Firstname}</span>}
            </div>

            <div className="form-control">
              <input
                type="text"
                name="Lastname"
                value={formData.Lastname}
                onChange={handleChange}
                placeholder="Last Name"
                autoComplete="family-name"
              />
              {errors.Lastname && <span className="error">{errors.Lastname}</span>}
            </div>

            <div className="form-control">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                autoComplete="email"
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="form-control">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                autoComplete="new-password"
              />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>

            <div className="form-control">
              <input
                type="number"
                name="age"
                value={formData.age ?? ''} // string vacío cuando no hay número
                onChange={handleChange}
                placeholder="Age (optional)"
                min={1}
              />
              {errors.age && <span className="error">{errors.age}</span>}
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </form>

          <div className="actions">
            <span className="muted">¿Ya tienes cuenta?</span>
            {/* Verifica el path si tu ruta exacta difiere */}
            <Link to="/Login/SIgn" className="small-link">
              Ir a Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/Login/Register')({
  component: () => {
    const switchToLogin = () => {
      // Aquí podrías navegar o mostrar un modal, según tu UX
      console.log('Switching to login');
    };

    return (
      <AuthProvider>
        <RegisterForm onSwitchToLogin={switchToLogin} />
      </AuthProvider>
    );
  },
});

export default RegisterForm;
