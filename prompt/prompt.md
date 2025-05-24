# Guia de Desenvolvimento: Painel Administrativo Vue 3

## Fase 1: Preparação do Ambiente

### Tarefa 1.1: Verificar Ambiente Docker

#### Objetivo
Verificar se o ambiente Docker está funcionando corretamente

#### Arquivo
N/A - Comando de terminal

#### Código
```bash
docker compose exec vue-app node --version
```

#### Validação
```bash
docker compose ps
```

#### Critério de Sucesso
- [ ] Comando retorna versão do Node.js
- [ ] Container vue-app está rodando
- [ ] Sem erros de conexão

---

### Tarefa 1.2: Instalar Font Awesome

#### Objetivo
Instalar o pacote Font Awesome para ícones

#### Arquivo
N/A - Comando de terminal

#### Código
```bash
docker compose exec vue-app npm install @fortawesome/fontawesome-free
```

#### Validação
```bash
docker compose exec vue-app npm list @fortawesome/fontawesome-free
```

#### Critério de Sucesso
- [ ] Pacote instalado sem erros
- [ ] Aparece na lista de dependências
- [ ] Versão 6.x instalada

---

### Tarefa 1.3: Instalar Sass

#### Objetivo
Instalar o pré-processador Sass

#### Arquivo
N/A - Comando de terminal

#### Código
```bash
docker compose exec vue-app npm install -D sass
```

#### Validação
```bash
docker compose exec vue-app npm list sass
```

#### Critério de Sucesso
- [ ] Sass instalado como devDependency
- [ ] Sem erros de instalação
- [ ] Versão compatível com Vite

---

## Fase 2: Estrutura de Diretórios

### Tarefa 2.1: Criar Diretórios Base

#### Objetivo
Criar estrutura de diretórios para componentes

#### Arquivo
N/A - Comandos de terminal

#### Código
```bash
docker compose exec vue-app mkdir -p src/components/layout
docker compose exec vue-app mkdir -p src/stores
docker compose exec vue-app mkdir -p src/styles
```

#### Validação
```bash
docker compose exec vue-app ls -la src/components/
```

#### Critério de Sucesso
- [ ] Diretório layout criado
- [ ] Diretório stores criado
- [ ] Diretório styles criado

---

## Fase 3: Configuração de Estilos Base

### Tarefa 3.1: Criar Arquivo de Variáveis Sass

#### Objetivo
Criar arquivo com variáveis básicas do sistema

#### Arquivo
`src/styles/_variables.scss`

#### Código
```scss
// Cores principais
$primary-color: #1976d2;
$secondary-color: #424242;

// Backgrounds
$background-light: #f5f5f5;
$background-dark: #121212;

// Dimensões
$header-height: 64px;
$sidebar-width: 260px;
$sidebar-collapsed-width: 64px;

// Breakpoints
$mobile: 768px;
$tablet: 1024px;

// Sombras
$shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
$shadow-md: 0 4px 6px rgba(0,0,0,0.15);

// Transições
$transition-speed: 0.3s;
```

#### Validação
```bash
docker compose exec vue-app npm run type-check
```

#### Critério de Sucesso
- [ ] Arquivo criado com todas as variáveis
- [ ] Sem erros de sintaxe
- [ ] Type-check passa

---

### Tarefa 3.2: Criar Mixins Básicos

#### Objetivo
Criar arquivo com mixins reutilizáveis

#### Arquivo
`src/styles/_mixins.scss`

#### Código
```scss
@import './variables';

@mixin dark-mode {
  .dark-mode & {
    @content;
  }
}

@mixin mobile-only {
  @media (max-width: $mobile) {
    @content;
  }
}

@mixin tablet-only {
  @media (min-width: #{$mobile + 1px}) and (max-width: $tablet) {
    @content;
  }
}

@mixin desktop-only {
  @media (min-width: #{$tablet + 1px}) {
    @content;
  }
}

@mixin center-flex {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin scrollbar-custom {
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: $background-light;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
}
```

#### Validação
```bash
docker compose exec vue-app npm run type-check
```

#### Critério de Sucesso
- [ ] Arquivo criado com todos os mixins
- [ ] Importa variáveis corretamente
- [ ] Sem erros de sintaxe

---

### Tarefa 3.3: Criar Classes Utilitárias

#### Objetivo
Criar arquivo com classes CSS reutilizáveis

#### Arquivo
`src/styles/_utilities.scss`

