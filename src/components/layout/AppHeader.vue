<template>
  <header class="app-header">
    <button class="menu-toggle" @click="handleMenuToggle">
      <IconBars />
    </button>
    
    <div class="header-title">
      <h1>Painel Administrativo</h1>
    </div>
    
    <div class="header-actions">
      <button class="theme-toggle" @click="layoutStore.toggleDarkMode()">
        <IconSun v-if="layoutStore.isDarkMode" />
        <IconMoon v-else />
      </button>
      
      <span class="user-name">{{ userStore.userName }}</span>
      <img 
        :src="userStore.userAvatar" 
        :alt="userStore.userName"
        class="user-avatar"
      >
      
      <button class="logout-btn" @click="userStore.logout()">
        <IconSignOut />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useLayoutStore } from '@/stores/layout'
import { useUserStore } from '@/stores/user'
import IconBars from '@/components/icons/IconBars.vue'
import IconSun from '@/components/icons/IconSun.vue'
import IconMoon from '@/components/icons/IconMoon.vue'
import IconSignOut from '@/components/icons/IconSignOut.vue'
import IconSupport from '@/components/icons/IconSupport.vue'
const layoutStore = useLayoutStore()
const userStore = useUserStore()

function handleMenuToggle() {
  if (window.innerWidth <= 768) {
    layoutStore.toggleSidebar()
  } else {
    layoutStore.toggleSidebarCollapse()
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables';
@import '@/styles/mixins';

.app-header {
  height: $header-height;
  background: white;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  box-shadow: $shadow-sm;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 100;
  
  @include dark-mode {
    background: #1e1e1e;
    color: white;
  }
}

.menu-toggle,
.theme-toggle,
.logout-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color $transition-speed;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    
    @include dark-mode {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}

.header-title {
  flex: 1;
  margin-left: 1rem;
  
  h1 {
    font-size: 1.25rem;
    margin: 0;
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  @include mobile-only {
    display: none;
  }
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
}
</style>
