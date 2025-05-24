import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Client } from '@/types/client.types'
import { clientsService } from '@/services/clientsService'

export const useClientsStore = defineStore('clients', () => {
  const clients = ref<Client[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchClients = async () => {
    loading.value = true
    error.value = null
    
    try {
      console.log('Store: Fetching clients...')
      const data = await clientsService.getClients()
      console.log('Store: Received data structure:', JSON.stringify(data))
      
      // Check if data is in the expected format or needs to be extracted from a wrapper
      if (Array.isArray(data)) {
        clients.value = data
        console.log('Store: Data is an array, assigned directly')
      } else if (data && typeof data === 'object') {
        // Try to find an array property in the response
        const possibleArrayProps = ['data', 'clients', 'results', 'items']
        for (const prop of possibleArrayProps) {
          if (Array.isArray(data[prop])) {
            clients.value = data[prop]
            console.log(`Store: Found array in data.${prop}, assigned to clients`)
            break
          }
        }
        
        // If we couldn't find an array, log the issue
        if (clients.value.length === 0) {
          console.warn('Store: Could not find client array in response:', data)
        }
      } else {
        console.error('Store: Unexpected data format:', data)
      }
      
      console.log('Store: Final clients array:', clients.value)
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
    fetchClients,
    clearError
  }
})