#### Código
```scss
@import './variables';
@import './mixins';

.flex-center {
  @include center-flex;
}

.text-muted {
  color: #666;
  
  @include dark-mode {
    color: #999;
  }
}

.hover-highlight {
  transition: background-color $transition-speed;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    
    @include dark-mode {
      background-color: rgba(255, 255, 255, 0.05);
    }
  }
}

.transition-all {
  transition: all $transition-speed ease;
}

.shadow-sm {
  box-shadow: $shadow-sm;
}

.shadow-md {
  box-shadow: $shadow-md;
}
```

#### Validação
```bash
docker compose exec vue-app npm run type-check
```

#### Critério de Sucesso
- [ ] Arquivo criado com todas as classes
- [ ] Usa mixins e variáveis
- [ ] Sem erros de sintaxe

---

### Tarefa 3.4: Importar Font Awesome no Main.ts

#### Objetivo
Adicionar importação do Font Awesome no arquivo principal

#### Arquivo
`src/main.ts`

#### Código
```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Import Font Awesome
import '@fortawesome/fontawesome-free/css/all.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
```

#### Validação
```bash
docker compose exec vue-app npm run type-check
```

#### Critério de Sucesso
- [ ] Font Awesome importado
- [ ] Sem erros de importação
- [ ] Type-check passa

---

## Fase 4: Store Global (Pinia)

### Tarefa 4.1: Criar Store de Layout

#### Objetivo
Criar store Pinia para gerenciar estado do layout

#### Arquivo
`src/stores/layout.ts`

#### Código
```typescript
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', () => {
  // Estado
  const sidebarVisible = ref(true)
  const sidebarCollapsed = ref(false)
  const darkMode = ref(false)
  
  // Getters
  const isDarkMode = computed(() => darkMode.value)
  const isSidebarVisible = computed(() => sidebarVisible.value)
  const isSidebarCollapsed = computed(() => sidebarCollapsed.value)
  
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
  
  return {
    // Estado
    sidebarVisible,
    sidebarCollapsed,
    darkMode,
    // Getters
    isDarkMode,
    isSidebarVisible,
    isSidebarCollapsed,
    // Actions
    toggleSidebar,
    toggleSidebarCollapse,
    toggleDarkMode,
    setSidebarVisible
  }
})
```

#### Validação
```bash
docker compose exec vue-app npm run type-check
```

#### Critério de Sucesso
- [ ] Store criada sem erros
- [ ] Type-check passa
- [ ] Todas as funções definidas

---

### Tarefa 4.2: Criar Store de Usuário

#### Objetivo
Criar store para dados mockados do usuário

#### Arquivo
`src/stores/user.ts`

#### Código
```typescript
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

interface User {
  id: number
  name: string
  email: string
  avatar: string
}

export const useUserStore = defineStore('user', () => {
  // Estado mockado
  const currentUser = ref<User>({
    id: 1,
    name: 'João Silva',
    email: 'joao.silva@example.com',
    avatar: 'https://ui-avatars.com/api/?name=João+Silva&background=1976d2&color=fff'
  })
  
  // Getters
  const userName = computed(() => currentUser.value.name)
  const userEmail = computed(() => currentUser.value.email)
  const userAvatar = computed(() => currentUser.value.avatar)
  
  // Action mockada
  function logout() {
    console.log('Logout chamado - não implementado')
  }
  
  return {
    currentUser,
    userName,
    userEmail,
    userAvatar,
    logout
  }
})
```

#### Validação
```bash
docker compose exec vue-app npm run type-check
```

#### Critério de Sucesso
- [ ] Store de usuário criada
- [ ] Interface User definida
- [ ] Type-check passa

---

## Fase 5: Componente Header

### Tarefa 5.1: Criar Estrutura Básica do Header

#### Objetivo
Criar componente AppHeader com HTML básico

#### Arquivo
`src/components/layout/AppHeader.vue`

#### Código
```vue
<template>
  <header class="app-header">
    <button class="menu-toggle">
      <i class="fas fa-bars"></i>
    </button>
    
    <div class="header-title">
      <h1>Painel Administrativo</h1>
    </div>
    
    <div class="header-actions">
      <span class="user-name">João Silva</span>
      <img 
        src="https://ui-avatars.com/api/?name=João+Silva&background=1976d2&color=fff" 
        alt="Avatar"
        class="user-avatar"
      >
    </div>
  </header>
</template>

<script setup lang="ts">
// Lógica será adicionada depois
</script>

<style scoped lang="scss">
.app-header {
  height: 64px;
  background: white;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.menu-toggle {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
}

.header-title {
  flex: 1;
  margin-left: 1rem;
}

.header-title h1 {
  font-size: 1.25rem;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
</style>
```

