import api from './api'
import { useAuthStore } from '../stores/auth'

export const setupInterceptors = () => {
  api.interceptors.request.use((config) => {
    const authStore = useAuthStore()
    
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    
    return config
  })
}
