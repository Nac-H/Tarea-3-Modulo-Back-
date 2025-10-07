import { useNavigate } from '@tanstack/react-router'

export default function EditButton({ eventId }: { eventId: string }) {
  const navigate = useNavigate()

  function handleEdit() {
    navigate({ to: `/From/${eventId}` })
  }

  return (
    <button
      className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded"
      onClick={handleEdit}
      type="button"
    >
      Actualizar Transacción
    </button>
  )
}