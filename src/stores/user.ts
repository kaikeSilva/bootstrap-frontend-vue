import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { useRouter } from 'vue-router'

interface User {
  id: number
  name: string
  email: string
  avatar: string
}

export const useUserStore = defineStore('user', () => {
  // Estado mockado
  const currentUser = ref<User>({
    id: 1,
    name: 'João Silva',
    email: 'joao.silva@example.com',
    avatar: 'https://ui-avatars.com/api/?name=João+Silva&background=1976d2&color=fff'
  })
  
  // Getters
  const userName = computed(() => currentUser.value.name)
  const userEmail = computed(() => currentUser.value.email)
  const userAvatar = computed(() => currentUser.value.avatar)
  
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
