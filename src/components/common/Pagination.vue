<template>
  <div v-if="totalPages >= 1" class="pagination-container">
    <div class="pagination-left">
      <div class="pagination-info">
        Mostrando {{ from }}-{{ to }} de {{ total }} resultados
      </div>
    </div>
    
    <div class="pagination-right">
      <div class="pagination-controls">
        <!-- First page button -->
        <button 
          class="pagination-button" 
          :class="{ disabled: currentPage === 1 }"
          :disabled="currentPage === 1"
          @click="onPageChange(1)"
          aria-label="Primeira página"
        >
          <IconChevronLeft class="double-icon" />
        </button>
        
        <!-- Previous page button -->
        <button 
          class="pagination-button" 
          :class="{ disabled: currentPage === 1 }"
          :disabled="currentPage === 1"
          @click="onPageChange(currentPage - 1)"
          aria-label="Página anterior"
        >
          <IconChevronLeft />
        </button>
        
        <!-- Page numbers -->
        <div class="pagination-pages">
          <template v-for="page in visiblePageNumbers" :key="page">
            <button 
              v-if="page !== '...'" 
              class="pagination-button page-number" 
              :class="{ active: currentPage === page }"
              @click="onPageChange(page)"
            >
              {{ page }}
            </button>
            <span v-else class="pagination-ellipsis">...</span>
          </template>
        </div>
        
        <!-- Next page button -->
        <button 
          class="pagination-button" 
          :class="{ disabled: currentPage === totalPages }"
          :disabled="currentPage === totalPages"
          @click="onPageChange(currentPage + 1)"
          aria-label="Próxima página"
        >
          <IconChevronRight />
        </button>
        
        <!-- Last page button -->
        <button 
          class="pagination-button" 
          :class="{ disabled: currentPage === totalPages }"
          :disabled="currentPage === totalPages"
          @click="onPageChange(totalPages)"
          aria-label="Última página"
        >
          <IconChevronRight class="double-icon" />
        </button>
      </div>
      
      <div class="pagination-per-page">
        <label for="per-page-select">Por página:</label>
        <select 
          id="per-page-select" 
          class="per-page-select"
          :value="perPage"
          @change="onPerPageChange(parseInt($event.target.value))"
        >
          <option v-for="option in perPageOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import IconChevronLeft from '@/components/icons/IconChevronLeft.vue'
import IconChevronRight from '@/components/icons/IconChevronRight.vue'

interface Props {
  currentPage: number;
  totalPages: number;
  perPage: number;
  total: number;
  from: number;
  to: number;
  perPageOptions?: number[];
}

const props = withDefaults(defineProps<Props>(), {
  perPageOptions: () => [15, 30, 50, 100]
})

const emit = defineEmits<{
  (e: 'page-change', page: number): void;
  (e: 'per-page-change', perPage: number): void;
}>()

const onPageChange = (page: number) => {
  if (page < 1 || page > props.totalPages || page === props.currentPage) return
  emit('page-change', page)
}

const onPerPageChange = (perPage: number) => {
  emit('per-page-change', perPage)
}

// Calculate visible page numbers with ellipsis for large page counts
const visiblePageNumbers = computed(() => {
  const { currentPage, totalPages } = props
  
  // If we have 7 or fewer pages, show all pages
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  
  // Always show first and last page
  const pages: (number | string)[] = []
  
  // First page
  pages.push(1)
  
  // Calculate middle pages with ellipsis
  if (currentPage <= 3) {
    // Near the start
    pages.push(2, 3, 4, '...', totalPages - 1)
  } else if (currentPage >= totalPages - 2) {
    // Near the end
    pages.push('...', totalPages - 3, totalPages - 2, totalPages - 1)
  } else {
    // In the middle
    pages.push('...', currentPage - 1, currentPage, currentPage + 1, '...')
  }
  
  // Last page
  pages.push(totalPages)
  
  return pages
})
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 0;
  padding: 0;
}

.pagination-left {
  display: flex;
  align-items: center;
}

.pagination-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.pagination-info {
  font-size: 0.75rem;
  color: #6b7280;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.125rem;
}

.pagination-pages {
  display: flex;
  align-items: center;
  gap: 0.125rem;
}

.pagination-button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 1.75rem;
  height: 1.75rem;
  padding: 0 0.375rem;
  border: 1px solid #e5e7eb;
  background-color: white;
  color: #374151;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-button:hover:not(.disabled, .active) {
  background-color: #f9fafb;
  border-color: #d1d5db;
}

.pagination-button.active {
  background-color: #2563eb;
  border-color: #2563eb;
  color: white;
}

.pagination-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-ellipsis {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 1.75rem;
  height: 1.75rem;
  color: #6b7280;
  font-size: 0.75rem;
}

.double-icon {
  position: relative;
}

.double-icon::after {
  content: '';
  position: absolute;
  width: 6px;
  height: 6px;
  border-left: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: rotate(45deg);
  left: 8px;
  top: 8px;
}

.pagination-per-page {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.pagination-per-page label {
  font-size: 0.75rem;
  color: #6b7280;
}

.per-page-select {
  padding: 0.125rem 0.375rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  background-color: white;
  font-size: 0.75rem;
  color: #374151;
  height: 1.75rem;
}

@media (max-width: 768px) {
  .pagination-container {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
  }
  
  .pagination-left {
    order: 1;
    width: 100%;
    margin-bottom: 0.25rem;
  }
  
  .pagination-right {
    order: 2;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
  }
  
  .pagination-controls {
    flex: 1;
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 0.25rem;
    /* Esconde a barra de rolagem mas mantém a funcionalidade */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE/Edge */
  }
  
  .pagination-controls::-webkit-scrollbar {
    display: none; /* Chrome/Safari/Opera */
  }
  
  .pagination-per-page {
    flex-shrink: 0;
    justify-content: flex-end;
  }
  
  /* Reduzir ainda mais o tamanho dos botões em telas muito pequenas */
  @media (max-width: 480px) {
    .pagination-button {
      min-width: 1.5rem;
      height: 1.5rem;
      padding: 0 0.25rem;
      font-size: 0.7rem;
    }
    
    .pagination-ellipsis {
      min-width: 1.5rem;
      height: 1.5rem;
      font-size: 0.7rem;
    }
    
    .per-page-select {
      height: 1.5rem;
      padding: 0 0.25rem;
      font-size: 0.7rem;
    }
    
    .pagination-per-page label {
      font-size: 0.7rem;
    }
  }
}
</style>
