import type DataDS from '@/API/domain/ds/DataDS'
import type { Event, CreateEvent, UpdateEvent } from '@/Types/Event'

const API_URL = 'http://localhost:3001/api/v1/events'

class LocalStorageDS implements DataDS {
  async getEvent(Tipo?: string, page: number = 1, limit: number = 10): Promise<Event[]> {
    try {
      const url = new URL(API_URL)
      url.searchParams.append('page', page.toString())
      url.searchParams.append('limit', limit.toString())
      if (Tipo) url.searchParams.append('Tipo', Tipo)

      const res = await fetch(url.toString())
      if (!res.ok) throw new Error(`Error fetching events: ${res.status}`)

      const data = await res.json()
      return data.data ?? []
    } catch (error) {
      console.error(error)
      throw new Error('Error loading events')
    }
  }

  async getEventById(id: string): Promise<Event> {
    try {
      const res = await fetch(`${API_URL}/${id}`)
      if (!res.ok) {
        if (res.status === 404) throw new Error('Event not found')
        throw new Error(`Error fetching event: ${res.status}`)
      }
      const data = await res.json()
      return data.data.event
    } catch (error) {
      console.error(error)
      throw new Error('Error loading event')
    }
  }

  async saveEvent(event: CreateEvent): Promise<boolean> {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      })
      if (!res.ok) throw new Error(`Error saving event: ${res.status}`)
      return true
    } catch (error) {
      console.error(error)
      throw new Error('Error saving event')
    }
  }

  async updateEvent(event: UpdateEvent): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      })
      if (!res.ok) {
        if (res.status === 404) throw new Error('Event not found')
        throw new Error(`Error updating event: ${res.status}`)
      }
      return true
    } catch (error) {
      console.error(error)
      throw new Error('Error updating event')
    }
  }

  async deleteEvent(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        if (res.status === 404) throw new Error('Event not found')
        throw new Error(`Error deleting event: ${res.status}`)
      }
      return true
    } catch (error) {
      console.error(error)
      throw new Error('Error deleting event')
    }
  }
}

export default LocalStorageDS
