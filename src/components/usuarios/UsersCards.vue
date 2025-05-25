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
    </div>
    
    <div class="user-card" v-for="user in users" :key="user.id">
      <div class="card-header">
        <div class="header-content">
          <h3 class="user-name">{{ user.name }}</h3>
          <div class="user-meta">
            <span class="meta-item">ID: {{ user.id }}</span>
            <span class="meta-item">Cadastro: {{ formatDate(user.created_at) }}</span>
          </div>
        </div>
        <div class="actions-menu">
          <button class="actions-button" @click="toggleMenu(user.id)">
            <IconEllipsis size="18" />
          </button>
          <div v-if="activeMenu === user.id" class="actions-dropdown">
              <div class="dropdown-item" @click="handleView(user.id)">
                <IconView />
                <span>Visualizar</span>
              </div>
              <div class="dropdown-item" @click="handleEdit(user.id)">
                <IconEdit />
                <span>Editar</span>
              </div>
              <div class="dropdown-item delete" @click="handleDelete(user.id)">
                <IconDelete />
                <span>Excluir</span>
              </div>
            </div>
        </div>
      </div>
      
      <div class="card-body">
        <div class="card-row">
          <span class="label">Email:</span>
          <span class="value">{{ user.email }}</span>
        </div>
        
        <div class="card-row">
          <span class="label">Data de Cadastro:</span>
          <span class="value">{{ formatDate(user.created_at) }}</span>
        </div>
        
        <div class="card-row">
          <span class="label">Última Atualização:</span>
          <span class="value">{{ formatDate(user.updated_at) }}</span>
        </div>
      </div>
    </div>
    
    <!-- Modal de confirmação de exclusão -->
    <ConfirmationModal
      :show="showDeleteModal"
      title="Excluir Usuário"
      :message="`Tem certeza que deseja excluir o usuário '${userToDelete?.name}'? Esta ação não pode ser desfeita.`"
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
import type { User, PaginationLinks } from '@/types/user.types'
import { usersService } from '@/services/usersService'
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
  users: User[];
  pagination?: PaginationInfo | null;
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'page-change', page: number): void;
  (e: 'per-page-change', perPage: number): void;
}>()

// Calculate pagination info for display
const paginationFrom = computed(() => {
  if (!props.pagination || props.users.length === 0) return 0
  return ((props.pagination.currentPage - 1) * props.pagination.perPage) + 1
})

const paginationTo = computed(() => {
  if (!props.pagination || props.users.length === 0) return 0
  return Math.min(
    paginationFrom.value + props.users.length - 1, 
    props.pagination.total
  )
})

const notificationStore = useNotificationStore()
const showDeleteModal = ref(false)
const userToDelete = ref<User | null>(null)
const isDeleting = ref(false)

// Controle do menu de ações
const activeMenu = ref<number | null>(null)
const toggleMenu = (userId: number) => {
  if (activeMenu.value === userId) {
    activeMenu.value = null
  } else {
    activeMenu.value = userId
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
const handleView = (userId: number) => {
  router.push({ name: 'user-details', params: { id: userId.toString() } })
  activeMenu.value = null
}

const handleEdit = (userId: number) => {
  router.push({ name: 'edit-user', params: { id: userId.toString() } })
  activeMenu.value = null
}

const handleDelete = (userId: number) => {
  // Encontrar o usuário a ser excluído
  const user = props.users.find(u => u.id === userId)
  if (user) {
    userToDelete.value = user
    showDeleteModal.value = true
  }
  activeMenu.value = null
}

const confirmDelete = async () => {
  if (!userToDelete.value?.id) return
  
  try {
    isDeleting.value = true
    
    // Chamar a API para excluir o usuário
    await usersService.deleteUser(userToDelete.value.id)
    
    // Fechar o modal
    showDeleteModal.value = false
    
    // Mostrar notificação de sucesso
    notificationStore.addNotification(
      `Usuário ${userToDelete.value.name} excluído com sucesso!`,
      'success',
      5000
    )
    
    // Recarregar a página para atualizar a lista
    router.go(0)
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
.cards-container {
  padding: 0;
}

@media (min-width: 768px) {
  .cards-container {
    display: none; /* Hidden on desktop */
  }
}

.cards-header {
  padding: 0.75rem;
  background-color: white;
  border-radius: 0.375rem 0.375rem 0 0;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  margin-bottom: 0.5rem;
}

.user-card {
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  margin-bottom: 0.75rem;
  overflow: hidden;
}

.card-header {
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-content {
  flex: 1;
}

.user-name {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: #111827;
}

.user-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #4b5563;
  font-weight: 500;
}

.actions-menu {
  position: relative;
}

.actions-button {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
}

.actions-button:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.actions-dropdown {
  position: absolute;
  right: 0;
  z-index: 10;
  width: 150px;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  padding: 0.5rem 0;
  margin-top: 0.25rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  cursor: pointer;
  color: #4b5563;
}

.dropdown-item:hover {
  background-color: #f3f4f6;
}

.dropdown-item.delete {
  color: #ef4444;
}

.dropdown-item.delete:hover {
  background-color: #fee2e2;
}

.dropdown-item svg {
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
}

.card-body {
  padding: 0.75rem;
}

.card-row {
  display: flex;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.card-row:last-child {
  margin-bottom: 0;
}

.label {
  font-weight: 600;
  color: #374151;
  width: 40%;
}

.value {
  color: #111827;
  flex: 1;
  font-weight: 500;
}
</style>
