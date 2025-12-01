import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import router from './router/router'
import { createPinia } from 'pinia'
import { useSessionStore } from './stores/session'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

app.use(router)

const session = useSessionStore()
session.loadSession()

app.mount('#app')

