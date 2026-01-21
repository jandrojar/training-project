import axios from "axios"
import { useSessionStore } from "../stores/session"
import router from "../router/router"
import { useToast } from "../composables/useToast"

// Flag to prevent multiple simultaneous unauthorized handling
let isHandlingUnauthorized = false

// Define a custom error type for API errors
type ApiError = Error & {
  status?: number
  code?: string
  handled?: boolean
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // dev: http://localhost:3000, prod: /api via nginx
  withCredentials: true,
  timeout: 5000,
})

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    const code = error?.response?.data?.error

    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Request failed"

    const err = new Error(message) as ApiError
    err.status = status
    err.code = code

    const isSessionUnauthorized =
      err.status === 401 &&
      (err.code === "session-expired" ||
        err.code === "invalid-session" ||
        err.code === "missing-or-invalid-authorization-header")

    if (isSessionUnauthorized) {
      err.handled = true

      if (!isHandlingUnauthorized) {
        isHandlingUnauthorized = true
        const sessionStore = useSessionStore()
        sessionStore.clearSession()

        if (router.currentRoute.value?.name !== "login") {
          router.push({ name: "login" }).finally(() => {
          useToast().warning("Your session has expired or is invalid. Please log in again.")
          isHandlingUnauthorized = false
          })
        } else {
          isHandlingUnauthorized = false
        }
      }
    }

    return Promise.reject(err)
  }
)

// Request interceptor
api.interceptors.request.use((config) => {
  const sessionStore = useSessionStore()

  if (sessionStore.sessionId) {
    config.headers["Authorization"] = `Bearer ${sessionStore.sessionId}`
  }

  return config
})