#### Validação
```bash
docker compose exec vue-app npm run type-check
```

#### Critério de Sucesso
- [ ] Componente criado com estrutura HTML
- [ ] Estilos básicos aplicados
- [ ] Type-check passa

---

### Tarefa 5.2: Adicionar Lógica ao Header

#### Objetivo
Conectar o Header com as stores Pinia

#### Arquivo
`src/components/layout/AppHeader.vue`

#### Código
```vue
<template>
  <header class="app-header">
    <button class="menu-toggle" @click="handleMenuToggle">
      <i class="fas fa-bars"></i>
    </button>
    
    <div class="header-title">
      <h1>Painel Administrativo</h1>
    </div>
    
    <div class="header-actions">
      <button class="theme-toggle" @click="layoutStore.toggleDarkMode()">
        <i :class="layoutStore.isDarkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
      </button>
      
      <span class="user-name">{{ userStore.userName }}</span>
      <img 
        :src="userStore.userAvatar" 
        :alt="userStore.userName"
        class="user-avatar"
      >
      
      <button class="logout-btn" @click="userStore.logout()">
        <i class="fas fa-sign-out-alt"></i>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useLayoutStore } from '@/stores/layout'
import { useUserStore } from '@/stores/user'

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
```

#### Validação
```bash
docker compose exec vue-app npm run type-check
```

#### Critério de Sucesso
- [ ] Stores importadas corretamente
- [ ] Eventos conectados
- [ ] Type-check passa

---

## Fase 6: Componente Sidebar

### Tarefa 6.1: Criar Estrutura HTML da Sidebar

#### Objetivo
Criar componente AppSidebar com menu básico

#### Arquivo
`src/components/layout/AppSidebar.vue`

#### Código
```vue
<template>
  <aside class="app-sidebar">
    <div class="sidebar-header">
      <img src="/vite.svg" alt="Logo" class="logo">
      <span class="brand-name">Admin Panel</span>
    </div>
    
    <nav class="sidebar-menu">
      <div class="menu-item">
        <i class="fas fa-home"></i>
        <span class="menu-text">Dashboard</span>
      </div>
      
      <div class="menu-item">
        <i class="fas fa-users"></i>
        <span class="menu-text">Usuários</span>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
// Lógica será adicionada depois
</script>

<style scoped lang="scss">
.app-sidebar {
  width: 260px;
  background: #2c3e50;
  color: white;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
}

.sidebar-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  height: 64px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.logo {
  width: 32px;
  height: 32px;
}

.brand-name {
  margin-left: 0.75rem;
  font-size: 1.25rem;
  font-weight: bold;
}

.sidebar-menu {
  padding: 1rem 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.menu-item:hover {
  background-color: rgba(255,255,255,0.1);
}

.menu-item i {
  width: 24px;
  font-size: 1.25rem;
}

.menu-text {
  margin-left: 0.75rem;
}
</style>
```

#### Validação
```bash
docker compose exec vue-app npm run type-check
```

#### Critério de Sucesso
- [ ] Componente criado com menu básico
- [ ] Estilos aplicados
- [ ] Type-check passa

---

### Tarefa 6.2: Adicionar Estrutura de Menu com TypeScript

#### Objetivo
Criar interface TypeScript e array de menu

#### Arquivo
`src/components/layout/AppSidebar.vue`

#### Código
```vue
<template>
  <aside class="app-sidebar" :class="sidebarClasses">
    <div class="sidebar-header">
      <img src="/vite.svg" alt="Logo" class="logo">
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
    route: "/dashboard"
  },
  {
    title: "Usuários",
    icon: "fas fa-users",
    children: [
      { title: "Listar Usuários", route: "/usuarios" },
      { title: "Novo Usuário", route: "/usuarios/novo" }
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
  transform: translateX(-100%);
  
  &.sidebar-visible {
    transform: translateX(0);
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
  width: 32px;
  height: 32px;
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
```

#### Validação
```bash
docker compose exec vue-app npm run type-check
```

#### Critério de Sucesso
- [ ] Interfaces TypeScript definidas
- [ ] Menu com submenu funcionando
- [ ] Type-check passa

