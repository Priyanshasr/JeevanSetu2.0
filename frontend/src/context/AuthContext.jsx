import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../config/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('js2_token'))
  const [loading, setLoading] = useState(true)

  const restoreSession = useCallback(async (savedToken) => {
    if (!savedToken) { setLoading(false); return }
    try {
      const { data } = await api.get('/auth/me')
      setUser(data)
    } catch {
      localStorage.removeItem('js2_token')
      setToken(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    restoreSession(token)
  }, []) // eslint-disable-line

  const login = async (email, password) => {
    const formData = new FormData()
    formData.append('username', email)
    formData.append('password', password)
    const { data } = await api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    const accessToken = data.access_token
    localStorage.setItem('js2_token', accessToken)
    setToken(accessToken)
    const meResp = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    setUser(meResp.data)
    return meResp.data
  }

  const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData)
    return data
  }

  const logout = () => {
    localStorage.removeItem('js2_token')
    setToken(null)
    setUser(null)
    window.location.href = '/'
  }

  const isAuthenticated = !!token && !!user

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated, loading, role: user?.role }}>
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
