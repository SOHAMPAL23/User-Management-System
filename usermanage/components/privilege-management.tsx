"use client"

import { useState, useEffect, SetStateAction } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/Card"
import { Button } from "@/src/components/ui/Button"
import { Input } from "@/src/components/ui/Input"
import { Label } from "@/src/components/ui/Label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/Dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/UI/skeleton"
import { mockAPI, type Privilege } from "@/lib/mock-api"
import { useToast } from "@/hooks/use-toast"
import { Lock, Plus, Edit, Search, Shield, Key, Settings, Users, Building2, Database } from "lucide-react"

const categoryIcons = {
  "User Management": Users,
  "Role Management": Shield,
  "Organization Management": Building2,
  System: Settings,
  Database: Database,
  General: Key,
}

const categoryColors = {
  "User Management": "from-blue-500 to-blue-600",
  "Role Management": "from-purple-500 to-purple-600",
  "Organization Management": "from-green-500 to-green-600",
  System: "from-red-500 to-red-600",
  Database: "from-yellow-500 to-yellow-600",
  General: "from-gray-500 to-gray-600",
}

interface PrivilegeFormData {
  name: string
  description: string
  category: string
}

export function PrivilegeManagement() {
  const [privileges, setPrivileges] = useState<Privilege[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedPrivilege, setSelectedPrivilege] = useState<Privilege | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [formData, setFormData] = useState<PrivilegeFormData>({
    name: "",
    description: "",
    category: "General",
  })
  const { toast } = useToast()

  const tenantId = "1" // Mock tenant ID

  useEffect(() => {
    loadPrivileges()
  }, [])

  const loadPrivileges = async () => {
    try {
      setLoading(true)
      const data = await mockAPI.getPrivileges(tenantId)
      setPrivileges(data)
    } catch (error) {
      toast({
        type: "error",
        title: "Error loading privileges",
        description: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePrivilege = async () => {
    try {
      const newPrivilege = await mockAPI.createPrivilege(tenantId, formData)
      setPrivileges((prev) => [...prev, newPrivilege])
      setIsCreateDialogOpen(false)
      setFormData({ name: "", description: "", category: "General" })

      toast({
        type: "success",
        title: "Privilege created",
        description: `Privilege "${newPrivilege.name}" has been created successfully`,
      })
    } catch (error) {
      toast({
        type: "error",
        title: "Error creating privilege",
        description: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  const handleUpdatePrivilege = async () => {
    if (!selectedPrivilege) return

    try {
      const updatedPrivilege = await mockAPI.updatePrivilege(tenantId, selectedPrivilege.id, formData)
      setPrivileges((prev) => prev.map((p) => (p.id === updatedPrivilege.id ? updatedPrivilege : p)))
      setIsEditDialogOpen(false)
      setSelectedPrivilege(null)
      setFormData({ name: "", description: "", category: "General" })

      toast({
        type: "success",
        title: "Privilege updated",
        description: `Privilege "${updatedPrivilege.name}" has been updated successfully`,
      })
    } catch (error) {
      toast({
        type: "error",
        title: "Error updating privilege",
        description: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  const openEditDialog = (privilege: Privilege) => {
    setSelectedPrivilege(privilege)
    setFormData({
      name: privilege.name,
      description: privilege.description,
      category: privilege.category,
    })
    setIsEditDialogOpen(true)
  }

  const filteredPrivileges = privileges.filter((privilege) => {
    const matchesSearch =
      privilege.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      privilege.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || privilege.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const privilegesByCategory = filteredPrivileges.reduce(
    (acc, privilege) => {
      if (!acc[privilege.category]) {
        acc[privilege.category] = []
      }
      acc[privilege.category].push(privilege)
      return acc
    },
    {} as Record<string, Privilege[]>,
  )

  const categories = Array.from(new Set(privileges.map((p) => p.category)))

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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Privilege Management
          </h1>
          <p className="text-slate-600">Define and manage system privileges and permissions</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Privilege
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Privilege</DialogTitle>
              <DialogDescription>Define a new privilege that can be assigned to roles.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Privilege Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e: { target: { value: any } }) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., user.create"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e: { target: { value: any } }) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this privilege allows"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: any) => setFormData((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(categoryIcons).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePrivilege}>Create Privilege</Button>
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
            placeholder="Search privileges..."
            value={searchTerm}
            onChange={(e: { target: { value: SetStateAction<string> } }) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Privileges by Category */}
      <div className="space-y-8">
        {Object.entries(privilegesByCategory).map(([category, categoryPrivileges]) => {
          const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Key
          const colorClass = categoryColors[category as keyof typeof categoryColors] || "from-gray-500 to-gray-600"

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${colorClass} rounded-lg flex items-center justify-center`}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{category}</h2>
                  <p className="text-sm text-slate-600">{categoryPrivileges.length} privileges</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {categoryPrivileges.map((privilege, index) => (
                    <motion.div
                      key={privilege.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div
                                className={`w-8 h-8 bg-gradient-to-r ${colorClass} rounded-lg flex items-center justify-center`}
                              >
                                <Lock className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <CardTitle className="text-base">{privilege.name}</CardTitle>
                                <p className="text-sm text-slate-600">{privilege.description}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => openEditDialog(privilege)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center">
                            <Badge variant="outline" className="text-xs">
                              {privilege.category}
                            </Badge>
                            <span className="text-xs text-slate-500">
                              Created {new Date(privilege.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Edit Privilege Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Privilege</DialogTitle>
            <DialogDescription>Update privilege information and settings.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Privilege Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e: { target: { value: any } }) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., user.create"
              />
            </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e: { target: { value: any } }) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this privilege allows"
              />
            </div>

            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: any) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(categoryIcons).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdatePrivilege}>Update Privilege</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
