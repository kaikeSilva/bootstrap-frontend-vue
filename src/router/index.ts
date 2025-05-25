import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import ClientsView from '@/views/clients/ClientsView.vue'
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
          path: '',
          redirect: '/clientes'
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
          component: () => import('../views/clients/ClientFormView.vue'),
          meta: { title: 'Novo Cliente' }
        },
        {
          path: 'clientes/:id/editar',
          name: 'edit-client',
          component: () => import('../views/clients/ClientFormView.vue'),
          meta: { 
            title: 'Editar Cliente',
            parent: 'clients'
          }
        },
        {
          path: 'clientes/:id',
          name: 'client-details',
          component: () => import('../views/clients/ClientDetailsView.vue'),
          meta: { 
            title: 'Detalhes do Cliente',
            parent: 'clients'
          }
        },
        {
          path: 'usuarios',
          name: 'users',
          component: () => import('../views/usuarios/UsersView.vue'),
          meta: { title: 'Usuários' }
        },
        {
          path: 'usuarios/novo',
          name: 'new-user',
          component: () => import('../views/usuarios/UserFormView.vue'),
          meta: { title: 'Novo Usuário' }
        },
        {
          path: 'usuarios/:id/editar',
          name: 'edit-user',
          component: () => import('../views/usuarios/UserFormView.vue'),
          meta: { 
            title: 'Editar Usuário',
            parent: 'users'
          }
        },
        {
          path: 'usuarios/:id',
          name: 'user-details',
          component: () => import('../views/usuarios/UserDetailsView.vue'),
          meta: { 
            title: 'Detalhes do Usuário',
            parent: 'users'
          }
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
