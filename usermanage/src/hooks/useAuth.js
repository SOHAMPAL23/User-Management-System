"use client"

import { useState, useEffect } from "react"
import { authService } from "../lib/auth"

export function useAuth() {
  const [authState, setAuthState] = useState(authService.getState())

  useEffect(() => {
    const unsubscribe = authService.subscribe(setAuthState)
    return unsubscribe
  }, [])

  const login = async (credentials) => {
    return authService.login(credentials)
  }

  const logout = async () => {
    return authService.logout()
  }

  const hasRole = (role) => {
    return authService.hasRole(role)
  }

  const hasAnyRole = (roles) => {
    return authService.hasAnyRole(roles)
  }

  return {
    ...authState,
    login,
    logout,
    hasRole,
    hasAnyRole,
  }
}
