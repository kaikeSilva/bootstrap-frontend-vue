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

export default router
