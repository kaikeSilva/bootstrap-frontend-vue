<template>
  <div class="table-container">
    <div class="table-responsive">
      <table class="clients-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Endereço</th>
            <th>Data de Cadastro</th>
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
import type { Client } from '@/types/client.types'

interface Props {
  clients: Client[]
}

defineProps<Props>()

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
