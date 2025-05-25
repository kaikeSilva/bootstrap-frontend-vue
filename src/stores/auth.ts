import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials } from '../types/auth'
import { authService } from '../services/authService'

export const useAuthStore = defineStore('auth', () => {
  // Initialize state from localStorage if available
  const storedUser = localStorage.getItem('auth_user')
  const storedToken = localStorage.getItem('auth_token')
  
  const user = ref<User | null>(storedUser ? JSON.parse(storedUser) : null)
  const token = ref<string | null>(storedToken)

  const isAuthenticated = computed(() => {
    return token.value !== null && user.value !== null
  })

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials)
      user.value = response.user
      token.value = response.token
      
      // Save to localStorage
      localStorage.setItem('auth_user', JSON.stringify(response.user))
      localStorage.setItem('auth_token', response.token)
      
      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.warn('Erro no logout:', error)
    } finally {
      // Clear state and localStorage
      user.value = null
      token.value = null
      localStorage.removeItem('auth_user')
      localStorage.removeItem('auth_token')
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout
  }
})
