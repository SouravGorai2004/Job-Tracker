import axios from 'axios'

// Points at the backend from Decision Log Entry 7 -- port 8081, not 8080.
const axiosClient = axios.create({
    baseURL: 'http://localhost:8081/api',
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