import axios from 'axios'

// Priority: explicit Vite build-time env (static site deploys) > runtime-
// injected value (Docker/nginx deploys) > localhost default for plain
// `npm run dev`. Reversed from before -- an explicitly-set VITE_API_BASE_URL
// must always win over the local-dev placeholder baked into public/env-config.js.
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    window.__ENV__?.API_BASE_URL ||
    'http://localhost:8081/api'

const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
})

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('jobtrack-token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('jobtrack-token')
            localStorage.removeItem('jobtrack-user')
            if (window.location.pathname !== '/login') window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default axiosClient