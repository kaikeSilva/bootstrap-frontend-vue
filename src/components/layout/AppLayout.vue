<template>
  <div class="app-layout" :class="layoutClasses">
    <AppSidebar />
    <AppHeader />
    <AppContent>
      <router-view />
    </AppContent>
    
    <div 
      v-if="showOverlay"
      class="sidebar-overlay"
      @click="layoutStore.setSidebarVisible(false)"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useLayoutStore } from '@/stores/layout'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import AppContent from './AppContent.vue'

const layoutStore = useLayoutStore()

const layoutClasses = computed(() => ({
  'dark-mode': layoutStore.isDarkMode,
  'sidebar-collapsed': layoutStore.isSidebarCollapsed,
  'is-mobile': layoutStore.isViewMobile
}))

const showOverlay = computed(() => {
  return layoutStore.isSidebarVisible && window.innerWidth <= 768
})

function handleResize() {
  const isMobile = window.innerWidth <= 768
  layoutStore.setIsMobile(isMobile)
  
  if (!isMobile) {
    layoutStore.setSidebarVisible(true)
  } else {
    layoutStore.setSidebarVisible(false)
  }
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
@import '@/styles/variables';
@import '@/styles/mixins';

.app-layout {
  min-height: 100vh;
  position: relative;
  
  &.is-mobile {
    .app-content {
      margin-left: 0;
      width: 100%;
    }
  }
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
  
  @include desktop-only {
    display: none;
  }
}
</style>
