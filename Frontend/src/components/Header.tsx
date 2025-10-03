import { Link } from '@tanstack/react-router'
import Demo from './Ilumination'
export default function Header() {

  return (
    <header className="p-2 flex gap-2 bg-white text-black justify-between">
      <nav className="flex flex-row">
        <div className="px-2 font-bold">
          <Link to="/FlujoDeBalance">Flujo de Balance</Link>
          <span className="mx-2">   </span>
          <Link to="/From/$id" params={{ id: 'uuid' }}>
            Formulario de Evento
          </Link>
        </div>
      </nav>
      <div>
         <Demo/>

         </div>
    </header>
  )
}

