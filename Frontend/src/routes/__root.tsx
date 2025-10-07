import { createRootRoute, createRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { AuthProvider } from '../context/Authcontext'
import LoginForm from '../routes/Login/SIgn'
import RegisterForm from '../routes/Login/Register'
import Header from '../components/Header'

// 1️⃣ RootRoute
export const RootRoute = createRootRoute({
  component: () => (
    <AuthProvider>
      <Header />
      <Outlet />
      <TanStackRouterDevtools />
    </AuthProvider>
  ),
})

// 2️⃣ Ruta de Login (hija del RootRoute)
export const LoginRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: '/',
  component: () => <LoginForm onSwitchToRegister={() => console.log('Switching to register')} />,
})

// 3️⃣ Ruta de Register (hija del RootRoute)
export const RegisterRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: '/register',
  component: () => <RegisterForm onSwitchToLogin={() => console.log('Switching to login')} />,
})
