import type { Event } from '@/Types/Event'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {DataRepo} from '@/API/datasource/index'

type EventProps = {
  data: Event
}

export default function DeleteEvent({ data }: EventProps) {
  const { id} = data
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (id: string) => DataRepo.deleteEvent(id), // función que elimina un evento por id
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] }) // invalida cache para refrescar lista de eventos
      alert('Evento eliminado correctamente')
    },
    onError: (error: Error) => {
      alert('Error al eliminar evento: ' + error.message)
    }
  })

  return (
    <div>
     
      <button
        className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
        type="button"
        onClick={() => mutation.mutate(id)}
        
      >
        Eliminar Transaccion
      </button>
    </div>
  )
}
