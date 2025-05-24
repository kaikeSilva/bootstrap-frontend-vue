import api from './api'
import type { LoginCredentials, AuthResponse } from '../types/auth'

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/login', credentials)
    return response.data
  },

  async logout(): Promise<void> {
    await api.post('/logout')
  }
}
