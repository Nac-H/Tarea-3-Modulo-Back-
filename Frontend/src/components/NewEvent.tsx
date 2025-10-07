import type { Event } from '@/Types/Event'
import { DataRepo } from '@/API/datasource/index'
import { useQueryClient, useMutation } from '@tanstack/react-query'


type EventProps = {
  data: Event
}

export const Evento = ({ data }: EventProps) => {
  const { name, Fecha, description, Cantidad, id, Tipo } = data
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (id: string) => DataRepo.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Events'] })
      alert('Transacción eliminada correctamente')
    },
    onError: (error: Error) => {
      alert('Error al eliminar transacción: ' + error.message)
    },
  })

 

  return (
    <article className="border border-gray-300 rounded-lg p-4 shadow-md flex-col w-[300px]">
      <div className="flex items-center mb-4 justify-between">
        <h2 className="text-xl font-bold text-gray-800">{name}</h2>
        <span className={`text-white text-sm px-2 py-1 rounded ${getTipoColor(Tipo)}`}>
          {Tipo}
        </span>
      </div>

      <p className="text-gray-600 mb-1"><strong>Fecha:</strong> {Fecha}</p>
      <p className="text-gray-600 mb-1"><strong>Cantidad:</strong> ${Cantidad.toFixed(2)}</p>
      
        <p className="text-gray-600 mb-1"><strong>Descripción:</strong> {description}</p>
    
     

      <button
        className="mt-2 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
        onClick={() => mutation.mutate(id)}
      >
        Eliminar Transacción
      </button>
    </article>
  )
}

function getTipoColor(tipo: string): string {
  switch (tipo) {
    case 'Ingreso':
      return 'bg-green-500'
    case 'Egreso':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

export default Evento
