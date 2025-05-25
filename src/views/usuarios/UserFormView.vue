<template>
  <div class="user-form-view">
    <div class="form-container">
      <div class="form-header">
        <h1 class="form-title">{{ isEditMode ? 'Editar Usuário' : 'Novo Usuário' }}</h1>
        <p class="form-description">
          {{ isEditMode ? 'Edite os dados do usuário' : 'Preencha os dados para cadastrar um novo usuário' }}
        </p>
      </div>
      
      <form @submit.prevent="handleSubmit" class="user-form">
        <div class="form-row">
          <div class="form-group">
            <label for="name" class="form-label">Nome *</label>
            <input 
              id="name" 
              v-model="form.name" 
              type="text" 
              class="form-input"
              :class="{ 'input-error': errors.name }"
              placeholder="Nome completo"
              required
            />
            <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
          </div>
          
          <div class="form-group">
            <label for="email" class="form-label">Email *</label>
            <input 
              id="email" 
              v-model="form.email" 
              type="email" 
              class="form-input"
              :class="{ 'input-error': errors.email }"
              placeholder="email@exemplo.com"
              required
            />
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="password" class="form-label">{{ isEditMode ? 'Senha (deixe em branco para manter a atual)' : 'Senha *' }}</label>
            <input 
              id="password" 
              v-model="form.password" 
              type="password" 
              class="form-input"
              :class="{ 'input-error': errors.password }"
              placeholder="Senha"
              :required="!isEditMode"
            />
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>
          
          <div class="form-group">
            <label for="password_confirmation" class="form-label">{{ isEditMode ? 'Confirmar Senha' : 'Confirmar Senha *' }}</label>
            <input 
              id="password_confirmation" 
              v-model="form.passwordConfirmation" 
              type="password" 
              class="form-input"
              :class="{ 'input-error': errors.passwordConfirmation }"
              placeholder="Confirmar senha"
              :required="!isEditMode || form.password"
            />
            <span v-if="errors.passwordConfirmation" class="error-message">{{ errors.passwordConfirmation }}</span>
          </div>
        </div>
        
        <div class="form-actions">
          <button 
            type="button" 
            class="form-button cancel-button"
            @click="handleCancel"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            class="form-button submit-button"
            :disabled="loading"
          >
            <span v-if="loading">{{ isEditMode ? 'Atualizando...' : 'Salvando...' }}</span>
            <span v-else>{{ isEditMode ? 'Atualizar' : 'Salvar' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usersService } from '@/services/usersService'
import type { User } from '@/types/user.types'
import { useNotificationStore } from '@/stores/notificationStore'

interface UserForm {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  passwordConfirmation?: string;
}

const router = useRouter()
const route = useRoute()
const notificationStore = useNotificationStore()
const loading = ref(false)
const loadingUser = ref(false)
const userId = ref<number | null>(null)

// Determinar se estamos no modo de edição ou criação
const isEditMode = computed(() => !!userId.value)

const form = reactive<UserForm>({
  name: '',
  email: '',
  password: '',
  passwordConfirmation: ''
})

const errors = reactive<FormErrors>({})

// Carregar dados do usuário se estiver no modo de edição
onMounted(async () => {
  // Verificar se temos um ID na rota
  if (route.params.id) {
    const id = parseInt(route.params.id as string)
    if (!isNaN(id)) {
      userId.value = id
      await loadUserData(id)
    }
  }
})

// Função para carregar os dados do usuário
const loadUserData = async (id: number) => {
  loadingUser.value = true
  
  try {
    const user = await usersService.getUserById(id)
    
    // Preencher o formulário com os dados do usuário
    form.name = user.name
    form.email = user.email || ''
    form.password = ''
    form.passwordConfirmation = ''
    
  } catch (error) {
    console.error('Erro ao carregar dados do usuário:', error)
    notificationStore.addNotification(
      'Não foi possível carregar os dados do usuário. Tente novamente.',
      'error',
      5000
    )
    router.push({ name: 'users' })
  } finally {
    loadingUser.value = false
  }
}

const validateForm = (): boolean => {
  let isValid = true
  errors.name = ''
  errors.email = ''
  errors.password = ''
  errors.passwordConfirmation = ''
  
  // Validar nome (obrigatório)
  if (!form.name.trim()) {
    errors.name = 'O nome é obrigatório'
    isValid = false
  }
  
  // Validar email (obrigatório e formato válido)
  if (!form.email.trim()) {
    errors.email = 'O email é obrigatório'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Formato de email inválido'
    isValid = false
  }
  
  // Validar senha (obrigatória para criação, opcional para edição)
  if (!isEditMode.value && !form.password) {
    errors.password = 'A senha é obrigatória'
    isValid = false
  } else if (form.password && form.password.length < 6) {
    errors.password = 'A senha deve ter pelo menos 6 caracteres'
    isValid = false
  }
  
  // Validar confirmação de senha
  if (form.password && form.password !== form.passwordConfirmation) {
    errors.passwordConfirmation = 'As senhas não coincidem'
    isValid = false
  }
  
  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    // Preparar dados para envio
    const userData: Partial<User> & { password?: string } = {
      name: form.name,
      email: form.email
    }
    
    // Adicionar senha apenas se foi preenchida
    if (form.password) {
      userData.password = form.password
    }
    
    if (isEditMode.value && userId.value) {
      // Atualizar usuário existente
      await usersService.updateUser(userId.value, userData)
      notificationStore.addNotification(
        'Usuário atualizado com sucesso!',
        'success',
        5000
      )
    } else {
      // Criar novo usuário
      await usersService.createUser({
        ...userData,
        password: form.password // Senha é obrigatória para criação
      } as any)
      notificationStore.addNotification(
        'Usuário criado com sucesso!',
        'success',
        5000
      )
    }
    
    // Redirecionar para a lista de usuários
    router.push({ name: 'users' })
  } catch (error: any) {
    console.error('Erro ao salvar usuário:', error)
    
    // Tratar erros de validação da API
    if (error.response && error.response.status === 422) {
      const validationErrors = error.response.data.errors
      
      if (validationErrors) {
        // Mapear erros de validação da API para o formulário
        if (validationErrors.name) errors.name = validationErrors.name[0]
        if (validationErrors.email) errors.email = validationErrors.email[0]
        if (validationErrors.password) errors.password = validationErrors.password[0]
      }
    } else {
      // Erro genérico
      notificationStore.addNotification(
        'Ocorreu um erro ao salvar o usuário. Tente novamente.',
        'error',
        5000
      )
    }
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.push({ name: 'users' })
}
</script>

<style scoped>
.user-form-view {
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 1.5rem;
}

.form-container {
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  overflow: hidden;
}

.form-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.form-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.form-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.user-form {
  padding: 1.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.25rem;
}

.form-input {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.input-error {
  border-color: #ef4444;
}

.error-message {
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.form-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button {
  background-color: #3b82f6;
  color: white;
}

.submit-button:hover {
  background-color: #2563eb;
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.cancel-button {
  background-color: #f3f4f6;
  color: #4b5563;
}

.cancel-button:hover {
  background-color: #e5e7eb;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .user-form-view {
    padding: 0.75rem;
  }
}
</style>
