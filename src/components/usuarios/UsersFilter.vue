<template>
  <div class="filter-container">
    <div class="filter-form">
      <div class="filter-left">
        <div class="filter-group">
          <input 
            type="text" 
            v-model="filterState.busca" 
            placeholder="Buscar em todos os campos..." 
            class="filter-input"
            @keyup.enter="applyFilters"
          />
        </div>
        
        <div class="filter-actions">
          <button 
            class="filter-button filter-button-clear" 
            @click="clearFilters"
            :disabled="!hasActiveFilters"
          >
            Limpar
          </button>
          <button 
            class="filter-button filter-button-apply" 
            @click="applyFilters"
          >
            Buscar
          </button>
        </div>
      </div>
      
      <div class="filter-right">
        <button 
          class="filter-button filter-button-advanced" 
          @click="showAdvancedFilters = !showAdvancedFilters"
          :class="{ 'active': showAdvancedFilters }"
          :title="showAdvancedFilters ? 'Ocultar filtros avançados' : 'Mostrar filtros avançados'"
        >
          <IconFilter :size="16" />
          <span class="filter-button-text">Filtros</span>
        </button>
        
        <button 
          class="filter-button filter-button-add" 
          @click="$emit('add-user')"
          title="Adicionar novo usuário"
        >
          <IconAdd :size="16" />
          <span class="filter-button-text">Adicionar</span>
        </button>
      </div>
    </div>
    
    <div v-if="showAdvancedFilters" class="advanced-filters">
      <div class="filter-row">
        <div class="filter-group">
          <label for="filter-id">ID</label>
          <input 
            id="filter-id" 
            type="number" 
            v-model="filterState.id" 
            placeholder="ID exato" 
            class="filter-input"
          />
        </div>
        
        <div class="filter-group">
          <label for="filter-name">Nome</label>
          <input 
            id="filter-name" 
            type="text" 
            v-model="filterState.name" 
            placeholder="Nome do usuário" 
            class="filter-input"
          />
        </div>
      </div>
      
      <div class="filter-row">
        <div class="filter-group">
          <label for="filter-email">Email</label>
          <input 
            id="filter-email" 
            type="text" 
            v-model="filterState.email" 
            placeholder="Email do usuário" 
            class="filter-input"
          />
        </div>
        
        <div class="filter-group">
          <label for="filter-created-at">Data de cadastro</label>
          <input 
            id="filter-created-at" 
            type="date" 
            v-model="filterState.created_at" 
            class="filter-input"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import IconFilter from '@/components/icons/IconFilter.vue'
import IconAdd from '@/components/icons/IconAdd.vue'

interface FilterState {
  busca: string;
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

const emit = defineEmits<{
  (e: 'filter', filters: Record<string, string>): void;
  (e: 'clear'): void;
  (e: 'add-user'): void;
}>()

const showAdvancedFilters = ref(false)

const filterState = reactive<FilterState>({
  busca: '',
  id: '',
  name: '',
  email: '',
  created_at: '',
  updated_at: ''
})

const hasActiveFilters = computed(() => {
  return Object.values(filterState).some(value => value !== '')
})

const applyFilters = () => {
  // Criar objeto de filtros apenas com valores não vazios
  const filters: Record<string, string> = {}
  
  Object.entries(filterState).forEach(([key, value]) => {
    if (value !== '') {
      filters[key] = value
    }
  })
  
  emit('filter', filters)
}

const clearFilters = () => {
  // Limpar todos os filtros
  Object.keys(filterState).forEach(key => {
    filterState[key as keyof FilterState] = ''
  })
  
  emit('clear')
}
</script>

<style scoped>
.filter-container {
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  padding: 0.75rem;
  margin-bottom: 0.5rem;
}

.filter-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.filter-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.filter-right {
  display: flex;
  gap: 0.5rem;
}

.filter-group {
  flex: 1;
  min-width: 0;
}

.filter-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.filter-actions {
  display: flex;
  gap: 0.5rem;
  margin-left: 0.5rem;
}

.filter-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.filter-button-text {
  margin-left: 0.25rem;
}

.filter-button-apply {
  background-color: #3b82f6;
  color: white;
}

.filter-button-apply:hover {
  background-color: #2563eb;
}

.filter-button-clear {
  background-color: #f3f4f6;
  color: #4b5563;
}

.filter-button-clear:hover {
  background-color: #e5e7eb;
}

.filter-button-clear:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.filter-button-advanced {
  background-color: #f3f4f6;
  color: #4b5563;
}

.filter-button-advanced:hover,
.filter-button-advanced.active {
  background-color: #e5e7eb;
}

.filter-button-add {
  background-color: #10b981;
  color: white;
}

.filter-button-add:hover {
  background-color: #059669;
}

.advanced-filters {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
}

.filter-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.filter-row:last-child {
  margin-bottom: 0;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.25rem;
}

@media (max-width: 768px) {
  .filter-form {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-left {
    margin-bottom: 0.75rem;
  }
  
  .filter-right {
    justify-content: space-between;
  }
  
  .filter-row {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>
