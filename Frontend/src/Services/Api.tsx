const API_URL = 'http://localhost:3001/api/v1';

interface User {
  id: string;
  email: string;
  Firstname?: string;
  Lastname?: string;
  age?: number;
}

interface LoginResponse {
  token?: string;
  user: User;
}

class Api {
  private API_URL: string;

  constructor() {
    this.API_URL = API_URL;
  }

  // Login
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${this.API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include', // para cookie JWT
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data: LoginResponse = await response.json();
    return data;
  }

  // Logout
  async logout(): Promise<void> {
    const response = await fetch(`${this.API_URL}/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }
  }

  // Registro de usuario
  async registerUser(userData: {
    email: string;
    password: string;
    Firstname: string;
    Lastname: string;
    age?: number;
  }): Promise<LoginResponse> {
    const response = await fetch(`${this.API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const data: LoginResponse = await response.json();
    return data;
  }
}

export const api = new Api();
export default api;
