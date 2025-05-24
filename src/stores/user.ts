import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

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
  
  // Action mockada
  function logout() {
    console.log('Logout chamado - não implementado')
  }
  
  return {
    currentUser,
    userName,
    userEmail,
    userAvatar,
    logout
  }
})
