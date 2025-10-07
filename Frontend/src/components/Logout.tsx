import React, { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../context/Authcontext'
import { api } from '../Services/Api'

const LogoutButton: React.FC = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogout = async () => {
    setLoading(true)
    setError(null)

    try {
      await api.logout()          
      logout()                   
      navigate({ to: '/Login/SIgn', replace: true })  // 
    } catch (err: any) {
      console.error('Logout error:', err)
      setError('Error al cerrar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleLogout}
        disabled={loading}
        className="px-5 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:from-sky-600 hover:to-blue-700 transition-all disabled:opacity-70"
      >
        {loading ? 'Cerrando sesión...' : 'Cerrar sesión'}
      </button>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )
}

export default LogoutButton
