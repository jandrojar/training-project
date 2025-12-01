import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '../layouts/AuthLayout.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import LandingView from '../views/LandingView.vue'

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
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
