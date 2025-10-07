import type DataDS from '@/API/domain/ds/DataDS'
import type { Event, CreateEvent, UpdateEvent } from '@/Types/Event'

const API_URL = 'http://localhost:3001/api/v1/events'

class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: 'include',                  // ⬅️ envía cookie JWT
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  const text = await res.text()
  let body: any = null
  try { body = text ? JSON.parse(text) : null } catch {}

  if (!res.ok) {
    if (res.status === 401) throw new UnauthorizedError(body?.message || 'Unauthorized')
    const msg = body?.message || `HTTP ${res.status}`
    throw new Error(msg)
  }
  return body as T
}

class LocalStorageDS implements DataDS {
  async getEvent(Tipo?: string, page: number = 1, limit: number = 10): Promise<Event[]> {
    const url = new URL(API_URL)
    url.searchParams.append('page', String(page))
    url.searchParams.append('limit', String(limit))
    if (Tipo) url.searchParams.append('Tipo', Tipo)

    const data = await fetchJson<{ data?: Event[] }>(url.toString(), {
      method: 'GET',
    })
    return data.data ?? []
  }

  async getEventById(id: string): Promise<Event> {
    const data = await fetchJson<{ data: { event: Event } }>(`${API_URL}/${id}`, {
      method: 'GET',
    })
    return data.data.event
  }

  async saveEvent(event: CreateEvent): Promise<boolean> {
    await fetchJson(`${API_URL}`, {
      method: 'POST',
      body: JSON.stringify(event),
    })
    return true
  }

  async updateEvent(event: UpdateEvent): Promise<boolean> {
    await fetchJson(`${API_URL}/${event.id}`, {
      method: 'PUT',
      body: JSON.stringify(event),
    })
    return true
  }

  async deleteEvent(id: string): Promise<boolean> {
    await fetchJson(`${API_URL}/${id}`, {
      method: 'DELETE',
    })
    return true
  }
}

export default LocalStorageDS
