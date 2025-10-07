import type {Event, CreateEvent,UpdateEvent} from '@/Types/Event'


export abstract class DataDS {
  abstract getEvent(Tipo: string): Promise<Array<Event>>

  abstract getEventById(id: string): Promise<Event>

  abstract saveEvent(event: CreateEvent): Promise<boolean>

  abstract updateEvent(event: UpdateEvent): Promise<boolean>

  abstract deleteEvent(id: string): Promise<boolean>
}

export default DataDS
