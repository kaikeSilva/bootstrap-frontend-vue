<template>
  <main class="app-content" :class="contentClasses">
    <div class="breadcrumbs" v-if="breadcrumbs.length > 0">
      <template v-for="(crumb, index) in breadcrumbs" :key="index">
        <router-link 
          v-if="index < breadcrumbs.length - 1"
          :to="crumb.path"
          class="breadcrumb-item"
        >
          <i v-if="index === 0" class="fas fa-home"></i>
          {{ crumb.title }}
        </router-link>
        
        <span v-else class="breadcrumb-item active">
          {{ crumb.title }}
        </span>
        
        <i 
          v-if="index < breadcrumbs.length - 1" 
          class="fas fa-chevron-right breadcrumb-separator"
        ></i>
      </template>
    </div>
    
    <div class="content-wrapper">
      <slot></slot>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLayoutStore } from '@/stores/layout'

interface Breadcrumb {
  title: string
  path: string
}

const route = useRoute()
const layoutStore = useLayoutStore()

const breadcrumbs = computed<Breadcrumb[]>(() => {
  const crumbs: Breadcrumb[] = [
    { title: 'Home', path: '/admin/dashboard' }
  ]
  
  if (route.meta.title) {
    if (route.path.includes('/usuarios/novo')) {
      crumbs.push(
        { title: 'Usuários', path: '/admin/usuarios' },
        { title: 'Novo Usuário', path: route.path }
      )
    } else {
      crumbs.push({ 
        title: route.meta.title as string, 
        path: route.path 
      })
    }
  }
  
  return crumbs
})

const contentClasses = computed(() => ({
  'sidebar-collapsed': layoutStore.isSidebarCollapsed,
  'sidebar-hidden': !layoutStore.isSidebarVisible
}))
</script>

<style scoped lang="scss">
@import '@/styles/variables';
@import '@/styles/mixins';

.app-content {
  margin-left: $sidebar-width;
  margin-top: $header-height;
  min-height: calc(100vh - #{$header-height});
  background-color: $background-light;
  transition: margin-left $transition-speed;
  display: flex;
  flex-direction: column;
  width: calc(100% - $sidebar-width);
  
  @include dark-mode {
    background-color: $background-dark;
    color: white;
  }
  
  @include mobile-only {
    margin-left: 0;
    width: 100%;
  }
  
  &.sidebar-collapsed {
    margin-left: $sidebar-collapsed-width;
    width: calc(100% - #{$sidebar-collapsed-width});
    
    @include mobile-only {
      margin-left: 0;
      width: 100%;
    }
  }
  
  &.sidebar-hidden {
    margin-left: 0;
    width: 100%;
  }
}

.breadcrumbs {
  padding: 1rem 1.5rem;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @include dark-mode {
    background: #1e1e1e;
    border-bottom-color: #333;
  }
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  
  &.active {
    color: $primary-color;
    font-weight: 500;
  }
  
  i {
    font-size: 0.875rem;
  }
}

.breadcrumb-separator {
  font-size: 0.75rem;
  color: #999;
}

.content-wrapper {
  padding: 2rem 1.5rem;
  flex: 1;
  width: 100%;
  box-sizing: border-box;
}
</style>
