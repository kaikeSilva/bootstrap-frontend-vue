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
            placeholder="Nome do cliente" 
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
            placeholder="Email do cliente" 
            class="filter-input"
          />
        </div>
        
        <div class="filter-group">
          <label for="filter-phone">Telefone</label>
          <input 
            id="filter-phone" 
            type="text" 
            v-model="filterState.phone" 
            placeholder="Telefone do cliente" 
            class="filter-input"
          />
        </div>
      </div>
      
      <div class="filter-row">
        <div class="filter-group">
          <label for="filter-address">Endereço</label>
          <input 
            id="filter-address" 
            type="text" 
            v-model="filterState.address" 
            placeholder="Endereço do cliente" 
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

interface FilterState {
  busca: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
}

const emit = defineEmits<{
  (e: 'filter', filters: Record<string, string>): void;
  (e: 'clear'): void;
}>()

const showAdvancedFilters = ref(false)

const filterState = reactive<FilterState>({
  busca: '',
  id: '',
  name: '',
  email: '',
  phone: '',
  address: '',
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
  margin-bottom: 0.5rem;
}

.filter-left {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex: 1;
}

.filter-right {
  display: flex;
  justify-content: flex-end;
}

.filter-group {
  flex: 1;
  min-width: 0;
}

.filter-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #111827;
}

.filter-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}

.filter-actions {
  display: flex;
  gap: 0.5rem;
}

.filter-button {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-button-clear {
  border: 1px solid #d1d5db;
  background-color: white;
  color: #4b5563;
}

.filter-button-clear:hover:not(:disabled) {
  background-color: #f3f4f6;
}

.filter-button-clear:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.filter-button-apply {
  border: none;
  background-color: #3b82f6;
  color: white;
}

.filter-button-apply:hover {
  background-color: #2563eb;
}

.filter-button-advanced {
  border: 1px solid #d1d5db;
  background-color: white;
  color: #4b5563;
}

.filter-button-advanced:hover {
  background-color: #f3f4f6;
}

.filter-button-advanced.active {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.filter-button-text {
  display: inline-block;
}

.advanced-filters {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  animation: slideDown 0.3s ease-out;
}

.filter-row {
  display: flex;
  gap: 1rem;
}

.filter-group label {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.25rem;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsividade */
@media (max-width: 768px) {
  .filter-left {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    gap: 0.5rem;
  }
  
  .filter-form {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .filter-right {
    margin-top: 0.5rem;
    width: 100%;
  }
  
  .filter-button-advanced {
    width: 100%;
    justify-content: center;
  }
  
  .filter-row {
    flex-direction: column;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .filter-left {
    flex: 1;
  }
  
  .filter-group {
    max-width: 300px;
  }
}
</style>
