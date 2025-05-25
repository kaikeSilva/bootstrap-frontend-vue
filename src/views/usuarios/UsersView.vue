<template>
  <div class="users-view">
    <main class="page-content">
      <div class="filter-section">
        <UsersFilter 
          @filter="handleFilter"
          @clear="handleClearFilter"
          @add-user="handleAddUser"
        />
      </div>
      
      <LoadingSpinner v-if="loading" />
      
      <ErrorMessage 
        v-else-if="error" 
        :message="error"
        @retry="handleRetry"
      />
      
      <div v-else-if="users.length === 0" class="empty-state">
        <p>Nenhum usuário encontrado.</p>
      </div>
      
      <div v-else>
        <UsersTable 
          :users="users" 
          :pagination="{
            currentPage: currentPage,
            lastPage: lastPage,
            perPage: perPage,
            total: total,
            links: paginationLinks
          }"
          :sort-by="sortBy"
          :sort-direction="sortDirection"
          @page-change="handlePageChange"
          @per-page-change="handlePerPageChange"
          @sort="handleSort"
        />
        <UsersCards 
          :users="users"
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
import { onMounted, computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useUsersStore } from '@/stores/usersStore'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import UsersTable from '@/components/usuarios/UsersTable.vue'
import UsersCards from '@/components/usuarios/UsersCards.vue'
import UsersFilter from '@/components/usuarios/UsersFilter.vue'
import Pagination from '@/components/common/Pagination.vue'

const router = useRouter()
const usersStore = useUsersStore()

const { 
  users, 
  loading, 
  error, 
  currentPage, 
  lastPage, 
  perPage, 
  total,
  paginationLinks,
  activeFilters,
  sortBy,
  sortDirection 
} = storeToRefs(usersStore)

// Calculate pagination info
const hasPagination = computed(() => total.value > 0)
const paginationFrom = computed(() => {
  if (users.value.length === 0) return 0
  return ((currentPage.value - 1) * perPage.value) + 1
})
const paginationTo = computed(() => {
  if (users.value.length === 0) return 0
  return Math.min(paginationFrom.value + users.value.length - 1, total.value)
})

const handleRetry = () => {
  usersStore.clearError()
  usersStore.fetchUsers(currentPage.value, perPage.value)
}

const handlePageChange = (page: number) => {
  usersStore.fetchUsers(page, perPage.value)
}

const handlePerPageChange = (newPerPage: number) => {
  // When changing items per page, go back to page 1
  usersStore.fetchUsers(1, newPerPage)
}

const handleFilter = (filters: Record<string, string>) => {
  // Aplicar filtros e voltar para a página 1
  usersStore.fetchUsers(1, perPage.value, filters)
}

const handleClearFilter = () => {
  // Limpar filtros e recarregar dados
  usersStore.clearFilters()
}

const handleAddUser = () => {
  // Navegar para a página de cadastro de usuário
  router.push({ name: 'new-user' })
}

const handleSort = async (field: string) => {
  // Se clicar no mesmo campo, inverte a direção
  if (field === sortBy.value) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    // Se clicar em um novo campo, define como ascendente
    sortBy.value = field
    sortDirection.value = 'asc'
  }

  // Recarregar usuários com a nova ordenação
  await usersStore.fetchUsers(
    currentPage.value, 
    perPage.value, 
    Object.keys(activeFilters).length > 0 ? { ...activeFilters } : undefined,
    { sortBy: sortBy.value, direction: sortDirection.value }
  )
}

onMounted(() => {
  usersStore.fetchUsers(currentPage.value, perPage.value)
})
</script>

<style scoped>
.users-view {
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
