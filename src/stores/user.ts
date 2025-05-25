import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { useRouter } from 'vue-router'

interface User {
  id: number
  name: string
  email: string
  avatar?: string
}

export const useUserStore = defineStore('user', () => {
  const authStore = useAuthStore()
  
  // Usar dados do usuário autenticado
  const currentUser = computed<User>(() => {
    if (authStore.user) {
      return {
        id: authStore.user.id,
        name: authStore.user.name,
        email: authStore.user.email,
        // Gerar avatar com base no nome do usuário
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(authStore.user.name)}&background=1976d2&color=fff`
      }
    }
    
    // Fallback para usuário não autenticado
    return {
      id: 0,
      name: 'Usuário',
      email: '',
      avatar: 'https://ui-avatars.com/api/?name=User&background=1976d2&color=fff'
    }
  })
  
  // Getters
  const userName = computed(() => currentUser.value.name)
  const userEmail = computed(() => currentUser.value.email)
  const userAvatar = computed(() => currentUser.value.avatar || '')
  
  // Integração com o auth store para logout
  async function logout() {
    const authStore = useAuthStore()
    const router = useRouter()
    
    await authStore.logout()
    router.push('/login')
  }
  
  return {
    currentUser,
    userName,
    userEmail,
    userAvatar,
    logout
  }
})
