import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', () => {
  // Estado
  const sidebarVisible = ref(true)
  const sidebarCollapsed = ref(false)
  const darkMode = ref(false)
  const isMobile = ref(false)
  
  // Getters
  const isDarkMode = computed(() => darkMode.value)
  const isSidebarVisible = computed(() => sidebarVisible.value)
  const isSidebarCollapsed = computed(() => sidebarCollapsed.value)
  const isViewMobile = computed(() => isMobile.value)
  
  // Actions
  function toggleSidebar() {
    sidebarVisible.value = !sidebarVisible.value
  }
  
  function toggleSidebarCollapse() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
  
  function toggleDarkMode() {
    darkMode.value = !darkMode.value
  }
  
  function setSidebarVisible(value: boolean) {
    sidebarVisible.value = value
  }
  
  function setIsMobile(value: boolean) {
    isMobile.value = value
  }
  
  return {
    // Estado
    sidebarVisible,
    sidebarCollapsed,
    darkMode,
    isMobile,
    // Getters
    isDarkMode,
    isSidebarVisible,
    isSidebarCollapsed,
    isViewMobile,
    // Actions
    toggleSidebar,
    toggleSidebarCollapse,
    toggleDarkMode,
    setSidebarVisible,
    setIsMobile
  }
})
