import axios from 'axios'
import { useSessionStore } from '../stores/session'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // dev: http://localhost:3000, prod: /api via nginx
  withCredentials: true,
  timeout: 5000
})

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Request failed"

    const err = new Error(message) as Error & { status?: number }

    err.status = error?.response?.status

    if (err.status === 401) {
      console.warn("Unauthorized – 401")
    }

    return Promise.reject(err)
  }
)


api.interceptors.request.use((config) => {
  const sessionStore = useSessionStore()

  if(sessionStore.sessionId){
    config.headers['Authorization'] = `Bearer ${sessionStore.sessionId}`
  }

  return config
}
)
