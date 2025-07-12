"use client"

import { useState, useEffect, SetStateAction } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/Card"
import { Button } from "@/src/components/ui/Button"
import { Input } from "@/src/components/ui/Input"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/Toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { mockAPI, type LegalEntity } from "@/lib/mock-api"
import { useToast } from "@/hooks/use-toast"
import {
  Building,
  Plus,
  Edit,
  Search,
  FileText,
  MapPin,
  Hash,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"

const entityTypeIcons = {
  corporation: Building,
  llc: FileText,
  partnership: CreditCard,
  sole_proprietorship: Hash,
}

const entityTypeColors = {
  corporation: "from-blue-500 to-blue-600",
  llc: "from-green-500 to-green-600",
  partnership: "from-purple-500 to-purple-600",
  sole_proprietorship: "from-orange-500 to-orange-600",
}

const statusIcons = {
  active: CheckCircle,
  inactive: XCircle,
  pending: Clock,
}

const statusColors = {
  active: "text-green-600 bg-green-100",
  inactive: "text-red-600 bg-red-100",
  pending: "text-yellow-600 bg-yellow-100",
}

interface LegalEntityFormData {
  name: string
  type: "corporation" | "llc" | "partnership" | "sole_proprietorship"
  registrationNumber: string
  taxId: string
  address: string
  status: "active" | "inactive" | "pending"
}

export function LegalEntityManagement() {
  const [entities, setEntities] = useState<LegalEntity[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedEntity, setSelectedEntity] = useState<LegalEntity | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [formData, setFormData] = useState<LegalEntityFormData>({
    name: "",
    type: "corporation",
    registrationNumber: "",
    taxId: "",
    address: "",
    status: "active",
  })
  const { toast } = useToast()

  const tenantId = "1" // Mock tenant ID

  useEffect(() => {
    loadEntities()
  }, [])

  const loadEntities = async () => {
    try {
      setLoading(true)
      const data = await mockAPI.getLegalEntities(tenantId)
      setEntities(data)
    } catch (error) {
      toast({
        type: "error",
        title: "Error loading legal entities",
        description: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEntity = async () => {
    try {
      const newEntity = await mockAPI.createLegalEntity(tenantId, formData)
      setEntities((prev) => [...prev, newEntity])
      setIsCreateDialogOpen(false)
      setFormData({
        name: "",
        type: "corporation",
        registrationNumber: "",
        taxId: "",
        address: "",
        status: "active",
      })

      toast({
        type: "success",
        title: "Legal entity created",
        description: `Legal entity "${newEntity.name}" has been created successfully`,
      })
    } catch (error) {
      toast({
        type: "error",
        title: "Error creating legal entity",
        description: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  const handleUpdateEntity = async () => {
    if (!selectedEntity) return

    try {
      const updatedEntity = await mockAPI.updateLegalEntity(tenantId, selectedEntity.id, formData)
      setEntities((prev) => prev.map((e) => (e.id === updatedEntity.id ? updatedEntity : e)))
      setIsEditDialogOpen(false)
      setSelectedEntity(null)
      setFormData({
        name: "",
        type: "corporation",
        registrationNumber: "",
        taxId: "",
        address: "",
        status: "active",
      })

      toast({
        type: "success",
        title: "Legal entity updated",
        description: `Legal entity "${updatedEntity.name}" has been updated successfully`,
      })
    } catch (error) {
      toast({
        type: "error",
        title: "Error updating legal entity",
        description: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  const openEditDialog = (entity: LegalEntity) => {
    setSelectedEntity(entity)
    setFormData({
      name: entity.name,
      type: entity.type,
      registrationNumber: entity.registrationNumber,
      taxId: entity.taxId,
      address: entity.address,
      status: entity.status,
    })
    setIsEditDialogOpen(true)
  }

  const filteredEntities = entities.filter((entity) => {
    const matchesSearch =
      entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.taxId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || entity.type === selectedType
    const matchesStatus = selectedStatus === "all" || entity.status === selectedStatus
    return matchesSearch && matchesType && matchesStatus
  })

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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Legal Entity Management
          </h1>
          <p className="text-slate-600">Manage legal entities and their registration details</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Legal Entity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Legal Entity</DialogTitle>
              <DialogDescription>Register a new legal entity with all required information.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Entity Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e: { target: { value: any } }) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter entity name"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Entity Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: any) => setFormData((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="corporation">Corporation</SelectItem>
                      <SelectItem value="llc">LLC</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="registrationNumber">Registration Number</Label>
                  <Input
                    id="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={(e: { target: { value: any } }) => setFormData((prev) => ({ ...prev, registrationNumber: e.target.value }))}
                    placeholder="Enter registration number"
                  />
                </div>
                <div>
                  <Label htmlFor="taxId">Tax ID</Label>
                  <Input
                    id="taxId"
                    value={formData.taxId}
                    onChange={(e: { target: { value: any } }) => setFormData((prev) => ({ ...prev, taxId: e.target.value }))}
                    placeholder="Enter tax ID"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e: { target: { value: any } }) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter complete address"
                />
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

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateEntity}>Create Entity</Button>
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
            placeholder="Search legal entities..."
            value={searchTerm}
            onChange={(e: { target: { value: SetStateAction<string> } }) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="corporation">Corporation</SelectItem>
            <SelectItem value="llc">LLC</SelectItem>
            <SelectItem value="partnership">Partnership</SelectItem>
            <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Legal Entities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredEntities.map((entity, index) => {
            const TypeIcon = entityTypeIcons[entity.type]
            const StatusIcon = statusIcons[entity.status]
            const typeColorClass = entityTypeColors[entity.type]
            const statusColorClass = statusColors[entity.status]

            return (
              <motion.div
                key={entity.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-12 h-12 bg-gradient-to-r ${typeColorClass} rounded-lg flex items-center justify-center`}
                        >
                          <TypeIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{entity.name}</CardTitle>
                          <p className="text-sm text-slate-600 capitalize">{entity.type.replace("_", " ")}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${statusColorClass}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          <span className="capitalize">{entity.status}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(entity)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <Hash className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">Reg: {entity.registrationNumber}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <CreditCard className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">Tax: {entity.taxId}</span>
                      </div>
                      <div className="flex items-start space-x-2 text-sm">
                        <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                        <span className="text-slate-600 line-clamp-2">{entity.address}</span>
                      </div>
                      <div className="pt-2 border-t">
                        <span className="text-xs text-slate-500">
                          Created {new Date(entity.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Edit Legal Entity Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Legal Entity</DialogTitle>
            <DialogDescription>Update legal entity information and registration details.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Entity Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e: { target: { value: any } }) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter entity name"
                />
              </div>
              <div>
                <Label htmlFor="edit-type">Entity Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) => setFormData((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corporation">Corporation</SelectItem>
                    <SelectItem value="llc">LLC</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-registrationNumber">Registration Number</Label>
                <Input
                  id="edit-registrationNumber"
                  value={formData.registrationNumber}
                  onChange={(e: { target: { value: any } }) => setFormData((prev) => ({ ...prev, registrationNumber: e.target.value }))}
                  placeholder="Enter registration number"
                />
              </div>
              <div>
                <Label htmlFor="edit-taxId">Tax ID</Label>
                <Input
                  id="edit-taxId"
                  value={formData.taxId}
                  onChange={(e: { target: { value: any } }) => setFormData((prev) => ({ ...prev, taxId: e.target.value }))}
                  placeholder="Enter tax ID"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-address">Address</Label>
              <Textarea
                id="edit-address"
                value={formData.address}
                onChange={(e: { target: { value: any } }) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Enter complete address"
              />
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

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateEntity}>Update Entity</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
