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
            <th @click="handleSort('id')" class="sortable-header">
              ID
              <IconSort 
                v-if="props.sortBy === 'id'" 
                :type="props.sortDirection" 
                size="14" 
                class="sort-icon"
              />
            </th>
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
            <th @click="handleSort('created_at')" class="sortable-header">
              Data de Cadastro
              <IconSort 
                v-if="props.sortBy === 'created_at'" 
                :type="props.sortDirection" 
                size="14" 
                class="sort-icon"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="client in clients" :key="client.id" class="table-row">
            <td>{{ client.id }}</td>
            <td>{{ client.name }}</td>
            <td>{{ client.email }}</td>
            <td>{{ client.phone || '-' }}</td>
            <td>{{ client.address || '-' }}</td>
            <td>{{ formatDate(client.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useClientsStore } from '@/stores/clientsStore'
import type { Client, PaginationLinks } from '@/types/client.types'
import Pagination from '@/components/common/Pagination.vue'
import IconSort from '@/components/icons/IconSort.vue'

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
  font-weight: 500; /* Slightly bolder text */
}

.table-row:hover {
  background-color: #f9fafb;
}

@media (min-width: 768px) {
  .table-container {
    display: block;
  }
}
</style>
