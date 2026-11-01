import axios from 'axios'

const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
  if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`
  }
  return url.replace(/\/$/, '')
}

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('js2_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('js2_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
