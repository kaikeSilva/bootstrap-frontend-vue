import type { Client, PaginatedResponse } from '@/types/client.types'
import api from './api'

interface GetClientsParams {
  page?: number;
  per_page?: number;
  filter?: Record<string, string>;
}

export const clientsService = {
  async getClients(params: GetClientsParams = {}): Promise<PaginatedResponse<Client>> {
    try {
      console.log('Fetching clients from API with params:', params)
      const response = await api.get('/clients', { params })
      
      console.log('Client data received:', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching clients:', error)
      throw error
    }
  }
}
