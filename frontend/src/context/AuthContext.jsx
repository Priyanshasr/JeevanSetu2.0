import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../config/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('js2_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem('js2_token'))
  const [loading, setLoading] = useState(true)

  const restoreSession = useCallback(async (savedToken) => {
    if (!savedToken) {
      setLoading(false)
      return
    }
    try {
      const { data } = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${savedToken}` }
      })
      setUser(data)
      localStorage.setItem('js2_user', JSON.stringify(data))
    } catch (err) {
      console.warn('Session restoration failed:', err)
      // Keep user from localStorage if network is temporarily unreachable
      const cached = localStorage.getItem('js2_user')
      if (cached) {
        try {
          setUser(JSON.parse(cached))
        } catch {
          localStorage.removeItem('js2_token')
          localStorage.removeItem('js2_user')
          setToken(null)
          setUser(null)
        }
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    restoreSession(token)
  }, [restoreSession, token])

  const login = async (email, password) => {
    // Send clean JSON payload
    const { data } = await api.post('/auth/login', {
      email: email.trim(),
      password: password,
    })
    const accessToken = data.access_token
    const userData = data.user
    localStorage.setItem('js2_token', accessToken)
    localStorage.setItem('js2_user', JSON.stringify(userData))
    setToken(accessToken)
    setUser(userData)
    return userData
  }

  const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData)
    if (data.access_token && data.user) {
      localStorage.setItem('js2_token', data.access_token)
      localStorage.setItem('js2_user', JSON.stringify(data.user))
      setToken(data.access_token)
      setUser(data.user)
    }
    return data.user || data
  }

  const logout = () => {
    localStorage.removeItem('js2_token')
    localStorage.removeItem('js2_user')
    setToken(null)
    setUser(null)
    window.location.href = '/login'
  }

  const isAuthenticated = !!token && !!user

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated,
        loading,
        role: user?.role,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
