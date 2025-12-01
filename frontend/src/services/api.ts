import axios from 'axios'
import { useSessionStore } from '../stores/session'

export const api = axios.create({
  baseURL: 'http://localhost:3000', // backend url
  withCredentials: true,            
  timeout: 5000                     
})

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      
      console.warn('Unauthorized – 401')
    }

    return Promise.reject(error)
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
