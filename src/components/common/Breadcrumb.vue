<template>
  <div class="breadcrumbs">
    <template v-for="(item, index) in items" :key="index">
      <router-link 
        v-if="index < items.length - 1" 
        :to="item.to" 
        class="breadcrumb-item"
      >
        <IconHome v-if="index === 0" class="breadcrumb-icon" />
        {{ item.text }}
      </router-link>
      <span v-else class="breadcrumb-item active">
        {{ item.text }}
      </span>
      
      <IconChevronRight 
        v-if="index < items.length - 1" 
        class="breadcrumb-separator"
        size="12"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import IconHome from '@/components/icons/IconHome.vue'
import IconChevronRight from '@/components/icons/IconChevronRight.vue'

interface BreadcrumbItem {
  text: string;
  to: string | { name: string; params?: Record<string, string> };
}

defineProps<{
  items: BreadcrumbItem[];
}>();
</script>

<style scoped>
.breadcrumbs {
  padding: 0.5rem 1rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  margin-bottom: 1.5rem;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #666;
  padding: 0.25rem 0.5rem;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-item:hover {
  color: #4f46e5;
}

.breadcrumb-item.active {
  color: #4f46e5;
  font-weight: 500;
}

.breadcrumb-separator {
  margin: 0 4px;
  color: #6c757d;
}

.breadcrumb-icon {
  width: 12px;
  height: 12px;
  margin-right: 2px;
  vertical-align: -1px;
}

/* Dark mode styles */
@media (prefers-color-scheme: dark) {
  .breadcrumbs {
    background: #1e1e1e;
    border-bottom-color: #333;
  }
  
  .breadcrumb-item {
    color: #aaa;
  }
  
  .breadcrumb-item.active {
    color: #7c7cff;
  }
  
  .breadcrumb-separator {
    color: #777;
  }
}
</style>
