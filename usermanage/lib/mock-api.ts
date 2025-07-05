// Mock API Service with comprehensive endpoints
export interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  status: "active" | "inactive" | "pending"
  createdAt: string
  updatedAt: string
  roles: Role[]
  tenantId: string
}

export interface Role {
  id: string
  name: string
  description: string
  tenantId: string
  privileges: Privilege[]
  createdAt: string
  updatedAt: string
}

export interface Privilege {
  id: string
  name: string
  description: string
  category: string
  tenantId: string
  createdAt: string
  updatedAt: string
}

export interface Tenant {
  id: string
  name: string
  domain: string
  status: "active" | "inactive"
  settings: TenantSettings
  createdAt: string
  updatedAt: string
}

export interface TenantSettings {
  theme: "light" | "dark"
  timezone: string
  language: string
  features: string[]
}

export interface Organization {
  id: string
  name: string
  description: string
  tenantId: string
  parentId?: string
  profile: OrganizationProfile
  createdAt: string
  updatedAt: string
}

export interface OrganizationProfile {
  address: string
  phone: string
  email: string
  website?: string
}

export interface LegalEntity {
  id: string
  name: string
  type: "corporation" | "llc" | "partnership" | "sole_proprietorship"
  registrationNumber: string
  taxId: string
  address: string
  status: "active" | "inactive" | "pending"
  tenantId: string
  createdAt: string
  updatedAt: string
}

// Mock data
const mockTenants: Tenant[] = [
  {
    id: "1",
    name: "Acme Corporation",
    domain: "acme.com",
    status: "active",
    settings: {
      theme: "light",
      timezone: "UTC",
      language: "en",
      features: ["users", "roles", "organizations"],
    },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "TechStart Inc",
    domain: "techstart.io",
    status: "active",
    settings: {
      theme: "dark",
      timezone: "America/New_York",
      language: "en",
      features: ["users", "roles", "organizations", "legal-entities"],
    },
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
  },
]

const mockPrivileges: Privilege[] = [
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
    category: "System Administration",
    tenantId: "1",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "8",
    name: "reports.view",
    description: "View system reports",
    category: "Reporting",
    tenantId: "1",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "9",
    name: "security.manage",
    description: "Manage security settings",
    category: "Security",
    tenantId: "1",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
]

const mockRoles: Role[] = [
  {
    id: "1",
    name: "Super Admin",
    description: "Full system access with all privileges",
    tenantId: "1",
    privileges: mockPrivileges,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Manager",
    description: "Management level access with user and organization management",
    tenantId: "1",
    privileges: mockPrivileges.slice(0, 6),
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "User",
    description: "Standard user access with basic permissions",
    tenantId: "1",
    privileges: [mockPrivileges[1], mockPrivileges[7]], // Read access and reports
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    name: "Viewer",
    description: "Read-only access to system information",
    tenantId: "1",
    privileges: [mockPrivileges[1], mockPrivileges[7]], // Only read access
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
]

const mockUsers: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@acme.com",
    firstName: "John",
    lastName: "Doe",
    status: "active",
    tenantId: "1",
    roles: [mockRoles[0]],
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
    roles: [mockRoles[1]],
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
    roles: [mockRoles[2]],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    username: "viewer",
    email: "alice@acme.com",
    firstName: "Alice",
    lastName: "Wilson",
    status: "active",
    tenantId: "1",
    roles: [mockRoles[3]],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
]

