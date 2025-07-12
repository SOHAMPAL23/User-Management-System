"use client"

import { useState, useEffect, SetStateAction } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Float, Text3D, Center } from "@react-three/drei"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/Card"
import { Button } from "@/src/components/ui/Button"
import { Input } from "@/src/components/ui/Input"
import { Label } from "@/src/components/ui/Label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/UI/skeleton"
import { mockAPI, type Role, type Privilege } from "@/lib/mock-api"
import { useToast } from "@/hooks/use-toast"
import { Shield, Plus, Edit, Search, Filter, Users, Eye } from "lucide-react"

// 3D Role Visualization
function RoleVisualization({ roles }: { roles: Role[] }) {
  return (
    <Canvas camera={{ position: [0, 0, 8] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {roles.map((role, index) => (
        <Float key={role.id} speed={1 + index * 0.2} rotationIntensity={0.5}>
          <mesh position={[index * 2 - 3, 0, 0]}>
            <sphereGeometry args={[0.5 + role.privileges.length * 0.1]} />
            <meshStandardMaterial color={`hsl(${index * 60}, 70%, 60%)`} />
          </mesh>
          <Center position={[index * 2 - 3, -1.5, 0]}>
            <Text3D font="/fonts/Geist_Regular.json" size={0.2} height={0.05}>
              {role.name}
              <meshStandardMaterial color="white" />
            </Text3D>
          </Center>
        </Float>
      ))}

      <OrbitControls enableZoom={false} />
    </Canvas>
  )
}

interface RoleFormData {
  name: string
  description: string
  privileges: string[]
}

export function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([])
  const [privileges, setPrivileges] = useState<Privilege[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [formData, setFormData] = useState<RoleFormData>({
    name: "",
    description: "",
    privileges: [],
  })
  const { toast } = useToast()

  const tenantId = "1" // Mock tenant ID

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [rolesData, privilegesData] = await Promise.all([
        mockAPI.getRoles(tenantId),
        mockAPI.getPrivileges(tenantId),
      ])
      setRoles(rolesData)
      setPrivileges(privilegesData)
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

  const handleCreateRole = async () => {
    try {
      const selectedPrivileges = privileges.filter((p) => formData.privileges.includes(p.id))
      const newRole = await mockAPI.createRole(tenantId, {
        name: formData.name,
        description: formData.description,
        privileges: selectedPrivileges,
      })

      setRoles((prev) => [...prev, newRole])
      setIsCreateDialogOpen(false)
      setFormData({ name: "", description: "", privileges: [] })

      toast({
        type: "success",
        title: "Role created",
        description: `Role "${newRole.name}" has been created successfully`,
      })
    } catch (error) {
      toast({
        type: "error",
        title: "Error creating role",
        description: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  const handleUpdateRole = async () => {
    if (!selectedRole) return

    try {
      const selectedPrivileges = privileges.filter((p) => formData.privileges.includes(p.id))
      const updatedRole = await mockAPI.updateRole(tenantId, selectedRole.id, {
        name: formData.name,
        description: formData.description,
        privileges: selectedPrivileges,
      })

      setRoles((prev) => prev.map((r) => (r.id === updatedRole.id ? updatedRole : r)))
      setIsEditDialogOpen(false)
      setSelectedRole(null)
      setFormData({ name: "", description: "", privileges: [] })

      toast({
        type: "success",
        title: "Role updated",
        description: `Role "${updatedRole.name}" has been updated successfully`,
      })
    } catch (error) {
      toast({
        type: "error",
        title: "Error updating role",
        description: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  const handleLinkPrivilege = async (roleId: string, privilegeId: string) => {
    try {
      const updatedRole = await mockAPI.linkPrivilegeToRole(tenantId, roleId, privilegeId)
      setRoles((prev) => prev.map((r) => (r.id === updatedRole.id ? updatedRole : r)))

      toast({
        type: "success",
        title: "Privilege linked",
        description: "Privilege has been linked to the role",
      })
    } catch (error) {
      toast({
        type: "error",
        title: "Error linking privilege",
        description: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  const handleUnlinkPrivilege = async (roleId: string, privilegeId: string) => {
    try {
      const updatedRole = await mockAPI.unlinkPrivilegeFromRole(tenantId, roleId, privilegeId)
      setRoles((prev) => prev.map((r) => (r.id === updatedRole.id ? updatedRole : r)))

      toast({
        type: "success",
        title: "Privilege unlinked",
        description: "Privilege has been unlinked from the role",
      })
    } catch (error) {
      toast({
        type: "error",
        title: "Error unlinking privilege",
        description: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  const openEditDialog = (role: Role) => {
    setSelectedRole(role)
    setFormData({
      name: role.name,
      description: role.description,
      privileges: role.privileges.map((p) => p.id),
    })
    setIsEditDialogOpen(true)
  }

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const privilegesByCategory = privileges.reduce(
    (acc, privilege) => {
      if (!acc[privilege.category]) {
        acc[privilege.category] = []
      }
      acc[privilege.category].push(privilege)
      return acc
    },
    {} as Record<string, Privilege[]>,
  )

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Role Management
          </h1>
          <p className="text-slate-600">Manage roles and their associated privileges</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>Define a new role and assign privileges to it.</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Role Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e: { target: { value: any } }) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter role name"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e: { target: { value: any } }) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter role description"
                  />
                </div>
              </div>

              <div>
                <Label>Privileges</Label>
                <div className="mt-2 space-y-4 max-h-64 overflow-y-auto">
                  {Object.entries(privilegesByCategory).map(([category, categoryPrivileges]) => (
                    <div key={category}>
                      <h4 className="font-medium text-sm text-slate-700 mb-2">{category}</h4>
                      <div className="space-y-2 pl-4">
                        {categoryPrivileges.map((privilege) => (
                          <div key={privilege.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={privilege.id}
                              checked={formData.privileges.includes(privilege.id)}
                              onCheckedChange={(checked: any) => {
                                if (checked) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    privileges: [...prev.privileges, privilege.id],
                                  }))
                                } else {
                                  setFormData((prev) => ({
                                    ...prev,
                                    privileges: prev.privileges.filter((id) => id !== privilege.id),
                                  }))
                                }
                              }}
                            />
                            <Label htmlFor={privilege.id} className="text-sm">
                              {privilege.name}
                            </Label>
                            <span className="text-xs text-slate-500">{privilege.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateRole}>Create Role</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search roles..."
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

      {/* 3D Visualization */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Role Hierarchy Visualization</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 rounded-lg overflow-hidden">
            <RoleVisualization roles={filteredRoles} />
          </div>
        </CardContent>
      </Card>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredRoles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{role.name}</CardTitle>
                        <p className="text-sm text-slate-600">{role.description}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(role)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Privileges</span>
                        <Badge variant="secondary">{role.privileges.length}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {role.privileges.slice(0, 3).map((privilege) => (
                          <Badge key={privilege.id} variant="outline" className="text-xs">
                            {privilege.name}
                          </Badge>
                        ))}
                        {role.privileges.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{role.privileges.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-xs text-slate-500">
                        Created {new Date(role.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Users className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>Update role information and manage privileges.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Role Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e: { target: { value: any } }) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter role name"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e: { target: { value: any } }) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter role description"
                />
              </div>
            </div>

            <div>
              <Label>Privileges</Label>
              <div className="mt-2 space-y-4 max-h-64 overflow-y-auto">
                {Object.entries(privilegesByCategory).map(([category, categoryPrivileges]) => (
                  <div key={category}>
                    <h4 className="font-medium text-sm text-slate-700 mb-2">{category}</h4>
                    <div className="space-y-2 pl-4">
                      {categoryPrivileges.map((privilege) => (
                        <div key={privilege.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`edit-${privilege.id}`}
                            checked={formData.privileges.includes(privilege.id)}
                            onCheckedChange={(checked: any) => {
                              if (checked) {
                                setFormData((prev) => ({
                                  ...prev,
                                  privileges: [...prev.privileges, privilege.id],
                                }))
                              } else {
                                setFormData((prev) => ({
                                  ...prev,
                                  privileges: prev.privileges.filter((id) => id !== privilege.id),
                                }))
                              }
                            }}
                          />
                          <Label htmlFor={`edit-${privilege.id}`} className="text-sm">
                            {privilege.name}
                          </Label>
                          <span className="text-xs text-slate-500">{privilege.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateRole}>Update Role</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
