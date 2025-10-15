import axios from 'axios'
import { useAuth } from '../security/AuthProvider'

// We expose a hook-bound axios or a token injector function
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:8081',
})

// Helper to attach interceptor after auth is ready
export const attachAuthInterceptor = (getToken: () => string | undefined) => {
  api.interceptors.request.use((config) => {
    const t = getToken()
    if (t) {
      config.headers = config.headers || {}
      config.headers['Authorization'] = `Bearer ${t}`
    }
    return config
  })
}
