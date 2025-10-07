import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/app/store'
import { setForm, resetForm, setEvents } from '@/features/counters/Countersslice'
import { DataRepo } from '@/API/datasource'
import { useEffect } from 'react'
import { EventSchema, type Event } from '@/Types/Event'
import EventsByMonth from '@/components/ShowMonth'
import Header from '@/components/Header'

export const Route = createFileRoute('/FlujoDeBalance')({
  component: RouteComponent,
})

function RouteComponent() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const events = useSelector((state: RootState) => state.counters.events)

  const { isLoading, data: fetchedEvents = [], error } = useQuery<Event[]>({
    queryKey: ['Events'],
    queryFn: async () => {
      const rawData = await DataRepo.getEvents('')
      return rawData
        .map((e) => {
          const parsed = EventSchema.safeParse(e)
          return parsed.success ? parsed.data : null
        })
        .filter((e): e is Event => e !== null)
    },
  })

  useEffect(() => {
    dispatch(setEvents(fetchedEvents))
  }, [fetchedEvents, dispatch])

  useEffect(() => {
    if (events.length > 0) {
      dispatch(setForm(fetchedEvents[0]))
    } else {
      dispatch(resetForm())
    }
  }, [fetchedEvents, dispatch])

  if (isLoading) return <div className="p-4">Cargando eventos...</div>
  if (error instanceof Error)
    return <div className="p-4 text-red-500">Error: {error.message}</div>

 
  const handleGoToFlujo = () => {
    navigate({ to: '/FlujoDeBalance' })
  }

  return (
    <div>
      <Header />
      <div className="p-4 flex justify-center">
  
      </div>
      <EventsByMonth />
    </div>
  )
}