const mockOrganizations: Organization[] = [
  {
    id: "1",
    name: "Engineering",
    description: "Software development team",
    tenantId: "1",
    profile: {
      address: "123 Tech Street",
      phone: "+1-555-0123",
      email: "engineering@acme.com",
    },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Marketing",
    description: "Marketing and sales team",
    tenantId: "1",
    profile: {
      address: "456 Business Ave",
      phone: "+1-555-0456",
      email: "marketing@acme.com",
    },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
]

const mockLegalEntities: LegalEntity[] = [
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

// Utility function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock API implementation
export class MockAPI {
  private static instance: MockAPI
  private currentUser: User | null = null
  private token: string | null = null

  static getInstance(): MockAPI {
    if (!MockAPI.instance) {
      MockAPI.instance = new MockAPI()
    }
    return MockAPI.instance
  }

  // Authentication
  async login(username: string, password: string) {
    await delay(1000)

    const user = mockUsers.find((u) => u.username === username)
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
    await delay(500)
    this.currentUser = null
    this.token = null
  }

  async getCurrentUser() {
    await delay(500)
    if (!this.currentUser) {
      throw new Error("Not authenticated")
    }
    return this.currentUser
  }

  async validateToken(token: string) {
    await delay(300)
    return token === this.token && this.currentUser !== null
  }

  // Tenant Management
  async getTenants() {
    await delay(800)
    return mockTenants
  }

  async getTenant(id: string) {
    await delay(600)
    const tenant = mockTenants.find((t) => t.id === id)
    if (!tenant) throw new Error("Tenant not found")
    return tenant
  }

  async createTenant(data: Partial<Tenant>) {
    await delay(1200)
    const newTenant: Tenant = {
      id: Date.now().toString(),
      name: data.name || "",
      domain: data.domain || "",
      status: data.status || "active",
      settings: data.settings || {
        theme: "light",
        timezone: "UTC",
        language: "en",
        features: [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockTenants.push(newTenant)
    return newTenant
  }

  // Role Management
  async getRoles(tenantId: string) {
    await delay(800)
    return mockRoles.filter((r) => r.tenantId === tenantId)
  }

  async getRole(tenantId: string, id: string) {
    await delay(600)
    const role = mockRoles.find((r) => r.id === id && r.tenantId === tenantId)
    if (!role) throw new Error("Role not found")
    return role
  }

  async createRole(tenantId: string, data: Partial<Role>) {
    await delay(1200)
    const newRole: Role = {
      id: Date.now().toString(),
      name: data.name || "",
      description: data.description || "",
      tenantId,
      privileges: data.privileges || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockRoles.push(newRole)
    return newRole
  }

  async updateRole(tenantId: string, id: string, data: Partial<Role>) {
    await delay(1000)
    const roleIndex = mockRoles.findIndex((r) => r.id === id && r.tenantId === tenantId)
    if (roleIndex === -1) throw new Error("Role not found")

    mockRoles[roleIndex] = {
      ...mockRoles[roleIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return mockRoles[roleIndex]
  }

  async linkPrivilegeToRole(tenantId: string, roleId: string, privilegeId: string) {
    await delay(800)
    const role = mockRoles.find((r) => r.id === roleId && r.tenantId === tenantId)
    const privilege = mockPrivileges.find((p) => p.id === privilegeId && p.tenantId === tenantId)

    if (!role || !privilege) throw new Error("Role or privilege not found")

    if (!role.privileges.find((p) => p.id === privilegeId)) {
      role.privileges.push(privilege)
    }

    return role
  }

  async unlinkPrivilegeFromRole(tenantId: string, roleId: string, privilegeId: string) {
    await delay(800)
    const role = mockRoles.find((r) => r.id === roleId && r.tenantId === tenantId)
    if (!role) throw new Error("Role not found")

    role.privileges = role.privileges.filter((p) => p.id !== privilegeId)
    return role
  }

  // Privilege Management
  async getPrivileges(tenantId: string) {
    await delay(800)
    return mockPrivileges.filter((p) => p.tenantId === tenantId)
  }

  async getPrivilege(tenantId: string, id: string) {
    await delay(600)
    const privilege = mockPrivileges.find((p) => p.id === id && p.tenantId === tenantId)
    if (!privilege) throw new Error("Privilege not found")
    return privilege
  }

  async createPrivilege(tenantId: string, data: Partial<Privilege>) {
    await delay(1200)
    const newPrivilege: Privilege = {
      id: Date.now().toString(),
      name: data.name || "",
      description: data.description || "",
      category: data.category || "General",
      tenantId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockPrivileges.push(newPrivilege)
    return newPrivilege
  }

  async updatePrivilege(tenantId: string, id: string, data: Partial<Privilege>) {
    await delay(1000)
    const privilegeIndex = mockPrivileges.findIndex((p) => p.id === id && p.tenantId === tenantId)
    if (privilegeIndex === -1) throw new Error("Privilege not found")

    mockPrivileges[privilegeIndex] = {
      ...mockPrivileges[privilegeIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return mockPrivileges[privilegeIndex]
  }

  // Legal Entity Management
  async getLegalEntities(tenantId: string) {
    await delay(800)
    return mockLegalEntities.filter((le) => le.tenantId === tenantId)
  }

  async getLegalEntity(tenantId: string, id: string) {
    await delay(600)
    const entity = mockLegalEntities.find((le) => le.id === id && le.tenantId === tenantId)
    if (!entity) throw new Error("Legal entity not found")
    return entity
  }

  async createLegalEntity(tenantId: string, data: Partial<LegalEntity>) {
    await delay(1200)
    const newEntity: LegalEntity = {
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
    mockLegalEntities.push(newEntity)
    return newEntity
  }

  async updateLegalEntity(tenantId: string, id: string, data: Partial<LegalEntity>) {
    await delay(1000)
    const entityIndex = mockLegalEntities.findIndex((le) => le.id === id && le.tenantId === tenantId)
    if (entityIndex === -1) throw new Error("Legal entity not found")

    mockLegalEntities[entityIndex] = {
      ...mockLegalEntities[entityIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return mockLegalEntities[entityIndex]
  }

  // User Management
  async getUsers(tenantId: string) {
    await delay(800)
    return mockUsers.filter((u) => u.tenantId === tenantId)
  }

  async getUser(tenantId: string, id: string) {
    await delay(600)
    const user = mockUsers.find((u) => u.id === id && u.tenantId === tenantId)
    if (!user) throw new Error("User not found")
    return user
  }

  async createUser(tenantId: string, data: Partial<User>) {
    await delay(1200)
    const newUser: User = {
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
    mockUsers.push(newUser)
    return newUser
  }

  async updateUser(tenantId: string, id: string, data: Partial<User>) {
    await delay(1000)
    const userIndex = mockUsers.findIndex((u) => u.id === id && u.tenantId === tenantId)
    if (userIndex === -1) throw new Error("User not found")

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return mockUsers[userIndex]
  }

  async deleteUser(tenantId: string, id: string) {
    await delay(800)
    const userIndex = mockUsers.findIndex((u) => u.id === id && u.tenantId === tenantId)
    if (userIndex === -1) throw new Error("User not found")

    mockUsers.splice(userIndex, 1)
    return { success: true }
  }

  // Organization Management
  async getOrganizations(tenantId: string) {
    await delay(800)
    return mockOrganizations.filter((o) => o.tenantId === tenantId)
  }

  async getOrganization(tenantId: string, id: string) {
    await delay(600)
    const org = mockOrganizations.find((o) => o.id === id && o.tenantId === tenantId)
    if (!org) throw new Error("Organization not found")
    return org
  }

  async createOrganization(tenantId: string, data: Partial<Organization>) {
    await delay(1200)
    const newOrg: Organization = {
      id: Date.now().toString(),
      name: data.name || "",
      description: data.description || "",
      tenantId,
      parentId: data.parentId,
      profile: data.profile || {
        address: "",
        phone: "",
        email: "",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockOrganizations.push(newOrg)
    return newOrg
  }

  // Analytics and System Data
  async getUserActivityData(tenantId: string) {
    await delay(1000)
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

  async getRoleDistributionData(tenantId: string) {
    await delay(800)
    return [
      { role: "Super Admin", count: 5, percentage: 10 },
      { role: "Manager", count: 15, percentage: 30 },
      { role: "User", count: 25, percentage: 50 },
      { role: "Viewer", count: 5, percentage: 10 },
    ]
  }

  async getSystemMetrics(tenantId: string) {
    await delay(800)
    return {
      totalUsers: mockUsers.filter((u) => u.tenantId === tenantId).length,
      activeSessions: Math.floor(Math.random() * 100) + 50,
      systemHealth: 98,
      securityScore: 85,
      userGrowth: 12,
      sessionChange: 8,
      securityStatus: "Good",
      responseTime: Math.floor(Math.random() * 100) + 50,
      uptime: 99.9,
      alerts: Math.floor(Math.random() * 5),
    }
  }

  async getPerformanceData(tenantId: string) {
    await delay(800)
    const hours = Array.from({ length: 24 }, (_, i) => {
      const hour = i.toString().padStart(2, "0")
      return {
        time: `${hour}:00`,
        cpu: Math.floor(Math.random() * 40) + 20,
        memory: Math.floor(Math.random() * 30) + 40,
        disk: Math.floor(Math.random() * 20) + 10,
      }
    })
    return hours
  }

  async getSecurityData(tenantId: string) {
    await delay(800)
    return [
      { name: "Authentication", value: 95, fill: "#3b82f6" },
      { name: "Authorization", value: 88, fill: "#10b981" },
      { name: "Data Protection", value: 92, fill: "#f59e0b" },
      { name: "Network Security", value: 85, fill: "#ef4444" },
      { name: "Compliance", value: 90, fill: "#8b5cf6" },
    ]
  }
}

export const mockAPI = MockAPI.getInstance()
