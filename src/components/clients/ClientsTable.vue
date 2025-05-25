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
      <table class="clients-table">
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
            <th @click="handleSort('phone')" class="sortable-header">
              Telefone
              <IconSort 
                v-if="props.sortBy === 'phone'" 
                :type="props.sortDirection" 
                size="14" 
                class="sort-icon"
              />
            </th>
            <th @click="handleSort('address')" class="sortable-header">
              Endereço
              <IconSort 
                v-if="props.sortBy === 'address'" 
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
          <tr v-for="client in clients" :key="client.id" class="table-row">
            <td>
              <div class="client-name-container">
                <div class="client-name">{{ client.name }}</div>
                <div class="client-meta">
                  <span class="client-id">ID: {{ client.id }}</span>
                  <span class="client-date">Cadastro: {{ formatDate(client.created_at) }}</span>
                </div>
              </div>
            </td>
            <td>{{ client.email }}</td>
            <td>{{ client.phone || '-' }}</td>
            <td>{{ client.address || '-' }}</td>
            <td class="actions-cell">
              <div class="actions-menu">
                <button class="actions-button" @click="toggleMenu(client.id)">
                  <IconEllipsis size="18" />
                </button>
                <div v-if="activeMenu === client.id" class="actions-dropdown">
                  <div class="dropdown-item" @click="handleView(client.id)">
                    <IconView size="16" />
                    <span>Visualizar</span>
                  </div>
                  <div class="dropdown-item" @click="handleEdit(client.id)">
                    <IconEdit size="16" />
                    <span>Editar</span>
                  </div>
                  <div class="dropdown-item delete" @click="handleDelete(client.id)">
                    <IconDelete size="16" />
                    <span>Excluir</span>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useClientsStore } from '@/stores/clientsStore'
import type { Client, PaginationLinks } from '@/types/client.types'
import Pagination from '@/components/common/Pagination.vue'
import IconSort from '@/components/icons/IconSort.vue'
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
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'page-change', page: number): void;
  (e: 'per-page-change', perPage: number): void;
  (e: 'sort', field: string): void;
}>()

// Receber os valores de ordenação como props em vez de acessar o store diretamente
interface SortProps {
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}

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
  console.log(`Editar cliente ${clientId}`)
  activeMenu.value = null
}

const handleDelete = (clientId: number) => {
  console.log(`Excluir cliente ${clientId}`)
  activeMenu.value = null
}

const handleSort = (field: string) => {
  emit('sort', field)
}

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

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.table-container {
  display: none; /* Hidden by default (on mobile) */
  width: 100%;
  margin: 0;
  padding: 0;
}

.table-header {
  margin-bottom: 0.5rem;
}

.table-responsive {
  overflow-x: auto;
  width: 100%;
  margin: 0;
  padding: 0;
}

.clients-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 0; /* Removed border radius */
  overflow: hidden;
  box-shadow: none; /* Removed shadow */
}

.clients-table th,
.clients-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.clients-table th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
}

.sortable-header {
  cursor: pointer;
  position: relative;
  padding-right: 1.5rem;
  user-select: none;
}

.sortable-header:hover {
  background-color: #f3f4f6;
}

.sort-icon {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
}

.clients-table td {
  color: #111827; /* Darker text color for better readability */
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
  vertical-align: middle;
}

.client-name-container {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.client-name {
  font-weight: 500;
  color: #111827;
}

.client-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.client-id, .client-date {
  display: inline-block;
}

.table-row:hover {
  background-color: #f9fafb;
}

/* Estilos para a coluna de ações */
.actions-header {
  width: 80px;
  text-align: center;
}

.actions-cell {
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

@media (min-width: 768px) {
  .table-container {
    display: block;
  }
}
</style>
