import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '../layouts/AuthLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import LandingView from '../views/LandingView.vue'
import DashboardView from '../views/DashboardView.vue'

const routes = [
  {
    path: '/',
    component: AuthLayout,
    children: [
      { path: 'landing', name: 'landing', component: LandingView },
      { path: 'login', name: 'login', component: LoginView },
      { path: 'register', name: 'register', component: RegisterView },
    ]
  },
  {
    path: '/app',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [{ path: 'dashboard', name: 'dashboard', component: DashboardView }]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
