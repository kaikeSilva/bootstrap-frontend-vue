import type { Client } from '@/types/client.types'

const API_BASE = import.meta.env.VITE_API_BASE_URL

export const clientsService = {
  async getClients(): Promise<Client[]> {
    try {
      console.log('Fetching clients from:', `${API_BASE}/clients`)
      const response = await fetch(`${API_BASE}/clients`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Client data received:', data)
      return data
    } catch (error) {
      console.error('Error fetching clients:', error)
      throw error
    }
  }
}
