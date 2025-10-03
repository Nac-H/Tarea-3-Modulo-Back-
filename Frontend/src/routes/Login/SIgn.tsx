// components/LoginForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../../context/Authcontext';
import { createFileRoute } from '@tanstack/react-router';
import { AuthProvider } from '../../context/Authcontext';
import { useNavigate } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { api } from 'src/Services/Api'; // Se agrega la importación de la API

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

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

    // Simple validación de los campos
    const newErrors: Partial<{ email: string; password: string; general?: string }> = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Llamada al backend para login usando la API
      const result = await api.login(formData.email, formData.password);
      console.log('Login successful:', result);

      // Guardar el login en el contexto usando el método existente
      login(formData.email); // Mantener la lógica original

    } catch (error) {
      setErrors({ general: 'Login failed. Please check your credentials.' });
      console.error('Error during login:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <div className="auth-wrapper"><div className="auth-card"><form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        {errors.email && <span>{errors.email}</span>}

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        />
        {errors.password && <span>{errors.password}</span>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Log In'}
        </button>
      </form></div></div>

      {errors.general && <p>{errors.general}</p>}

      <Link to="/Login/Register">
        <button>Go to Register</button>
      </Link>
    </div>
  );
};

// Aquí definimos la ruta para LoginForm usando createFileRoute
export const Route = createFileRoute('/Login/SIgn')({
  component: (props) => {
    const switchToRegister = () => {
      console.log('Switching to register');
      // Lógica para cambiar entre Login y Register
    };

    return <AuthProvider><LoginForm {...props} onSwitchToRegister={switchToRegister} /></AuthProvider>;
  }
});

export default LoginForm;
