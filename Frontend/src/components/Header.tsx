import { Link } from '@tanstack/react-router'
import Demo from './Ilumination'
import LogoutButton from './Logout'

export default function Header() {
  return (
    <header className="p-3 flex items-center justify-between bg-gradient-to-r from-blue-700 to-sky-500 text-white shadow-md">
      {/* NAV LINKS */}
      <nav className="flex flex-row">
        <div className="px-2 font-semibold">
          <Link
            to="/FlujoDeBalance"
            className="hover:text-sky-200 transition-colors"
          >
            Flujo de Balance
          </Link>
          <span className="mx-3 text-sky-200">|</span>
          <Link
            to="/From/$id"
            params={{ id: 'uuid' }}
            className="hover:text-sky-200 transition-colors"
          >
            Formulario de Evento
          </Link>
        </div>
      </nav>

      {/* BOTONES DERECHA */}
      <div className="flex flex-row items-center gap-3">
        <Demo />
        <LogoutButton />
      </div>
    </header>
  )
}

