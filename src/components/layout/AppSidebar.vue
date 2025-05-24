<template>
  <aside class="app-sidebar" :class="sidebarClasses">
    <div class="sidebar-header">
      <IconCube class="logo" :size="32" />
      <span class="brand-name" v-if="!layoutStore.isSidebarCollapsed">Admin Panel</span>
      
      <!-- Botão para fechar o menu no mobile -->
      <button 
        class="close-sidebar-btn" 
        @click="layoutStore.setSidebarVisible(false)"
        aria-label="Fechar menu"
      >
        <IconTimes :size="20" />
      </button>
      
      <!-- Botão para colapsar o menu no desktop -->
      <button 
        class="collapse-sidebar-btn" 
        @click="layoutStore.toggleSidebarCollapse()"
        aria-label="Colapsar menu"
      >
        <IconChevronLeft v-if="!layoutStore.isSidebarCollapsed" :size="20" />
        <IconChevronRight v-else :size="20" />
      </button>
    </div>
    
    <nav class="sidebar-menu">
      <template v-for="item in menuItems" :key="item.title">
        <div 
          class="menu-item"
          :class="{ 
            'has-children': item.children, 
            'active': (item.route && isActive(item.route)) || (item.children && hasActiveChild(item.children))
          }"
          @click="handleMenuClick(item)"
        >
          <component :is="iconMap[item.icon]" class="menu-icon" :size="24" />
          <span class="menu-text" v-if="!layoutStore.isSidebarCollapsed">
            {{ item.title }}
          </span>
          <IconChevronDown 
            v-if="item.children && !layoutStore.isSidebarCollapsed" 
            class="menu-arrow"
            :class="{ 'rotate': expandedItems.includes(item.title) }"
            :size="16"
          />
        </div>
        
        <div 
          v-if="item.children && expandedItems.includes(item.title) && !layoutStore.isSidebarCollapsed"
          class="submenu"
        >
          <div 
            v-for="child in item.children" 
            :key="child.title"
            class="submenu-item"
            :class="{ 'active': isActive(child.route) }"
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
import { ref, computed, type Component } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useLayoutStore } from '@/stores/layout'

// Importando os componentes de ícones
import IconCube from '@/components/icons/IconCube.vue'
import IconTimes from '@/components/icons/IconTimes.vue'
import IconChevronLeft from '@/components/icons/IconChevronLeft.vue'
import IconChevronRight from '@/components/icons/IconChevronRight.vue'
import IconChevronDown from '@/components/icons/IconChevronDown.vue'
import IconHome from '@/components/icons/IconHome.vue'
import IconUsers from '@/components/icons/IconUsers.vue'
import IconSignOut from '@/components/icons/IconSignOut.vue'

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
const route = useRoute()
const layoutStore = useLayoutStore()

const expandedItems = ref<string[]>([])

// Função para verificar se um item de menu está ativo
const isActive = (itemRoute: string) => {
  return route.path === itemRoute
}

// Função para verificar se um submenu tem algum item ativo
const hasActiveChild = (children: SubMenuItem[]) => {
  return children.some(child => isActive(child.route))
}

// Mapeamento de ícones para componentes
const iconMap: Record<string, Component> = {
  home: IconHome,
  users: IconUsers,
  signOut: IconSignOut
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: "home",
    route: "/admin/dashboard"
  },
  {
    title: "Clientes",
    icon: "users",
    route: "/admin/clientes"
  },
  {
    title: "Usuários",
    icon: "users",
    children: [
      { title: "Listar Usuários", route: "/admin/usuarios" },
      { title: "Novo Usuário", route: "/admin/usuarios/novo" }
    ]
  },
  {
    title: "Sair",
    icon: "signOut",
    route: "/logout"
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
  position: relative;
  
  .sidebar-collapsed & {
    justify-content: center;
  }
  
  .close-sidebar-btn {
    display: none;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 5px;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    line-height: 1;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    
    @include mobile-only {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  
  .collapse-sidebar-btn {
    position: absolute;
    right: 10px;
    bottom: -15px;
    background: #2c3e50;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    font-size: 0.8rem;
    cursor: pointer;
    padding: 3px;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 102;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    
    @include mobile-only {
      display: none;
    }
    
    .sidebar-collapsed & {
      right: -12px;
    }
  }
}

.logo {
  width: 32px;
  height: 32px;
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
  transition: background-color $transition-speed, border-left $transition-speed;
  position: relative;
  border-left: 3px solid transparent;
  
  &:hover {
    background-color: rgba(255,255,255,0.1);
  }
  
  &.active {
    background-color: rgba(255,255,255,0.1);
    border-left: 3px solid $primary-color;
    
    .menu-icon {
      color: $primary-color;
    }
    
    .menu-text {
      font-weight: 600;
    }
  }
  
  .sidebar-collapsed & {
    justify-content: center;
    
    &.active {
      border-left: 3px solid $primary-color;
    }
  }
}

.menu-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: #fff;
  display: inline-block;
  vertical-align: middle;
  margin-right: 10px;
  
  .sidebar-collapsed & {
    margin-right: 0;
  }
}

.menu-text {
  margin-left: 0.75rem;
  flex: 1;
}

.menu-arrow {
  transition: transform $transition-speed;
  width: 16px;
  height: 16px;
  color: #fff;
  margin-left: 5px;
  
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
  transition: background-color $transition-speed, border-left $transition-speed;
  position: relative;
  border-left: 3px solid transparent;
  
  &:hover {
    background-color: rgba(255,255,255,0.1);
  }
  
  &.active {
    background-color: rgba(255,255,255,0.1);
    border-left: 3px solid $primary-color;
    color: $primary-color;
    font-weight: 600;
  }
}
</style>
