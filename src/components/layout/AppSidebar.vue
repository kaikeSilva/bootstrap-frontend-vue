<template>
  <aside class="app-sidebar" :class="sidebarClasses">
    <div class="sidebar-header">
      <i class="fas fa-cube logo"></i>
      <span class="brand-name" v-if="!layoutStore.isSidebarCollapsed">Admin Panel</span>
    </div>
    
    <nav class="sidebar-menu">
      <template v-for="item in menuItems" :key="item.title">
        <div 
          class="menu-item"
          :class="{ 'has-children': item.children }"
          @click="handleMenuClick(item)"
        >
          <i :class="item.icon"></i>
          <span class="menu-text" v-if="!layoutStore.isSidebarCollapsed">
            {{ item.title }}
          </span>
          <i 
            v-if="item.children && !layoutStore.isSidebarCollapsed" 
            class="fas fa-chevron-down menu-arrow"
            :class="{ 'rotate': expandedItems.includes(item.title) }"
          ></i>
        </div>
        
        <div 
          v-if="item.children && expandedItems.includes(item.title) && !layoutStore.isSidebarCollapsed"
          class="submenu"
        >
          <div 
            v-for="child in item.children" 
            :key="child.title"
            class="submenu-item"
            @click="navigateTo(child.route)"
          >
            {{ child.title }}
          </div>
        </div>
      </template>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLayoutStore } from '@/stores/layout'

interface MenuItem {
  title: string
  icon: string
  route?: string
  children?: SubMenuItem[]
}

interface SubMenuItem {
  title: string
  route: string
}

const router = useRouter()
const layoutStore = useLayoutStore()

const expandedItems = ref<string[]>([])

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: "fas fa-home",
    route: "/admin/dashboard"
  },
  {
    title: "Usuários",
    icon: "fas fa-users",
    children: [
      { title: "Listar Usuários", route: "/admin/usuarios" },
      { title: "Novo Usuário", route: "/admin/usuarios/novo" }
    ]
  }
]

const sidebarClasses = computed(() => ({
  'sidebar-visible': layoutStore.isSidebarVisible,
  'sidebar-collapsed': layoutStore.isSidebarCollapsed
}))

function handleMenuClick(item: MenuItem) {
  if (item.children) {
    const index = expandedItems.value.indexOf(item.title)
    if (index > -1) {
      expandedItems.value.splice(index, 1)
    } else {
      expandedItems.value.push(item.title)
    }
  } else if (item.route) {
    navigateTo(item.route)
  }
}

function navigateTo(route: string) {
  router.push(route)
  
  // Fechar o menu em dispositivos móveis após a navegação
  if (window.innerWidth <= 768) {
    layoutStore.setSidebarVisible(false)
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables';
@import '@/styles/mixins';

.app-sidebar {
  width: $sidebar-width;
  background: #2c3e50;
  color: white;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 101;
  transition: all $transition-speed;
  transform: translateX(0);
  
  &:not(.sidebar-visible) {
    transform: translateX(-100%);
    
    @include desktop-only {
      transform: translateX(0);
    }
  }
  
  &.sidebar-collapsed {
    width: $sidebar-collapsed-width;
  }
  
  @include dark-mode {
    background: #1a1a1a;
  }
  
  @include mobile-only {
    &.sidebar-visible {
      width: 100%;
    }
  }
}

.sidebar-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  height: $header-height;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  
  .sidebar-collapsed & {
    justify-content: center;
  }
}

.logo {
  font-size: 32px;
  color: #fff;
  flex-shrink: 0;
}

.brand-name {
  margin-left: 0.75rem;
  font-size: 1.25rem;
  font-weight: bold;
  white-space: nowrap;
}

.sidebar-menu {
  padding: 1rem 0;
  overflow-y: auto;
  height: calc(100vh - #{$header-height});
  @include scrollbar-custom;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color $transition-speed;
  position: relative;
  
  &:hover {
    background-color: rgba(255,255,255,0.1);
  }
  
  .sidebar-collapsed & {
    justify-content: center;
  }
}

.menu-item i {
  width: 24px;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.menu-text {
  margin-left: 0.75rem;
  flex: 1;
}

.menu-arrow {
  transition: transform $transition-speed;
  font-size: 0.75rem;
  
  &.rotate {
    transform: rotate(180deg);
  }
}

.submenu {
  background-color: rgba(0,0,0,0.1);
}

.submenu-item {
  padding: 0.5rem 1rem 0.5rem 3.5rem;
  cursor: pointer;
  transition: background-color $transition-speed;
  
  &:hover {
    background-color: rgba(255,255,255,0.1);
  }
}
</style>
