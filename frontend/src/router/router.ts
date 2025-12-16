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
      { path: 'projects/:id', name: 'project', component: () => import('../views/ProjectDetailView.vue')} // Lazy load project detail view. THis is to optimize initial load time of app layout
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const session = useSessionStore()

  // If the user is not logged in and tries to access a protected route → redirect to login page
  if (to.meta.requiresAuth && !session.isLoggedIn) {
    return next('/login')
  }

  // If the user is logged in and tries to go to login/register → redirect to dashboard
  if ((to.path === '/login' || to.path === '/register') && session.isLoggedIn) {
    return next('/app/dashboard')
  }

  // Otherwise, allow access
  next()
})

export default router
