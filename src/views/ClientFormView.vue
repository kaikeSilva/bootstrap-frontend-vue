<template>
  <div class="client-form-view">
    <div class="form-container">
      <div class="form-header">
        <h1 class="form-title">{{ isEditMode ? 'Editar Cliente' : 'Novo Cliente' }}</h1>
        <p class="form-description">
          {{ isEditMode ? 'Edite os dados do cliente' : 'Preencha os dados para cadastrar um novo cliente' }}
        </p>
      </div>
      
      <form @submit.prevent="handleSubmit" class="client-form">
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
            <label for="email" class="form-label">Email</label>
            <input 
              id="email" 
              v-model="form.email" 
              type="email" 
              class="form-input"
              :class="{ 'input-error': errors.email }"
              placeholder="email@exemplo.com"
            />
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="phone" class="form-label">Telefone</label>
            <input 
              id="phone" 
              v-model="form.phone" 
              type="tel" 
              class="form-input"
              placeholder="(00) 00000-0000"
              v-mask="'(##) #####-####'"
              @change="updatePhone"
            />
          </div>
          
          <div class="form-group">
            <label for="address" class="form-label">Endereço</label>
            <input 
              id="address" 
              v-model="form.address" 
              type="text" 
              class="form-input"
              placeholder="Rua, número, bairro, cidade, estado"
            />
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
import { clientsService } from '@/services/clientsService'
import { vMask } from '@/directives/mask'
import type { Client } from '@/types/client.types'
import { useNotificationStore } from '@/stores/notificationStore'

interface ClientForm {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface FormErrors {
  name?: string;
  email?: string;
}

const router = useRouter()
const route = useRoute()
const notificationStore = useNotificationStore()
const loading = ref(false)
const loadingClient = ref(false)
const clientId = ref<number | null>(null)

// Determinar se estamos no modo de edição ou criação
const isEditMode = computed(() => !!clientId.value)

const form = reactive<ClientForm>({
  name: '',
  email: '',
  phone: '',
  address: ''
})

const errors = reactive<FormErrors>({})

// Carregar dados do cliente se estiver no modo de edição
onMounted(async () => {
  // Verificar se temos um ID na rota
  if (route.params.id) {
    const id = parseInt(route.params.id as string)
    if (!isNaN(id)) {
      clientId.value = id
      await loadClientData(id)
    }
  }
})

// Função para carregar os dados do cliente
const loadClientData = async (id: number) => {
  loadingClient.value = true
  
  try {
    const client = await clientsService.getClientById(id)
    
    // Preencher o formulário com os dados do cliente
    form.name = client.name
    form.email = client.email || ''
    form.phone = client.phone || ''
    form.address = client.address || ''
    
  } catch (error) {
    console.error('Erro ao carregar dados do cliente:', error)
    alert('Não foi possível carregar os dados do cliente. Tente novamente.')
    router.push({ name: 'clients' })
  } finally {
    loadingClient.value = false
  }
}

const validateForm = (): boolean => {
  let isValid = true
  errors.name = ''
  errors.email = ''
  
  // Validar nome (obrigatório)
  if (!form.name.trim()) {
    errors.name = 'O nome é obrigatório'
    isValid = false
  }
  
  // Validar email (formato válido, se preenchido)
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Formato de email inválido'
    isValid = false
  }
  
  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    if (isEditMode.value && clientId.value) {
      // Atualizar cliente existente
      await clientsService.updateClient(clientId.value, form)
      notificationStore.addNotification(
        'Cliente atualizado com sucesso!',
        'success',
        5000
      )
    } else {
      // Criar novo cliente
      await clientsService.createClient(form)
      notificationStore.addNotification(
        'Cliente criado com sucesso!',
        'success',
        5000
      )
    }
    
    // Redirecionar para a lista de clientes
    router.push({ name: 'clients' })
  } catch (error) {
    console.error(`Erro ao ${isEditMode.value ? 'atualizar' : 'criar'} cliente:`, error)
    // Exibir mensagem de erro no formulário em vez de um alert
    errors.name = `Ocorreu um erro ao ${isEditMode.value ? 'atualizar' : 'criar'} o cliente. Tente novamente.`
    notificationStore.addNotification(
      `Ocorreu um erro ao ${isEditMode.value ? 'atualizar' : 'criar'} o cliente.`,
      'error',
      5000
    )
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.push({ name: 'clients' })
}

const updatePhone = (event: Event) => {
  // Atualizar o valor do telefone no modelo
  const input = event.target as HTMLInputElement
  form.phone = input.value
  console.log('Telefone atualizado:', form.phone)
}
</script>

<style scoped>
.client-form-view {
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.form-container {
  width: 100%;
  margin: 0 auto;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
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
  margin: 0 0 0.25rem 0;
}

.form-description {
  color: #6b7280;
  margin: 0;
  font-size: 0.875rem;
}

.client-form {
  padding: 1.5rem;
}

.form-row {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.25rem;
}

.form-group {
  flex: 1;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.375rem;
}

.form-input {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #111827;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}

.input-error {
  border-color: #ef4444;
}

.input-error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 1px #ef4444;
}

.error-message {
  display: block;
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.form-button {
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-button {
  background-color: white;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.cancel-button:hover {
  background-color: #f3f4f6;
}

.submit-button {
  background-color: #3b82f6;
  color: white;
  border: none;
}

.submit-button:hover:not(:disabled) {
  background-color: #2563eb;
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .client-form-view {
    padding: 1rem;
  }
  
  .form-container {
    border-radius: 0.375rem;
  }
  
  .form-header,
  .client-form {
    padding: 1rem;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 0;
  }
  
  .form-group {
    margin-bottom: 0.75rem;
  }
  
  .form-actions {
    flex-direction: column-reverse;
    gap: 0.5rem;
  }
  
  .form-button {
    width: 100%;
  }
}
</style>
