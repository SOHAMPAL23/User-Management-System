"use client"

import { useState, useEffect, SetStateAction } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/src/components/ui/Card"
import { Button } from "@/src/components/ui/Button"
import { Input } from "@/src/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/UI/skeleton"
import { mockAPI, type User, type Role } from "@/lib/mock-api"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { UserPlus, Search, Filter, Eye, Edit, Trash2, Shield, Crown, UserIcon } from "lucide-react"

const roleIcons = {
  "Super Admin": Crown,
  Manager: Shield,
  User: UserIcon,
  Viewer: Eye,
}

const roleColors = {
  "Super Admin": "bg-red-100 text-red-800 border-red-200",
  Manager: "bg-purple-100 text-purple-800 border-purple-200",
  User: "bg-blue-100 text-blue-800 border-blue-200",
  Viewer: "bg-gray-100 text-gray-800 border-gray-200",
}

interface UserFormData {
  username: string
  email: string
  firstName: string
  lastName: string
  roleIds: string[]
  status: "active" | "inactive" | "pending"
}

export function UserManagementEnhanced() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    roleIds: [],
    status: "active",
  })
  const { toast } = useToast()
  const { user: currentUser, hasRole } = useAuth()

  const tenantId = "1" // Mock tenant ID

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [usersData, rolesData] = await Promise.all([mockAPI.getUsers(tenantId), mockAPI.getRoles(tenantId)])
      setUsers(usersData)
      setRoles(rolesData)
    } catch (error) {
      toast({
        type: "error",
        title: "Error loading data",
        description: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async () => {
    try {
      const selectedRoles = roles.filter((r) => formData.roleIds.includes(r.id))
      const newUser = await mockAPI.createUser(tenantId, {
        ...formData,
        roles: selectedRoles,
      })

      setUsers((prev) => [...prev, newUser])
      setIsCreateDialogOpen(false)
      resetForm()

      toast({
        type: "success",
        title: "User created",
        description: `User "${newUser.username}" has been created successfully`,
      })
    } catch (error) {
      toast({
        type: "error",
        title: "Error creating user",
        description: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  const handleUpdateUser = async () => {
    if (!selectedUser) return

    try {
      const selectedRoles = roles.filter((r) => formData.roleIds.includes(r.id))
      const updatedUser = await mockAPI.updateUser(tenantId, selectedUser.id, {
        ...formData,
        roles: selectedRoles,
      })

      setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
      setIsEditDialogOpen(false)
      setSelectedUser(null)
      resetForm()

      toast({
        type: "success",
        title: "User updated",
        description: `User "${updatedUser.username}" has been updated successfully`,
      })
    } catch (error) {
      toast({
        type: "error",
        title: "Error updating user",
        description: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!hasRole("Super Admin")) {
      toast({
        type: "error",
        title: "Access denied",
        description: "You don't have permission to delete users",
      })
      return
    }

    try {
      await mockAPI.deleteUser(tenantId, userId)
      setUsers((prev) => prev.filter((u) => u.id !== userId))

      toast({
        type: "success",
        title: "User deleted",
        description: "User has been deleted successfully",
      })
    } catch (error) {
      toast({
        type: "error",
        title: "Error deleting user",
        description: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  const openEditDialog = (user: User) => {
    setSelectedUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roleIds: user.roles.map((r) => r.id),
      status: user.status,
    })
    setIsEditDialogOpen(true)
  }

  const openViewDialog = (user: User) => {
    setSelectedUser(user)
    setIsViewDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      roleIds: [],
      status: "active",
    })
  }

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const canCreateUser = hasRole("Super Admin") || hasRole("Manager")
  const canEditUser = hasRole("Super Admin") || hasRole("Manager")
  const canDeleteUser = hasRole("Super Admin")

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-slate-600">Manage user accounts, roles, and permissions</p>
        </div>

        {canCreateUser && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>Add a new user to the system with appropriate roles.</DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e: { target: { value: any } }) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                      placeholder="Enter username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e: { target: { value: any } }) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e: { target: { value: any } }) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e: { target: { value: any } }) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="roles">Roles</Label>
                    <Select
                      value={formData.roleIds[0] || ""}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, roleIds: [value] }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: any) => setFormData((prev) => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateUser}>Create User</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e: { target: { value: SetStateAction<string> } }) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Current User Info */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-blue-500 text-white">
                {currentUser?.firstName?.[0]}
                {currentUser?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                 {currentUser?.firstName} {currentUser?.lastName}
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">Roles:</span>
                {currentUser?.roles?.map((role: string) => {
                  const IconComponent = roleIcons[role as keyof typeof roleIcons] || Shield
                  return (
                    <Badge key={role} variant="outline" className="text-xs">
                      <IconComponent className="w-3 h-3 mr-1" />
                      {role}
                    </Badge>
                  )
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredUsers.map((user, index) => {
            const primaryRole = user.roles[0]
            const IconComponent = roleIcons[primaryRole?.name as keyof typeof roleIcons] || UserIcon
            const roleColorClass = roleColors[primaryRole?.name as keyof typeof roleColors] || roleColors["User"]

            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
              >
                <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={`/placeholder.svg?height=48&width=48`} />
                          <AvatarFallback>
                            {user.firstName[0]}
                            {user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {user.firstName} {user.lastName}
                          </h3>
                          <p className="text-slate-600">@{user.username}</p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-2">
                            {user.roles.map((role) => {
                              const RoleIcon = roleIcons[role.name as keyof typeof roleIcons] || Shield
                              const colorClass = roleColors[role.name as keyof typeof roleColors] || roleColors["User"]
                              return (
                                <Badge key={role.id} className={`${colorClass} border`}>
                                  <RoleIcon className="w-3 h-3 mr-1" />
                                  {role.name}
                                </Badge>
                              )
                            })}
                          </div>
                          <Badge variant={user.status === "active" ? "default" : "destructive"}>{user.status}</Badge>
                        </div>

                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => openViewDialog(user)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          {canEditUser && (
                            <Button size="sm" variant="ghost" onClick={() => openEditDialog(user)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                          {canDeleteUser && user.id !== currentUser?.id && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* View User Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>View user information and role assignments.</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {selectedUser.firstName[0]}
                    {selectedUser.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  <p className="text-slate-600">@{selectedUser.username}</p>
                  <p className="text-sm text-slate-500">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <Badge variant={selectedUser.status === "active" ? "default" : "destructive"} className="mt-1">
                    {selectedUser.status}
                  </Badge>
                </div>
                <div>
                  <Label>Tenant ID</Label>
                  <p className="text-sm text-slate-600 mt-1">{selectedUser.tenantId}</p>
                </div>
              </div>

              <div>
                <Label>Assigned Roles</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedUser.roles.map((role) => {
                    const IconComponent = roleIcons[role.name as keyof typeof roleIcons] || Shield
                    const colorClass = roleColors[role.name as keyof typeof roleColors] || roleColors["User"]
                    return (
                      <Badge key={role.id} className={`${colorClass} border`}>
                        <IconComponent className="w-3 h-3 mr-1" />
                        {role.name}
                      </Badge>
                    )
                  })}
                </div>
              </div>

              <div>
                <Label>Privileges</Label>
                <div className="mt-2 max-h-32 overflow-y-auto">
                  <div className="space-y-1">
                    {selectedUser.roles
                      .flatMap((role) => role.privileges)
                      .map((privilege) => (
                        <div key={privilege.id} className="text-sm text-slate-600 bg-slate-50 px-2 py-1 rounded">
                          {privilege.name} - {privilege.description}
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-slate-500">
                <div>
                  <Label>Created</Label>
                  <p className="mt-1">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label>Last Updated</Label>
                  <p className="mt-1">{new Date(selectedUser.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information and role assignments.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-username">Username</Label>
                <Input
                  id="edit-username"
                  value={formData.username}
                  onChange={(e: { target: { value: any } }) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter username"
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e: { target: { value: any } }) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-firstName">First Name</Label>
                <Input
                  id="edit-firstName"
                  value={formData.firstName}
                  onChange={(e: { target: { value: any } }) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <Label htmlFor="edit-lastName">Last Name</Label>
                <Input
                  id="edit-lastName"
                  value={formData.lastName}
                  onChange={(e: { target: { value: any } }) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-roles">Roles</Label>
                <Select
                  value={formData.roleIds[0] || ""}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, roleIds: [value] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateUser}>Update User</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
