<template>
  <div class="client-details-container">

    <div v-if="loading" class="loading-container">
      <LoadingSpinner />
    </div>

    <div v-else-if="error" class="error-container">
      <ErrorMessage :message="error" />
    </div>

    <div v-else-if="client" class="client-details">
      <div class="tabs">
        <div class="tab active">Dados Gerais</div>
      </div>

      <div class="tab-content">
        <div class="client-header">
          <div class="client-header-main">
            <h2 class="client-name">{{ client.name }}</h2>
            <div class="client-actions">
              <button @click="handleEdit" class="edit-button">
                <IconEdit class="icon" />
                Editar Cliente
              </button>
              <button @click="showDeleteModal = true" class="delete-button">
                <IconTrash class="icon" />
                Excluir Cliente
              </button>
            </div>
          </div>
          <div class="client-meta">
            <span class="meta-item">ID: {{ client.id }}</span>
            <span class="meta-item">Cadastro: {{ formatDate(client.created_at) }}</span>
          </div>
        </div>

        <div class="data-section">
          <div class="data-row">
            <div class="data-label">Nome:</div>
            <div class="data-value">{{ client.name }}</div>
          </div>
          <div class="data-row">
            <div class="data-label">Email:</div>
            <div class="data-value">{{ client.email }}</div>
          </div>
          <div class="data-row">
            <div class="data-label">Telefone:</div>
            <div class="data-value">{{ client.phone || '-' }}</div>
          </div>
          <div class="data-row">
            <div class="data-label">Endereço:</div>
            <div class="data-value">{{ client.address || '-' }}</div>
          </div>
          <div class="data-row">
            <div class="data-label">Data de Cadastro:</div>
            <div class="data-value">{{ formatDate(client.created_at) }}</div>
          </div>
          <div class="data-row">
            <div class="data-label">Última Atualização:</div>
            <div class="data-value">{{ formatDate(client.updated_at) }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="empty-state">
      <p>Cliente não encontrado</p>
    </div>
    
    <!-- Modal de confirmação de exclusão -->
    <ConfirmationModal
      :show="showDeleteModal"
      title="Excluir Cliente"
      :message="`Tem certeza que deseja excluir o cliente '${client?.name}'? Esta ação não pode ser desfeita.`"
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
import { clientsService } from '@/services/clientsService'
import type { Client } from '@/types/client.types'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import IconEdit from '@/components/icons/IconEdit.vue'
import IconTrash from '@/components/icons/IconTrash.vue'
import ConfirmationModal from '@/components/common/ConfirmationModal.vue'
import { useNotificationStore } from '@/stores/notificationStore'

const route = useRoute()
const router = useRouter()
const client = ref<Client | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const notificationStore = useNotificationStore()
const showDeleteModal = ref(false)
const isDeleting = ref(false)

const handleEdit = () => {
  if (client.value?.id) {
    notificationStore.addNotification(
      'Redirecionando para a edição...',
      'info',
      2000
    )
    
    router.push({ name: 'edit-client', params: { id: client.value.id.toString() } })
  }
}

const handleDelete = async () => {
  if (!client.value?.id) return
  
  try {
    isDeleting.value = true
    
    // Chamar a API para excluir o cliente
    await clientsService.deleteClient(client.value.id)
    
    // Fechar o modal
    showDeleteModal.value = false
    
    // Mostrar notificação de sucesso
    notificationStore.addNotification(
      `Cliente ${client.value.name} excluído com sucesso!`,
      'success',
      5000
    )
    
    // Redirecionar para a lista de clientes
    router.push({ name: 'clients' })
  } catch (err) {
    console.error('Erro ao excluir cliente:', err)
    
    // Mostrar notificação de erro
    notificationStore.addNotification(
      'Ocorreu um erro ao excluir o cliente. Tente novamente.',
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
    const clientId = parseInt(route.params.id as string)
    console.log('ID do cliente:', clientId)
    
    if (isNaN(clientId)) {
      throw new Error('ID do cliente inválido')
    }
    
    // Buscar os dados do cliente
    console.log('Buscando dados do cliente...')
    const response = await clientsService.getClientById(clientId)
    console.log('Dados recebidos:', response)
    
    client.value = response
    console.log('Cliente atualizado:', client.value)
    
    loading.value = false
  } catch (err) {
    loading.value = false
    error.value = err instanceof Error ? err.message : 'Erro ao carregar os dados do cliente'
    console.error('Erro ao carregar cliente:', err)
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
.client-details-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
}



.client-actions {
  display: flex;
  gap: 0.75rem;
  margin-left: 1rem;
}

.edit-button, .delete-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
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

.edit-button .icon, .delete-button .icon {
  width: 1rem;
  height: 1rem;
}

.loading-container, .error-container {
  display: flex;
  justify-content: center;
  padding: 3rem 0;
}

.client-header {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
}

.client-header-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.client-name {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  flex: 1;
}

.client-meta {
  display: flex;
  gap: 1rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.meta-item {
  display: inline-block;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1.5rem;
}

.tab {
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab.active {
  color: #4f46e5;
  border-bottom-color: #4f46e5;
}

.client-header {
  margin-bottom: 2rem;
}

.client-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.client-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.meta-item {
  display: inline-block;
}

.data-section {
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.data-row {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
}

.data-row:last-child {
  border-bottom: none;
}

.data-label {
  flex: 0 0 200px;
  padding: 1rem;
  background-color: #f9fafb;
  font-weight: 500;
  color: #374151;
}

.data-value {
  flex: 1;
  padding: 1rem;
  color: #111827;
}

@media (max-width: 768px) {
  .data-row {
    flex-direction: column;
  }
  
  .data-label {
    flex: none;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .client-meta {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>
