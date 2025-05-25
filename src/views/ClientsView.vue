<template>
  <div class="clients-view">
    <header class="page-header">
      <h1 class="page-title">Clientes</h1>
      <p class="page-description">Visualize todos os clientes cadastrados</p>
    </header>

    <main class="page-content">
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
  paginationLinks 
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

onMounted(() => {
  clientsStore.fetchClients(currentPage.value, perPage.value)
})
</script>

<style scoped>
.clients-view {
  min-height: 100vh;
  background-color: #f9fafb;
}

.page-header {
  background: white;
  padding: 1rem 2rem; /* Reduced vertical padding from 2rem to 1rem */
  border-bottom: 1px solid #e5e7eb;
}

.page-title {
  font-size: 1.5rem; /* Reduced from 2rem to 1.5rem */
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.25rem 0; /* Reduced bottom margin from 0.5rem to 0.25rem */
}

.page-description {
  color: #6b7280;
  margin: 0;
  font-size: 0.875rem; /* Reduced from 1rem to 0.875rem */
}

.page-content {
  padding: 0; /* Removed all padding to allow table to use full width */
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
</style>
