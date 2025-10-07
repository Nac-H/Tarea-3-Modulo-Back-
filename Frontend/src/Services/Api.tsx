// src/Services/Api.ts
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

  // Parsea el body y lanza errores con mensaje del servidor
  private async handle<T = any>(res: Response): Promise<T> {
    const text = await res.text();
    let body: any = null;
    try { body = text ? JSON.parse(text) : null; } catch {}
    if (!res.ok) {
      const msg = (body && (body.message || body.error)) || `HTTP ${res.status}`;
      throw new Error(msg);
    }
    return body as T;
  }

  // Login
  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await fetch(`${this.API_URL}/auths/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include', // cookie JWT viaja
    });
    return this.handle<LoginResponse>(res);
  }

  // Logout
  async logout(): Promise<void> {
    const res = await fetch(`${this.API_URL}/auths/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    await this.handle(res);
  }

  // Registro de usuario
  async registerUser(userData: {
    email: string;
    password: string;
    Firstname: string;
    Lastname: string;
    age?: number;
  }): Promise<LoginResponse> {
    const res = await fetch(`${this.API_URL}/auths/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
      credentials: 'include',
    });
    return this.handle<LoginResponse>(res);
  }

  // Comprobar sesión desde cookie (rehidratar)
  async me(): Promise<User> {
    const res = await fetch(`${this.API_URL}/auths/me`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await this.handle<{ user: User }>(res);
    return data.user;
  }
}

export const api = new Api();
export default api;
