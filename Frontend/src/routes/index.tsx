import { createFileRoute, Navigate } from '@tanstack/react-router'

// Redirige automáticamente al Login
export const Route = createFileRoute('/')({
  component: () => <Navigate to="/Login/SIgn" replace />,
})