---

## Fase 7: Componente Content

### Tarefa 7.1: Criar Componente AppContent

#### Objetivo
Criar área de conteúdo com breadcrumbs

#### Arquivo
`src/components/layout/AppContent.vue`

#### Código
```vue
<template>
  <main class="app-content">
    <div class="breadcrumbs">
      <span class="breadcrumb-item">
        <i class="fas fa-home"></i>
        Home
      </span>
      <i class="fas fa-chevron-right breadcrumb-separator"></i>
      <span class="breadcrumb-item active">
        Dashboard
      </span>
    </div>
    
    <div class="content-wrapper">
      <slot></slot>
    </div>
  </main>
</template>

<script setup lang="ts">
// Lógica de breadcrumbs será adicionada depois
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
  
  @include dark-mode {
    background-color: $background-dark;
    color: white;
  }
  
  @include mobile-only {
    margin-left: 0;
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
}
</style>
```

#### Validação
```bash
docker compose exec vue-app npm run type-check
```

#### Critério de Sucesso
- [ ] Componente criado com slot
- [ ] Breadcrumbs visíveis
- [ ] Type-check passa

---

## Fase 8: Layout Principal

### Tarefa 8.1: Criar Componente AppLayout

#### Objetivo
Criar componente que une Header, Sidebar e Content

#### Arquivo
`src/components/layout/AppLayout.vue`

#### Código
```vue
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
  'sidebar-collapsed': layoutStore.isSidebarCollapsed
}))

const showOverlay = computed(() => {
  return layoutStore.isSidebarVisible && window.innerWidth <= 768
})

function handleResize() {
  if (window.innerWidth > 768) {
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
    display: none;}
</style>
```

#### Validação
```bash
docker compose exec vue-app npm run type-check
```

#### Critério de Sucesso
- [ ] Layout integra todos os componentes
- [ ] Overlay mobile funcionando
- [ ] Type-check passa

---

## Fase 9: Configuração de Rotas

### Tarefa 9.1: Criar View Dashboard

#### Objetivo
Criar página dashboard básica para testar roteamento

#### Arquivo
`src/views/DashboardView.vue`

#### Código
```vue
<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <p>Bem-vindo ao painel administrativo!</p>
    
    <div class="stats-grid">
      <div class="stat-card">
        <i class="fas fa-users"></i>
        <h3>150</h3>
        <p>Usuários</p>
      </div>
      
      <div class="stat-card">
        <i class="fas fa-shopping-cart"></i>
        <h3>45</h3>
        <p>Pedidos</p>
      </div>
      
      <div class="stat-card">
        <i class="fas fa-dollar-sign"></i>
        <h3>R$ 12.500</h3>
        <p>Receita</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Dashboard view
</script>

<style scoped lang="scss">
.dashboard {
  h1 {
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #666;
    margin-bottom: 2rem;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
  
  i {
    font-size: 2.5rem;
    color: #1976d2;
    margin-bottom: 1rem;
  }
  
  h3 {
    font-size: 2rem;
    margin: 0.5rem 0;
  }
  
  p {
    margin: 0;
    color: #666;
  }
}
</style>
```

#### Validação
```bash
docker compose exec vue-app npm run type-check
```

#### Critério de Sucesso
- [ ] View Dashboard criada
- [ ] Cards de estatísticas visíveis
- [ ] Type-check passa

---

### Tarefa 9.2: Atualizar Arquivo de Rotas

#### Objetivo
Configurar rotas para usar o layout administrativo

#### Arquivo
`src/router/index.ts`

#### Código
```typescript
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import DashboardView from '@/views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/admin',
      component: AppLayout,
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: DashboardView,
          meta: { title: 'Dashboard' }
        },
        {
          path: 'usuarios',
          name: 'usuarios',
          component: () => import('@/views/AboutView.vue'),
          meta: { title: 'Usuários' }
        },
        {
          path: 'usuarios/novo',
          name: 'novo-usuario',
          component: () => import('@/views/AboutView.vue'),
          meta: { title: 'Novo Usuário' }
        }
      ]
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
```

#### Validação
```bash
docker compose exec vue-app npm run type-check
```

#### Critério de Sucesso
- [ ] Rotas configuradas com layout
- [ ] Meta titles adicionados
- [ ] Type-check passa

---

## Fase 10: Breadcrumbs Dinâmicos

### Tarefa 10.1: Adicionar Lógica de Breadcrumbs

