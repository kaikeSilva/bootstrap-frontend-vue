<template>
  <div class="clients-view">
    <main class="page-content">
      <div class="filter-section">
        <ClientsFilter 
          @filter="handleFilter"
          @clear="handleClearFilter"
        />
      </div>
      
      <LoadingSpinner v-if="loading" />
      
      <ErrorMessage 
        v-else-if="error" 
        :message="error"
        @retry="handleRetry"
      />
      
      <div v-else-if="clients.length === 0" class="empty-state">
        <p>Nenhum cliente encontrado.</p>
      </div>
      
      <div v-else>
        <ClientsTable 
          :clients="clients" 
          :pagination="{
            currentPage: currentPage,
            lastPage: lastPage,
            perPage: perPage,
            total: total,
            links: paginationLinks
          }"
          @page-change="handlePageChange"
          @per-page-change="handlePerPageChange"
        />
        <ClientsCards 
          :clients="clients"
          :pagination="{
            currentPage: currentPage,
            lastPage: lastPage,
            perPage: perPage,
            total: total,
            links: paginationLinks
          }"
          @page-change="handlePageChange"
          @per-page-change="handlePerPageChange"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useClientsStore } from '@/stores/clientsStore'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import ClientsTable from '@/components/clients/ClientsTable.vue'
import ClientsCards from '@/components/clients/ClientsCards.vue'
import ClientsFilter from '@/components/clients/ClientsFilter.vue'
import Pagination from '@/components/common/Pagination.vue'

const clientsStore = useClientsStore()
const { 
  clients, 
  loading, 
  error, 
  currentPage, 
  lastPage, 
  perPage, 
  total,
  paginationLinks,
  activeFilters 
} = storeToRefs(clientsStore)

// Calculate pagination info
const hasPagination = computed(() => total.value > 0)
const paginationFrom = computed(() => {
  if (clients.value.length === 0) return 0
  return ((currentPage.value - 1) * perPage.value) + 1
})
const paginationTo = computed(() => {
  if (clients.value.length === 0) return 0
  return Math.min(paginationFrom.value + clients.value.length - 1, total.value)
})

const handleRetry = () => {
  clientsStore.clearError()
  clientsStore.fetchClients(currentPage.value, perPage.value)
}

const handlePageChange = (page: number) => {
  clientsStore.fetchClients(page, perPage.value)
}

const handlePerPageChange = (newPerPage: number) => {
  // When changing items per page, go back to page 1
  clientsStore.fetchClients(1, newPerPage)
}

const handleFilter = (filters: Record<string, string>) => {
  // Aplicar filtros e voltar para a página 1
  clientsStore.fetchClients(1, perPage.value, filters)
}

const handleClearFilter = () => {
  // Limpar filtros e recarregar dados
  clientsStore.clearFilters()
}

onMounted(() => {
  clientsStore.fetchClients(currentPage.value, perPage.value)
})
</script>

<style scoped>
.clients-view {
  min-height: 100vh;
  background-color: #f9fafb;
}



.page-content {
  padding: 0; /* Removed all padding to allow table to use full width */
}

.filter-section {
  padding: 0.5rem 0.5rem 0 0.5rem;
  background-color: #f9fafb;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  margin: 1rem;
  background: white;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

.empty-state p {
  color: #6b7280;
  font-size: 1.125rem;
  margin: 0;
}
</style>
