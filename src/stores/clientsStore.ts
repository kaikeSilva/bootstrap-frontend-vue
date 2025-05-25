import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import type { Client, PaginationLinks } from '@/types/client.types'
import { clientsService } from '@/services/clientsService'

type SortDirection = 'asc' | 'desc'

export const useClientsStore = defineStore('clients', () => {
  const clients = ref<Client[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const lastPage = ref(1)
  const perPage = ref(15)
  const total = ref(0)
  const paginationLinks = ref<PaginationLinks | null>(null)
  const activeFilters = reactive<Record<string, string>>({})
  const sortBy = ref<string>('id')
  const sortDirection = ref<SortDirection>('asc')

  const fetchClients = async (
    page: number = 1, 
    itemsPerPage: number = 15, 
    filters?: Record<string, string>,
    sort?: { sortBy: string; direction: SortDirection }
  ) => {
    loading.value = true
    error.value = null
    
    try {
      console.log('Store: Fetching clients...', { page, itemsPerPage, filters })
      
      // Se filtros foram fornecidos, atualize os filtros ativos
      if (filters) {
        // Limpar filtros ativos anteriores
        Object.keys(activeFilters).forEach(key => {
          delete activeFilters[key]
        })
        
        // Adicionar novos filtros
        Object.entries(filters).forEach(([key, value]) => {
          activeFilters[key] = value
        })
      }
      
      // Se ordenação foi fornecida, atualize os parâmetros de ordenação
      if (sort) {
        sortBy.value = sort.sortBy
        sortDirection.value = sort.direction
      }
      
      // Preparar parâmetros para a requisição
      const params: {
        page: number;
        per_page: number;
        filter?: Record<string, string>;
        sort_by?: string;
        direction?: SortDirection;
      } = {
        page,
        per_page: itemsPerPage,
        sort_by: sortBy.value,
        direction: sortDirection.value
      }
      
      // Adicionar filtros à requisição se houver filtros ativos
      if (Object.keys(activeFilters).length > 0) {
        params.filter = { ...activeFilters }
      }
      
      const response = await clientsService.getClients(params)
      
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

  const clearFilters = async () => {
    // Limpar filtros ativos
    Object.keys(activeFilters).forEach(key => {
      delete activeFilters[key]
    })
    
    // Recarregar clientes sem filtros
    await fetchClients(1, perPage.value)
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
    activeFilters,
    sortBy,
    sortDirection,
    fetchClients,
    clearFilters,
    clearError
  }
})
