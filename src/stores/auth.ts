import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials } from '../types/auth'
import { authService } from '../services/authService'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isAuthenticated = computed(() => {
    return token.value !== null && user.value !== null
  })

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials)
      user.value = response.user
      token.value = response.token
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
      user.value = null
      token.value = null
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
