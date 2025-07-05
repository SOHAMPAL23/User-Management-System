"use client"

import { useState, useEffect } from "react"
import { authService, type AuthState, type LoginCredentials } from "@/lib/auth"

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(authService.getState())

  useEffect(() => {
    const unsubscribe = authService.subscribe(setAuthState)
    return unsubscribe
  }, [])

  const login = async (credentials: LoginCredentials) => {
    return authService.login(credentials)
  }

  const logout = async () => {
    return authService.logout()
  }

  const refreshToken = async () => {
    return authService.refreshToken()
  }

  const hasRole = (role: string) => {
    return authService.hasRole(role)
  }

  const hasAnyRole = (roles: string[]) => {
    return authService.hasAnyRole(roles)
  }

  return {
    ...authState,
    login,
    logout,
    refreshToken,
    hasRole,
    hasAnyRole,
  }
}
