import type { User, PaginatedResponse } from '@/types/user.types'
import api from './api'

interface GetUsersParams {
  page?: number;
  per_page?: number;
  filter?: Record<string, string>;
  sort_by?: string;
  direction?: 'asc' | 'desc';
}

export const usersService = {
  async getUsers(params: GetUsersParams = {}): Promise<PaginatedResponse<User>> {
    try {
      console.log('Fetching users from API with params:', params)
      const response = await api.get('/users', { params })
      
      console.log('User data received:', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  },
  
  async getUserById(id: number): Promise<User> {
    try {
      console.log(`Buscando usuário com ID: ${id}`)
      const response = await api.get(`/users/${id}`)
      
      // A API retorna os dados dentro de um objeto 'data'
      if (response.data && response.data.data) {
        return response.data.data
      }
      
      return response.data
    } catch (error) {
      console.error(`Erro ao buscar usuário com ID ${id}:`, error)
      throw error
    }
  },
  
  async createUser(userData: Partial<User> & { password: string }): Promise<User> {
    try {
      console.log('Creating new user:', userData)
      const response = await api.post('/users', userData)
      
      console.log('User created:', response.data)
      return response.data
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  },
  
  async updateUser(id: number, userData: Partial<User> & { password?: string }): Promise<User> {
    try {
      console.log(`Updating user with ID ${id}:`, userData)
      const response = await api.put(`/users/${id}`, userData)
      
      // A API retorna os dados dentro de um objeto 'data'
      if (response.data && response.data.data) {
        console.log('User updated:', response.data.data)
        return response.data.data
      }
      
      console.log('User updated:', response.data)
      return response.data
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error)
      throw error
    }
  },
  
  async deleteUser(id: number): Promise<void> {
    try {
      console.log(`Deleting user with ID ${id}`)
      await api.delete(`/users/${id}`)
      console.log(`User with ID ${id} deleted successfully`)
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error)
      throw error
    }
  }
}
