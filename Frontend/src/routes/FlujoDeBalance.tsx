
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/app/store'
import { setForm, resetForm } from '@/features/counters/Countersslice'
import { DataRepo } from '@/API/datasource'
import { useEffect } from 'react'
import { EventSchema, type Event } from '@/Types/Event'
import  EventsByMonth from '@/components/ShowMonth'
  
import { setEvents } from '@/features/counters/Countersslice'

type SearchParams = {
  status?: string
}

export const Route = createFileRoute('/FlujoDeBalance')({
  component: RouteComponent,
  validateSearch: (search: Record<string, string | undefined>): SearchParams => ({
    status: search.status,
  }),
})
function RouteComponent() {
  const dispatch = useDispatch()
  const events = useSelector((state: RootState) => state.counters.events)  
  const { status } = Route.useSearch()

  const { isLoading, data: fetchedEvents = [], error } = useQuery<Event[]>({
    queryKey: ['Events', status],
    queryFn: async (): Promise<Event[]> => {
      const rawData = await DataRepo.getEvents(status ?? '')
      return rawData
        .map((e) => {
          const parsed = EventSchema.safeParse(e)
          return parsed.success ? parsed.data : null
        })
        .filter((e): e is Event => e !== null)
    },
    refetchInterval: /*5000*/false,
    refetchOnWindowFocus: false,
  })


  useEffect(() => {
    dispatch(setEvents(fetchedEvents))
  }, [fetchedEvents, dispatch])


  useEffect(() => {
    if (events.length > 0) {
      dispatch(setEvents(fetchedEvents))
      dispatch(setForm(fetchedEvents[0]))
    } else {
      dispatch(resetForm())
    }
  }, [fetchedEvents, dispatch])

  if (isLoading) return <div className="p-4">Cargando eventos...</div>
  if (error instanceof Error)
    return <div className="p-4 text-red-500">Error: {error.message}</div>

  return (
    <div className="p-4">
   
       <EventsByMonth />

     
    </div>
  )
}
