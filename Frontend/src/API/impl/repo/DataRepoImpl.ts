import type DataDS from '@/API/domain/ds/DataDS'
import type {Event, CreateEvent,UpdateEvent} from '@/Types/Event'

class DataRepoImpl {
  constructor(private data: DataDS) {}

  async getEvents(Tipo: string): Promise<Array<Event>> {
    return await this.data.getEvent(Tipo)
  }

  async getEventById(id: string): Promise<Event> {
    return await this.data.getEventById(id)
  }

  async saveEvent(event: CreateEvent): Promise<boolean> {
    return await this.data.saveEvent(event)
  }

  async updateEvent(event: UpdateEvent): Promise<boolean> {
    return await this.data.updateEvent(event)
  }

  async deleteEvent(id: string): Promise<boolean> {
    return await this.data.deleteEvent(id)
  }
}

export default DataRepoImpl
