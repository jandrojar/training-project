import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '../layouts/AuthLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import LandingView from '../views/LandingView.vue'
import DashboardView from '../views/DashboardView.vue'
import { useSessionStore } from '../stores/session'

const routes = [
  {
    path: '/',
    component: AuthLayout,
    children: [
      { path: '/', name: 'landing', component: LandingView },
      { path: 'login', name: 'login', component: LoginView },
      { path: 'register', name: 'register', component: RegisterView },
    ]
  },
  {
    path: '/app',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', name: 'dashboard', component: DashboardView },
      { path: 'projects/:id', name: 'project', component: () => import('../views/ProjectDetailView.vue')}
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const session = useSessionStore()

  // 1. Si la ruta requiere auth y NO estás logueado → redirige
  if (to.meta.requiresAuth && !session.isLoggedIn) {
    return next('/login')
  }

  // 2. Si estás logueado e intentas ir a login/register → manda al dashboard
  if ((to.path === '/login' || to.path === '/register') && session.isLoggedIn) {
    return next('/app/dashboard')
  }

  // 3. En cualquier otro caso continúa
  next()
})

export default router
