<template>
  <div class="user-details-container" >

    <div v-if="loading" class="loading-container">
      <LoadingSpinner />
    </div>

    <div v-else-if="error" class="error-container">
      <ErrorMessage :message="error" />
    </div>

    <div v-else-if="user" class="user-details">
      <div class="tabs">
        <div class="tab active">Dados Gerais</div>
      </div>

      <div class="tab-content">
        <div class="user-header">
          <div class="user-header-main">
            <h2 class="user-name">{{ user.name }}</h2>
            <div class="user-actions">
              <button @click="handleEdit" class="edit-button">
                <IconEdit class="icon" />
                Editar Usuário
              </button>
              <button @click="showDeleteModal = true" class="delete-button">
                <IconTrash class="icon" />
                Excluir Usuário
              </button>
            </div>
          </div>
          <div class="user-meta">
            <span class="meta-item">ID: {{ user.id }}</span>
            <span class="meta-item">Cadastro: {{ formatDate(user.created_at) }}</span>
          </div>
        </div>

        <div class="data-section">
          <div class="data-row">
            <div class="data-label">Nome:</div>
            <div class="data-value">{{ user.name }}</div>
          </div>
          <div class="data-row">
            <div class="data-label">Email:</div>
            <div class="data-value">{{ user.email }}</div>
          </div>
          <div class="data-row">
            <div class="data-label">Data de Cadastro:</div>
            <div class="data-value">{{ formatDate(user.created_at) }}</div>
          </div>
          <div class="data-row">
            <div class="data-label">Última Atualização:</div>
            <div class="data-value">{{ formatDate(user.updated_at) }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="empty-state">
      <p>Usuário não encontrado</p>
    </div>
    
    <!-- Modal de confirmação de exclusão -->
    <ConfirmationModal
      :show="showDeleteModal"
      title="Excluir Usuário"
      :message="`Tem certeza que deseja excluir o usuário '${user?.name}'? Esta ação não pode ser desfeita.`"
      confirmText="Excluir"
      cancelText="Cancelar"
      @close="showDeleteModal = false"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usersService } from '@/services/usersService'
import type { User } from '@/types/user.types'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import IconEdit from '@/components/icons/IconEdit.vue'
import IconTrash from '@/components/icons/IconTrash.vue'
import ConfirmationModal from '@/components/common/ConfirmationModal.vue'
import { useNotificationStore } from '@/stores/notificationStore'

const route = useRoute()
const router = useRouter()
const user = ref<User | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const notificationStore = useNotificationStore()
const showDeleteModal = ref(false)
const isDeleting = ref(false)

const handleEdit = () => {
  if (user.value?.id) {
    notificationStore.addNotification(
      'Redirecionando para a edição...',
      'info',
      2000
    )
    
    router.push({ name: 'edit-user', params: { id: user.value.id.toString() } })
  }
}

const handleDelete = async () => {
  if (!user.value?.id) return
  
  try {
    isDeleting.value = true
    
    // Chamar a API para excluir o usuário
    await usersService.deleteUser(user.value.id)
    
    // Fechar o modal
    showDeleteModal.value = false
    
    // Mostrar notificação de sucesso
    notificationStore.addNotification(
      `Usuário ${user.value.name} excluído com sucesso!`,
      'success',
      5000
    )
    
    // Redirecionar para a lista de usuários
    router.push({ name: 'users' })
  } catch (err) {
    console.error('Erro ao excluir usuário:', err)
    
    // Mostrar notificação de erro
    notificationStore.addNotification(
      'Ocorreu um erro ao excluir o usuário. Tente novamente.',
      'error',
      5000
    )
    
    // Fechar o modal
    showDeleteModal.value = false
  } finally {
    isDeleting.value = false
  }
}

onMounted(async () => {
  try {
    const userId = parseInt(route.params.id as string)
    console.log('ID do usuário:', userId)
    
    if (isNaN(userId)) {
      throw new Error('ID do usuário inválido')
    }
    
    // Buscar os dados do usuário
    console.log('Buscando dados do usuário...')
    const response = await usersService.getUserById(userId)
    console.log('Dados recebidos:', response)
    
    user.value = response
    console.log('Usuário atualizado:', user.value)
    
    loading.value = false
  } catch (err) {
    loading.value = false
    error.value = err instanceof Error ? err.message : 'Erro ao carregar os dados do usuário'
    console.error('Erro ao carregar usuário:', err)
  }
})

const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
</script>

<style scoped>
.user-details-container {
  width: 100%;
  padding: 1.5rem;
}

.user-details {
  width: 100%;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  overflow: hidden;
}

.loading-container,
.error-container {
  display: flex;
  justify-content: center;
  padding: 3rem;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

.tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
}

.tab {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.tab.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.tab-content {
  padding: 1.5rem;
}

.user-header {
  margin-bottom: 1.5rem;
}

.user-header-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.user-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.user-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-button,
.delete-button {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-button {
  background-color: #3b82f6;
  color: white;
}

.edit-button:hover {
  background-color: #2563eb;
}

.delete-button {
  background-color: #ef4444;
  color: white;
}

.delete-button:hover {
  background-color: #dc2626;
}

.icon {
  margin-right: 0.25rem;
  width: 16px;
  height: 16px;
}

.user-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #4b5563;
  font-weight: 500;
}

.data-section {
  background-color: #f9fafb;
  border-radius: 0.375rem;
  padding: 1rem;
}

.data-row {
  display: flex;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.data-row:last-child {
  border-bottom: none;
}

.data-label {
  width: 200px;
  font-weight: 600;
  color: #374151;
}

.data-value {
  flex: 1;
  color: #111827;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

.empty-state p {
  color: #6b7280;
  font-size: 1.125rem;
  margin: 0;
}

@media (max-width: 768px) {
  .user-details-container {
    padding: 0.75rem;
  }
  
  .user-header-main {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .user-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .data-row {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .data-label {
    width: 100%;
  }
}
</style>
