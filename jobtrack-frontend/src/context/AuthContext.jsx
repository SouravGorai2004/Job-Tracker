import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('jobtrack-user')
        return saved ? JSON.parse(saved) : null
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const persistSession = (authResponse) => {
        const { token, ...userData } = authResponse
        localStorage.setItem('jobtrack-token', token)
        localStorage.setItem('jobtrack-user', JSON.stringify(userData))
        setUser(userData)
    }

    const login = async (credentials) => {
        setLoading(true); setError(null)
        try {
            const { data } = await authApi.login(credentials)
            persistSession(data)
            navigate('/dashboard')
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed')
            throw err
        } finally { setLoading(false) }
    }

    const register = async (payload) => {
        setLoading(true); setError(null)
        try {
            const { data } = await authApi.register(payload)
            persistSession(data)
            navigate('/dashboard')
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed')
            throw err
        } finally { setLoading(false) }
    }

    const logout = () => {
        localStorage.removeItem('jobtrack-token')
        localStorage.removeItem('jobtrack-user')
        setUser(null)
        navigate('/login')
    }

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}