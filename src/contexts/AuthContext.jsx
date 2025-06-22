"use client"

import { createContext, useState, useEffect } from "react"
import { authService } from "../services/api/auth"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await authService.getCurrentUser()
        setUser(userData)
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    const userData = await authService.login(email, password)
    setUser(userData)
    return userData
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  const register = async (userData) => {
    const registeredUser = await authService.register(userData)
    setUser(registeredUser)
    return registeredUser
  }

  return <AuthContext.Provider value={{ user, loading, login, logout, register }}>{children}</AuthContext.Provider>
}
