<template>
  <div class="cards-container">
    <div class="client-card" v-for="client in clients" :key="client.id">
      <div class="card-header">
        <h3 class="client-name">{{ client.name }}</h3>
        <span class="client-id">#{{ client.id }}</span>
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
        
        <div class="card-row">
          <span class="label">Cadastrado em:</span>
          <span class="value">{{ formatDate(client.created_at) }}</span>
        </div>
      </div>
    </div>
    
    <div class="cards-pagination" v-if="pagination && pagination.total >= 0">
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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Client, PaginationLinks } from '@/types/client.types'
import Pagination from '@/components/common/Pagination.vue'

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
.cards-container {
  display: grid;
  gap: 1rem;
  padding: 1rem;
}

.client-card {
  background: white;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.client-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.client-id {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
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

.cards-pagination {
  margin-top: 1.5rem;
  padding: 0 0.5rem;
}

@media (min-width: 768px) {
  .cards-container {
    display: none;
  }
}
</style>
