import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import DashboardView from '@/views/DashboardView.vue'
import ClientsView from '@/views/ClientsView.vue'
import LoginView from '@/views/LoginView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: DashboardView,
          meta: { title: 'Dashboard' }
        },
        {
          path: 'clientes',
          name: 'clients',
          component: ClientsView,
          meta: { title: 'Clientes' }
        },
        {
          path: 'clientes/novo',
          name: 'new-client',
          component: () => import('../views/ClientFormView.vue'),
          meta: { title: 'Novo Cliente' }
        },
        {
          path: 'usuarios',
          name: 'usuarios',
          component: () => import('../views/AboutView.vue'),
          meta: { title: 'Usuários' }
        },
        {
          path: 'usuarios/novo',
          name: 'novo-usuario',
          component: () => import('../views/AboutView.vue'),
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

// Navigation guards
router.beforeEach((to, from, next) => {
  // Check if route requires authentication
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth !== false)
  
  // If route doesn't require auth, proceed
  if (!requiresAuth) {
    next()
    return
  }
  
  // Check auth store first
  const authStore = useAuthStore()
  
  // If authenticated in store, proceed
  if (authStore.isAuthenticated) {
    next()
    return
  }
  
  // If not authenticated in store, check localStorage directly
  const storedToken = localStorage.getItem('auth_token')
  const storedUser = localStorage.getItem('auth_user')
  
  if (storedToken && storedUser) {
    // We have stored credentials, manually update the store
    // This is needed because the store might not be initialized yet
    authStore.$patch({
      token: storedToken,
      user: JSON.parse(storedUser)
    })
    next()
  } else {
    // No authentication found, redirect to login
    next({ name: 'login' })
  }
})

export default router
