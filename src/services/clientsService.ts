import type { Client, PaginatedResponse } from '@/types/client.types'
import api from './api'

interface GetClientsParams {
  page?: number;
  per_page?: number;
  filter?: Record<string, string>;
  sort_by?: string;
  direction?: 'asc' | 'desc';
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
  },
  
  async getClientById(id: number): Promise<Client> {
    try {
      console.log(`Buscando cliente com ID: ${id}`)
      const response = await api.get(`/clients/${id}`)
      
      // A API retorna os dados dentro de um objeto 'data'
      if (response.data && response.data.data) {
        return response.data.data
      }
      
      return response.data
    } catch (error) {
      console.error(`Erro ao buscar cliente com ID ${id}:`, error)
      throw error
    }
  },
  
  async createClient(clientData: Partial<Client>): Promise<Client> {
    try {
      console.log('Creating new client:', clientData)
      const response = await api.post('/clients', clientData)
      
      console.log('Client created:', response.data)
      return response.data
    } catch (error) {
      console.error('Error creating client:', error)
      throw error
    }
  },
  
  async updateClient(id: number, clientData: Partial<Client>): Promise<Client> {
    try {
      console.log(`Updating client with ID ${id}:`, clientData)
      const response = await api.put(`/clients/${id}`, clientData)
      
      // A API retorna os dados dentro de um objeto 'data'
      if (response.data && response.data.data) {
        console.log('Client updated:', response.data.data)
        return response.data.data
      }
      
      console.log('Client updated:', response.data)
      return response.data
    } catch (error) {
      console.error(`Error updating client with ID ${id}:`, error)
      throw error
    }
  },
  
  async deleteClient(id: number): Promise<void> {
    try {
      console.log(`Deleting client with ID ${id}`)
      await api.delete(`/clients/${id}`)
      console.log(`Client with ID ${id} deleted successfully`)
    } catch (error) {
      console.error(`Error deleting client with ID ${id}:`, error)
      throw error
    }
  }
}