#### Objetivo
Tornar os breadcrumbs dinâmicos baseados na rota

#### Arquivo
`src/components/layout/AppContent.vue`

#### Código
```vue
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
  'sidebar-collapsed': layoutStore.isSidebarCollapsed
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
  
  &.sidebar-collapsed {
    margin-left: $sidebar-collapsed-width;
  }
  
  @include dark-mode {
    background-color: $background-dark;
    color: white;
  }
  
  @include mobile-only {
    margin-left: 0;
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
  text-decoration: none;
  transition: color $transition-speed;
  
  &:hover {
    color: $primary-color;
  }
  
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
}
</style>
```

#### Validação
```bash
docker compose exec vue-app npm run type-check
```

#### Critério de Sucesso
- [ ] Breadcrumbs mudam com a rota
- [ ] Links funcionando
- [ ] Type-check passa

---

## Fase 11: Ajustes Finais

### Tarefa 11.1: Adicionar Estilos Globais

#### Objetivo
Criar arquivo de estilos globais do sistema

#### Arquivo
`src/styles/main.scss`

#### Código
```scss
// Importar variáveis e utilitários
@import './variables';
@import './mixins';
@import './utilities';

// Reset básico
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

// Aplicar modo escuro no body
body.dark-mode {
  background-color: $background-dark;
  color: white;
}

// Links globais
a {
  color: $primary-color;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
}

// Responsividade de imagens
img {
  max-width: 100%;
  height: auto;
}

// Scrollbar personalizada global
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  
  .dark-mode & {
    background: #2a2a2a;
  }
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
  
  &:hover {
    background: #555;
  }
}
```

#### Validação
```bash
docker compose exec vue-app npm run type-check
```

#### Critério de Sucesso
- [ ] Arquivo de estilos globais criado
- [ ] Importações funcionando
- [ ] Type-check passa

---

### Tarefa 11.2: Importar Estilos no Main.ts

#### Objetivo
Adicionar importação dos estilos globais

#### Arquivo
`src/main.ts`

#### Código
```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Import Font Awesome
import '@fortawesome/fontawesome-free/css/all.css'

// Import global styles
import '@/styles/main.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
```

#### Validação
```bash
docker compose exec vue-app npm run type-check
```

#### Critério de Sucesso
- [ ] Estilos globais importados
- [ ] Aplicação sem erros
- [ ] Type-check passa

---

### Tarefa 11.3: Adicionar Classe Dark Mode ao Body

#### Objetivo
Aplicar classe dark-mode dinamicamente no body

#### Arquivo
`src/App.vue`

#### Código
```vue
<template>
  <RouterView />
</template>

<script setup lang="ts">
import { watchEffect } from 'vue'
import { RouterView } from 'vue-router'
import { useLayoutStore } from '@/stores/layout'

const layoutStore = useLayoutStore()

// Aplicar classe dark-mode no body
watchEffect(() => {
  if (layoutStore.isDarkMode) {
    document.body.classList.add('dark-mode')
  } else {
    document.body.classList.remove('dark-mode')
  }
})
</script>
```

#### Validação
```bash
docker compose exec vue-app npm run type-check
docker compose exec vue-app npm run dev
```

#### Critério de Sucesso
- [ ] Dark mode alternando corretamente
- [ ] Classe aplicada no body
- [ ] Aplicação rodando sem erros

---

## Fase 12: Testes e Verificação

### Tarefa 12.1: Verificar Build de Produção

#### Objetivo
Garantir que o projeto compila para produção

#### Arquivo
N/A - Comando de terminal

#### Código
```bash
docker compose exec vue-app npm run build
```

#### Validação
```bash
docker compose exec vue-app ls -la dist/
```

#### Critério de Sucesso
- [ ] Build completo sem erros
- [ ] Arquivos gerados em dist/
- [ ] Sem warnings críticos

---

## Conclusão

Este guia fornece 20 tarefas extremamente detalhadas e decompostas para construir um painel administrativo completo. Cada tarefa:

1. Faz apenas uma coisa específica
2. Pode ser validada independentemente
3. Contém código completo (sem omissões)
4. Tem critérios de sucesso claros

O agente de AI deve executar as tarefas sequencialmente, validando cada uma antes de prosseguir para a próxima. Isso garante que erros sejam detectados cedo e corrigidos antes de se propagarem.# Guia de Desenvolvimento: Painel Administrativo Vue 3
