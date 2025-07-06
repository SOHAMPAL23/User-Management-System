import { mockAPI } from "./mockAPI"

class AuthService {
  constructor() {
    this.listeners = []
    this.state = {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
    }
    this.initializeAuth()
  }

  async initializeAuth() {
    try {
      const token = this.getStoredToken()
      if (token) {
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

  setState(newState) {
    this.state = { ...this.state, ...newState }
    this.listeners.forEach((listener) => listener(this.state))
  }

  subscribe(listener) {
    this.listeners.push(listener)
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  getState() {
    return this.state
  }

  getStoredToken() {
    if (typeof window === "undefined") return null
    return localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
  }

  storeToken(token, rememberMe = false) {
    if (typeof window === "undefined") return

    if (rememberMe) {
      localStorage.setItem("auth_token", token)
      localStorage.setItem("token_expires", (Date.now() + 7 * 24 * 60 * 60 * 1000).toString())
    } else {
      sessionStorage.setItem("auth_token", token)
      sessionStorage.setItem("token_expires", (Date.now() + 24 * 60 * 60 * 1000).toString())
    }
  }

  clearStoredToken() {
    if (typeof window === "undefined") return
    localStorage.removeItem("auth_token")
    localStorage.removeItem("token_expires")
    sessionStorage.removeItem("auth_token")
    sessionStorage.removeItem("token_expires")
  }

  async validateToken(token) {
    try {
      const expires = localStorage.getItem("token_expires") || sessionStorage.getItem("token_expires")
      if (expires && Date.now() > Number.parseInt(expires)) {
        return false
      }

      await new Promise((resolve) => setTimeout(resolve, 500))
      return token.startsWith("mock-jwt-token-")
    } catch (error) {
      return false
    }
  }

  async getCurrentUser() {
    const token = this.getStoredToken()
    if (!token) throw new Error("No token found")

    const userId = token.replace("mock-jwt-token-", "")
    const user = await mockAPI.getUser("1", userId)

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

  async login(credentials) {
    this.setState({ ...this.state, isLoading: true })

    try {
      const response = await mockAPI.login(credentials.username, credentials.password)

      this.storeToken(response.token, credentials.rememberMe)

      const authUser = {
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

  async logout() {
    this.setState({ ...this.state, isLoading: true })

    try {
      await mockAPI.logout()
      this.clearAuth()
    } catch (error) {
      this.clearAuth()
    }
  }

  clearAuth() {
    this.clearStoredToken()
    this.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }

  hasRole(role) {
    return this.state.user?.roles.includes(role) || false
  }

  hasAnyRole(roles) {
    return roles.some((role) => this.hasRole(role))
  }
}

export const authService = new AuthService()
