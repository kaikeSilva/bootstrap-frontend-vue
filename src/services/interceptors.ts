import api from './api'
import { useAuthStore } from '../stores/auth'

export const setupInterceptors = () => {
  api.interceptors.request.use((config) => {
    // Try to get token from Pinia store first
    const authStore = useAuthStore()
    let token = authStore.token
    
    // If not available in store, check localStorage directly
    // This helps during initial page load before the store is fully initialized
    if (!token) {
      token = localStorage.getItem('auth_token')
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  })
  
  // Add response interceptor to handle authentication errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle 401 Unauthorized errors
      if (error.response && error.response.status === 401) {
        const authStore = useAuthStore()
        authStore.logout()
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }
  )
}
