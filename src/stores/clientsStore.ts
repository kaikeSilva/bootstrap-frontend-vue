import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Client, PaginationLinks } from '@/types/client.types'
import { clientsService } from '@/services/clientsService'

export const useClientsStore = defineStore('clients', () => {
  const clients = ref<Client[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const lastPage = ref(1)
  const perPage = ref(15)
  const total = ref(0)
  const paginationLinks = ref<PaginationLinks | null>(null)

  const fetchClients = async (page: number = 1, itemsPerPage: number = 15) => {
    loading.value = true
    error.value = null
    
    try {
      console.log('Store: Fetching clients...', { page, itemsPerPage })
      const response = await clientsService.getClients({
        page,
        per_page: itemsPerPage
      })
      
      console.log('Store: Received paginated response:', response)
      
      // Extract data and pagination info
      if (response && response.data) {
        clients.value = response.data
        
        // Update pagination state
        if (response.meta) {
          currentPage.value = response.meta.current_page
          lastPage.value = response.meta.last_page
          perPage.value = response.meta.per_page
          total.value = response.meta.total
        }
        
        // Update pagination links
        if (response.links) {
          paginationLinks.value = response.links
        }
        
        console.log('Store: Updated clients and pagination info')
      } else {
        console.error('Store: Unexpected response format:', response)
      }
    } catch (err) {
      error.value = 'Erro ao carregar clientes. Tente novamente.'
      console.error('Store error:', err)
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    clients,
    loading,
    error,
    currentPage,
    lastPage,
    perPage,
    total,
    paginationLinks,
    fetchClients,
    clearError
  }
})
