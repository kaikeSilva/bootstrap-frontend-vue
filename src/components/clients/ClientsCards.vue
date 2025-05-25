<template>
  <div class="cards-container">
    <div class="cards-header" v-if="pagination && pagination.total >= 0">
      <Pagination 
        :current-page="pagination.currentPage"
        :total-pages="pagination.lastPage"
        :per-page="pagination.perPage"
        :total="pagination.total"
        :from="paginationFrom"
        :to="paginationTo"
        @page-change="$emit('page-change', $event)"
        @per-page-change="$emit('per-page-change', $event)"
      />
      <Pagination
        v-if="pagination?.links"
        :links="pagination.links"
        :meta="pagination"
        @page-change="$emit('page-change', $event)"
        @per-page-change="$emit('per-page-change', $event)"
      />
    </div>
    
    <div class="client-card" v-for="client in clients" :key="client.id">
      <div class="card-header">
        <div class="header-content">
          <h3 class="client-name">{{ client.name }}</h3>
          <div class="client-meta">
            <span class="meta-item">ID: {{ client.id }}</span>
            <span class="meta-item">Cadastro: {{ formatDate(client.created_at) }}</span>
          </div>
        </div>
        <div class="actions-menu">
          <button class="actions-button" @click="toggleMenu(client.id)">
            <IconEllipsis size="18" />
          </button>
          <div v-if="activeMenu === client.id" class="actions-dropdown">
              <div class="dropdown-item" @click="handleView(client.id)">
                <IconView />
                <span>Visualizar</span>
              </div>
              <div class="dropdown-item" @click="handleEdit(client.id)">
                <IconEdit />
                <span>Editar</span>
              </div>
              <div class="dropdown-item delete" @click="handleDelete(client.id)">
                <IconDelete />
                <span>Excluir</span>
              </div>
            </div>
        </div>
      </div>
      
      <div class="card-body">
        <div class="card-row">
          <span class="label">Email:</span>
          <span class="value">{{ client.email }}</span>
        </div>
        
        <div class="card-row">
          <span class="label">Telefone:</span>
          <span class="value">{{ client.phone || '-' }}</span>
        </div>
        
        <div class="card-row">
          <span class="label">Endereço:</span>
          <span class="value">{{ client.address || '-' }}</span>
        </div>
      </div>
    </div>
    
    <!-- Modal de confirmação de exclusão -->
    <ConfirmationModal
      :show="showDeleteModal"
      title="Excluir Cliente"
      :message="`Tem certeza que deseja excluir o cliente '${clientToDelete?.name}'? Esta ação não pode ser desfeita.`"
      confirmText="Excluir"
      cancelText="Cancelar"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Client, PaginationLinks } from '@/types/client.types'
import { clientsService } from '@/services/clientsService'
import { useNotificationStore } from '@/stores/notificationStore'
import ConfirmationModal from '@/components/common/ConfirmationModal.vue'
import Pagination from '@/components/common/Pagination.vue'
import IconEllipsis from '@/components/icons/IconEllipsis.vue'
import IconView from '@/components/icons/IconView.vue'
import IconEdit from '@/components/icons/IconEdit.vue'
import IconDelete from '@/components/icons/IconDelete.vue'

const router = useRouter()

interface PaginationInfo {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  links: PaginationLinks | null;
}

interface Props {
  clients: Client[];
  pagination?: PaginationInfo | null;
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'page-change', page: number): void;
  (e: 'per-page-change', perPage: number): void;
}>()

// Calculate pagination info for display
const paginationFrom = computed(() => {
  if (!props.pagination || props.clients.length === 0) return 0
  return ((props.pagination.currentPage - 1) * props.pagination.perPage) + 1
})

const paginationTo = computed(() => {
  if (!props.pagination || props.clients.length === 0) return 0
  return Math.min(
    paginationFrom.value + props.clients.length - 1, 
    props.pagination.total
  )
})

const notificationStore = useNotificationStore()
const showDeleteModal = ref(false)
const clientToDelete = ref<Client | null>(null)
const isDeleting = ref(false)

// Controle do menu de ações
const activeMenu = ref<number | null>(null)
const toggleMenu = (clientId: number) => {
  if (activeMenu.value === clientId) {
    activeMenu.value = null
  } else {
    activeMenu.value = clientId
  }
}

// Fechar o menu quando clicar fora dele
const closeMenuOnClickOutside = (event: MouseEvent) => {
  if (activeMenu.value !== null) {
    const target = event.target as HTMLElement
    if (!target.closest('.actions-menu')) {
      activeMenu.value = null
    }
  }
}

// Adicionar e remover o listener quando o componente é montado/desmontado
onMounted(() => {
  document.addEventListener('click', closeMenuOnClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenuOnClickOutside)
})

// Ações do menu
const handleView = (clientId: number) => {
  router.push({ name: 'client-details', params: { id: clientId.toString() } })
  activeMenu.value = null
}

const handleEdit = (clientId: number) => {
  router.push({ name: 'edit-client', params: { id: clientId.toString() } })
  activeMenu.value = null
}

const handleDelete = (clientId: number) => {
  // Encontrar o cliente a ser excluído
  const client = props.clients.find(c => c.id === clientId)
  if (client) {
    clientToDelete.value = client
    showDeleteModal.value = true
  }
  activeMenu.value = null
}

const confirmDelete = async () => {
  if (!clientToDelete.value?.id) return
  
  try {
    isDeleting.value = true
    
    // Chamar a API para excluir o cliente
    await clientsService.deleteClient(clientToDelete.value.id)
    
    // Fechar o modal
    showDeleteModal.value = false
    
    // Mostrar notificação de sucesso
    notificationStore.addNotification(
      `Cliente ${clientToDelete.value.name} excluído com sucesso!`,
      'success',
      5000
    )
    
    // Emitir evento para atualizar a lista de clientes
    emit('page-change', props.pagination?.currentPage || 1)
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



const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
</script>

<style scoped>
.cards-container {
  padding: 0;
}

.cards-header {
  margin-bottom: 0.5rem;
}

.client-card {
  background: white;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  border: 1px solid #e5e7eb;
  overflow: hidden;
  margin: 0 0.5rem 0.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.client-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.client-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.meta-item {
  display: inline-block;
}

/* Estilos para o menu de ações */
.actions-menu {
  position: relative;
  display: inline-block;
}

.actions-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  color: #6b7280;
  transition: all 0.2s;
}

.actions-button:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.actions-dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  min-width: 150px;
  z-index: 10;
  margin-top: 5px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  color: #374151;
}

.dropdown-item:hover {
  background-color: #f9fafb;
}

.dropdown-item.delete {
  color: #ef4444;
}

.dropdown-item.delete:hover {
  background-color: #fee2e2;
}

.card-body {
  padding: 1rem;
}

.card-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.card-row:last-child {
  margin-bottom: 0;
}

.label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.value {
  color: #6b7280;
  font-size: 0.875rem;
  text-align: right;
  word-break: break-word;
  max-width: 60%;
}

@media (min-width: 768px) {
  .cards-container {
    display: none;
  }
}
</style>
