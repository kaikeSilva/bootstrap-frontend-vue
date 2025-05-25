import type { Client, PaginatedResponse } from '@/types/client.types'
import api from './api'

interface GetClientsParams {
  page?: number;
  per_page?: number;
}

export const clientsService = {
  async getClients(params: GetClientsParams = {}): Promise<PaginatedResponse<Client>> {
    try {
      console.log('Fetching clients from API with params:', params)
      const response = await api.get('/clients', { params })
      
      console.log('Client data received:', response.data)
      
      // Para fins de desenvolvimento, se a API não retornar dados paginados,
      // vamos simular a estrutura de paginação do Laravel
      if (Array.isArray(response.data)) {
        console.log('API returned array instead of paginated response, creating mock pagination')
        const clients = response.data
        const perPage = params.per_page || 15
        const currentPage = params.page || 1
        const total = clients.length
        const lastPage = Math.ceil(total / perPage)
        
        // Simular paginação
        const start = (currentPage - 1) * perPage
        const end = start + perPage
        const paginatedClients = clients.slice(start, end)
        
        // Criar resposta no formato do Laravel
        return {
          data: paginatedClients,
          meta: {
            current_page: currentPage,
            from: start + 1,
            last_page: lastPage,
            path: '/api/clients',
            per_page: perPage,
            to: Math.min(end, total),
            total: total
          },
          links: {
            first: '/api/clients?page=1',
            last: `/api/clients?page=${lastPage}`,
            prev: currentPage > 1 ? `/api/clients?page=${currentPage - 1}` : null,
            next: currentPage < lastPage ? `/api/clients?page=${currentPage + 1}` : null
          }
        }
      }
      
      return response.data
    } catch (error) {
      console.error('Error fetching clients:', error)
      throw error
    }
  }
}
