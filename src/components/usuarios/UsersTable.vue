<template>
  <div class="table-container">
    <div class="table-header" v-if="pagination && pagination.total >= 0">
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
    
    <div class="table-responsive">
      <table class="users-table">
        <thead>
          <tr>
            <th @click="handleSort('name')" class="sortable-header">
              Nome
              <IconSort 
                v-if="props.sortBy === 'name'" 
                :type="props.sortDirection" 
                size="14" 
                class="sort-icon"
              />
            </th>
            <th @click="handleSort('email')" class="sortable-header">
              Email
              <IconSort 
                v-if="props.sortBy === 'email'" 
                :type="props.sortDirection" 
                size="14" 
                class="sort-icon"
              />
            </th>
            <th @click="handleSort('created_at')" class="sortable-header">
              Data de Cadastro
              <IconSort 
                v-if="props.sortBy === 'created_at'" 
                :type="props.sortDirection" 
                size="14" 
                class="sort-icon"
              />
            </th>
            <th class="actions-header">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="table-row">
            <td>
              <div class="user-name-container">
                <div class="user-name">{{ user.name }}</div>
                <div class="user-meta">
                  <span class="user-id">ID: {{ user.id }} - index: {{ users.indexOf(user) + 1 }} - users.length: {{ users.length }} </span>
                </div>
              </div>
            </td>
            <td>{{ user.email }}</td>
            <td>{{ formatDate(user.created_at) }}</td>
            <td class="actions-cell" 
            :style="{ position: users.length === users.indexOf(user) + 1 ? 'absolute' : '', borderBottom: users.length === users.indexOf(user) + 1 ? 'none' : '' }">
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
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Div extra para garantir espaço para o menu de ações -->
      <div class="table-spacer"></div>
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUsersStore } from '@/stores/usersStore'
import { usersService } from '@/services/usersService'
import { useNotificationStore } from '@/stores/notificationStore'
import type { User, PaginationLinks } from '@/types/user.types'
import Pagination from '@/components/common/Pagination.vue'
import ConfirmationModal from '@/components/common/ConfirmationModal.vue'
import IconSort from '@/components/icons/IconSort.vue'
import IconEllipsis from '@/components/icons/IconEllipsis.vue'
import IconView from '@/components/icons/IconView.vue'
import IconEdit from '@/components/icons/IconEdit.vue'
import IconDelete from '@/components/icons/IconDelete.vue'

const router = useRouter()
const notificationStore = useNotificationStore()
const showDeleteModal = ref(false)
const userToDelete = ref<User | null>(null)
const isDeleting = ref(false)

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
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'page-change', page: number): void;
  (e: 'per-page-change', perPage: number): void;
  (e: 'sort', field: string): void;
  (e: 'delete', userId: number): void;
}>()

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
    
    // Emitir evento para atualizar a lista
    emit('delete', userToDelete.value.id)
  } catch (err) {
    console.error('Erro ao excluir usuário:', err)
    
    // Mostrar notificação de erro
    notificationStore.addNotification(
      'Ocorreu um erro ao excluir o usuário. Tente novamente.',
      'error',
      5000
    )
  } finally {
    isDeleting.value = false
  }
}

const handleSort = (field: string) => {
  emit('sort', field)
}

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
.table-container {
  display: none; /* Hidden by default (on mobile) */
}

@media (min-width: 768px) {
  .table-container {
    display: block;
    background-color: white;
    border-radius: 0.375rem;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    margin-bottom: 1rem;
  }
}

.table-header {
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.table-responsive {
  position: relative;
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  color: #111827;
  font-weight: 400;
}

.users-table th {
  font-weight: 600;
  color: #1f2937;
  background-color: #f3f4f6;
}

.sortable-header {
  cursor: pointer;
  position: relative;
  padding-right: 1.5rem;
}

.sort-icon {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
}

.table-row:hover {
  background-color: #f9fafb;
}

.user-name-container {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: #111827;
}

.user-meta {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #4b5563;
  font-weight: 500;
}

.user-id, .user-date {
  white-space: nowrap;
}

.actions-header {
  width: 80px;
  text-align: center;
}

.actions-cell {
  width: 80px;
  text-align: center;
  position: relative;
}

.actions-menu {
  position: relative;
  display: inline-block;
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

.table-spacer {
  height: 150px;
}
</style>
