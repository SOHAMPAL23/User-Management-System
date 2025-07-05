"use client"

import { mockAPI } from "./mock-api"

export interface AuthUser {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  roles: string[]
  tenantId: string
}

export interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  username: string
  password: string
  rememberMe?: boolean
}

export class AuthService {
  private static instance: AuthService
  private listeners: Array<(state: AuthState) => void> = []
  private state: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  constructor() {
    this.initializeAuth()
  }

  private async initializeAuth() {
    try {
      const token = this.getStoredToken()
      if (token) {
        // Validate token and get user info
        const isValid = await this.validateToken(token)
        if (isValid) {
          const user = await this.getCurrentUser()
          this.setState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })
        } else {
          this.clearAuth()
        }
      } else {
        this.setState({ ...this.state, isLoading: false })
      }
    } catch (error) {
      console.error("Auth initialization error:", error)
      this.clearAuth()
    }
  }

  private setState(newState: Partial<AuthState>) {
    this.state = { ...this.state, ...newState }
    this.listeners.forEach((listener) => listener(this.state))
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener)
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  getState(): AuthState {
    return this.state
  }

  private getStoredToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
  }

  private storeToken(token: string, rememberMe = false) {
    if (typeof window === "undefined") return

    if (rememberMe) {
      localStorage.setItem("auth_token", token)
      localStorage.setItem("token_expires", (Date.now() + 7 * 24 * 60 * 60 * 1000).toString()) // 7 days
    } else {
      sessionStorage.setItem("auth_token", token)
      sessionStorage.setItem("token_expires", (Date.now() + 24 * 60 * 60 * 1000).toString()) // 24 hours
    }
  }

  private clearStoredToken() {
    if (typeof window === "undefined") return
    localStorage.removeItem("auth_token")
    localStorage.removeItem("token_expires")
    sessionStorage.removeItem("auth_token")
    sessionStorage.removeItem("token_expires")
  }

  private async validateToken(token: string): Promise<boolean> {
    try {
      // Check token expiration
      const expires = localStorage.getItem("token_expires") || sessionStorage.getItem("token_expires")
      if (expires && Date.now() > Number.parseInt(expires)) {
        return false
      }

      // In a real app, you would validate with the server
      // For now, we'll simulate validation
      await new Promise((resolve) => setTimeout(resolve, 500))
      return token.startsWith("mock-jwt-token-")
    } catch (error) {
      return false
    }
  }

  private async getCurrentUser(): Promise<AuthUser> {
    // Extract user ID from token (in real app, decode JWT)
    const token = this.getStoredToken()
    if (!token) throw new Error("No token found")

    const userId = token.replace("mock-jwt-token-", "")
    const user = await mockAPI.getUser("1", userId) // Mock tenant ID

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles.map((r) => r.name),
      tenantId: user.tenantId,
    }
  }

  async login(credentials: LoginCredentials): Promise<void> {
    this.setState({ ...this.state, isLoading: true })

    try {
      const response = await mockAPI.login(credentials.username, credentials.password)

      this.storeToken(response.token, credentials.rememberMe)

      const authUser: AuthUser = {
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        roles: response.user.roles.map((r) => r.name),
        tenantId: response.user.tenantId,
      }

      this.setState({
        user: authUser,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      this.setState({ ...this.state, isLoading: false })
      throw error
    }
  }

  async logout(): Promise<void> {
    this.setState({ ...this.state, isLoading: true })

    try {
      await mockAPI.logout()
      this.clearAuth()
    } catch (error) {
      // Even if logout fails on server, clear local auth
      this.clearAuth()
    }
  }

  private clearAuth() {
    this.clearStoredToken()
    this.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }

  async refreshToken(): Promise<void> {
    const token = this.getStoredToken()
    if (!token) {
      this.clearAuth()
      return
    }

    try {
      // In a real app, call refresh endpoint
      const isValid = await this.validateToken(token)
      if (!isValid) {
        this.clearAuth()
        throw new Error("Token expired")
      }
    } catch (error) {
      this.clearAuth()
      throw error
    }
  }

  hasRole(role: string): boolean {
    return this.state.user?.roles.includes(role) || false
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some((role) => this.hasRole(role))
  }
}

export const authService = AuthService.getInstance()
