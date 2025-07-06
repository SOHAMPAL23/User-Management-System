// Mock API Service
class MockAPI {
  constructor() {
    this.currentUser = null
    this.token = null
    this.initializeData()
  }

  initializeData() {
    // Mock Privileges
    this.mockPrivileges = [
      {
        id: "1",
        name: "user.create",
        description: "Create new users",
        category: "User Management",
        tenantId: "1",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "2",
        name: "user.read",
        description: "View user information",
        category: "User Management",
        tenantId: "1",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "3",
        name: "user.update",
        description: "Update user information",
        category: "User Management",
        tenantId: "1",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "4",
        name: "user.delete",
        description: "Delete users",
        category: "User Management",
        tenantId: "1",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "5",
        name: "role.manage",
        description: "Manage roles and permissions",
        category: "Role Management",
        tenantId: "1",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "6",
        name: "organization.manage",
        description: "Manage organizations",
        category: "Organization Management",
        tenantId: "1",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "7",
        name: "system.admin",
        description: "System administration access",
        category: "System",
        tenantId: "1",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
    ]

    // Mock Roles
    this.mockRoles = [
      {
        id: "1",
        name: "Super Admin",
        description: "Full system access",
        tenantId: "1",
        privileges: this.mockPrivileges,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "2",
        name: "Manager",
        description: "Management level access",
        tenantId: "1",
        privileges: this.mockPrivileges.slice(0, 5),
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "3",
        name: "User",
        description: "Standard user access",
        tenantId: "1",
        privileges: [this.mockPrivileges[1]],
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "4",
        name: "Viewer",
        description: "Read-only access",
        tenantId: "1",
        privileges: [this.mockPrivileges[1]],
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
    ]

    // Mock Users
    this.mockUsers = [
      {
        id: "1",
        username: "admin",
        email: "admin@acme.com",
        firstName: "John",
        lastName: "Doe",
        status: "active",
        tenantId: "1",
        roles: [this.mockRoles[0]],
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "2",
        username: "manager",
        email: "jane@acme.com",
        firstName: "Jane",
        lastName: "Smith",
        status: "active",
        tenantId: "1",
        roles: [this.mockRoles[1]],
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "3",
        username: "user",
        email: "bob@acme.com",
        firstName: "Bob",
        lastName: "Johnson",
        status: "active",
        tenantId: "1",
        roles: [this.mockRoles[2]],
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
    ]

    // Mock Legal Entities
    this.mockLegalEntities = [
      {
        id: "1",
        name: "Acme Corporation",
        type: "corporation",
        registrationNumber: "CORP-123456",
        taxId: "12-3456789",
        address: "789 Corporate Blvd, Business City, BC 12345",
        status: "active",
        tenantId: "1",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "2",
        name: "Acme Subsidiary LLC",
        type: "llc",
        registrationNumber: "LLC-789012",
        taxId: "98-7654321",
        address: "321 Subsidiary St, Business City, BC 12345",
        status: "active",
        tenantId: "1",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
    ]
  }

  // Utility function to simulate API delay
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // Authentication
  async login(username, password) {
    await this.delay(1000)

    const user = this.mockUsers.find((u) => u.username === username)
    if (!user || password !== "password") {
      throw new Error("Invalid credentials")
    }

    this.currentUser = user
    this.token = `mock-jwt-token-${user.id}`

    return {
      token: this.token,
      user: {
        ...user,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    }
  }

  async logout() {
    await this.delay(500)
    this.currentUser = null
    this.token = null
  }

  async getCurrentUser() {
    await this.delay(500)
    if (!this.currentUser) {
      throw new Error("Not authenticated")
    }
    return this.currentUser
  }

  async validateToken(token) {
    await this.delay(300)
    return token === this.token && this.currentUser !== null
  }

  // User Management
  async getUsers(tenantId) {
    await this.delay(800)
    return this.mockUsers.filter((u) => u.tenantId === tenantId)
  }

  async getUser(tenantId, id) {
    await this.delay(600)
    const user = this.mockUsers.find((u) => u.id === id && u.tenantId === tenantId)
    if (!user) throw new Error("User not found")
    return user
  }

  async createUser(tenantId, data) {
    await this.delay(1200)
    const newUser = {
      id: Date.now().toString(),
      username: data.username || "",
      email: data.email || "",
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      status: data.status || "active",
      tenantId,
      roles: data.roles || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.mockUsers.push(newUser)
    return newUser
  }

  async updateUser(tenantId, id, data) {
    await this.delay(1000)
    const userIndex = this.mockUsers.findIndex((u) => u.id === id && u.tenantId === tenantId)
    if (userIndex === -1) throw new Error("User not found")

    this.mockUsers[userIndex] = {
      ...this.mockUsers[userIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return this.mockUsers[userIndex]
  }

  async deleteUser(tenantId, id) {
    await this.delay(800)
    const userIndex = this.mockUsers.findIndex((u) => u.id === id && u.tenantId === tenantId)
    if (userIndex === -1) throw new Error("User not found")

    this.mockUsers.splice(userIndex, 1)
    return { success: true }
  }

  // Role Management
  async getRoles(tenantId) {
    await this.delay(800)
    return this.mockRoles.filter((r) => r.tenantId === tenantId)
  }

  async createRole(tenantId, data) {
    await this.delay(1200)
    const newRole = {
      id: Date.now().toString(),
      name: data.name || "",
      description: data.description || "",
      tenantId,
      privileges: data.privileges || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.mockRoles.push(newRole)
    return newRole
  }

  async updateRole(tenantId, id, data) {
    await this.delay(1000)
    const roleIndex = this.mockRoles.findIndex((r) => r.id === id && r.tenantId === tenantId)
    if (roleIndex === -1) throw new Error("Role not found")

    this.mockRoles[roleIndex] = {
      ...this.mockRoles[roleIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return this.mockRoles[roleIndex]
  }

  // Privilege Management
  async getPrivileges(tenantId) {
    await this.delay(800)
    return this.mockPrivileges.filter((p) => p.tenantId === tenantId)
  }

  async createPrivilege(tenantId, data) {
    await this.delay(1200)
    const newPrivilege = {
      id: Date.now().toString(),
      name: data.name || "",
      description: data.description || "",
      category: data.category || "General",
      tenantId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.mockPrivileges.push(newPrivilege)
    return newPrivilege
  }

  async updatePrivilege(tenantId, id, data) {
    await this.delay(1000)
    const privilegeIndex = this.mockPrivileges.findIndex((p) => p.id === id && p.tenantId === tenantId)
    if (privilegeIndex === -1) throw new Error("Privilege not found")

    this.mockPrivileges[privilegeIndex] = {
      ...this.mockPrivileges[privilegeIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return this.mockPrivileges[privilegeIndex]
  }

  // Legal Entity Management
  async getLegalEntities(tenantId) {
    await this.delay(800)
    return this.mockLegalEntities.filter((le) => le.tenantId === tenantId)
  }

  async createLegalEntity(tenantId, data) {
    await this.delay(1200)
    const newEntity = {
      id: Date.now().toString(),
      name: data.name || "",
      type: data.type || "corporation",
      registrationNumber: data.registrationNumber || "",
      taxId: data.taxId || "",
      address: data.address || "",
      status: data.status || "active",
      tenantId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.mockLegalEntities.push(newEntity)
    return newEntity
  }

  async updateLegalEntity(tenantId, id, data) {
    await this.delay(1000)
    const entityIndex = this.mockLegalEntities.findIndex((le) => le.id === id && le.tenantId === tenantId)
    if (entityIndex === -1) throw new Error("Legal entity not found")

    this.mockLegalEntities[entityIndex] = {
      ...this.mockLegalEntities[entityIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return this.mockLegalEntities[entityIndex]
  }

  // Analytics data
  async getUserActivityData(tenantId) {
    await this.delay(1000)
    return [
      { date: "2024-01-01", active: 45, inactive: 5 },
      { date: "2024-01-02", active: 52, inactive: 8 },
      { date: "2024-01-03", active: 48, inactive: 12 },
      { date: "2024-01-04", active: 61, inactive: 9 },
      { date: "2024-01-05", active: 55, inactive: 15 },
      { date: "2024-01-06", active: 67, inactive: 13 },
      { date: "2024-01-07", active: 72, inactive: 8 },
    ]
  }

  async getRoleDistributionData(tenantId) {
    await this.delay(800)
    return [
      { role: "Admin", count: 5, percentage: 10 },
      { role: "Manager", count: 15, percentage: 30 },
      { role: "User", count: 25, percentage: 50 },
      { role: "Viewer", count: 5, percentage: 10 },
    ]
  }
}

export const mockAPI = new MockAPI()
