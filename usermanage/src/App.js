"use client"

import { useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Float, Text3D, Center } from "@react-three/drei"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Building2, Shield, Settings, BarChart3, LogOut, Lock, FileText } from "lucide-react"

import { RoleManagement } from "./components/RoleManagement"
import { PrivilegeManagement } from "./components/PrivilegeManagement"
import { LegalEntityManagement } from "./components/LegalEntityManagement"
import { UserManagementEnhanced } from "./components/UserManagementEnhanced"
import { UserActivityChart } from "./components/charts/UserActivityChart"
import { ToastContainer } from "./components/ui/Toast"
import { useToast } from "./hooks/useToast"
import { SessionManager } from "./components/auth/SessionManager"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import { LogoutDialog } from "./components/auth/LogoutDialog"
import { useAuth } from "./hooks/useAuth"
import { Button } from "./components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/Card"
import "./App.css"

// 3D Scene Component
function Scene3D() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />

      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <Center>
          <Text3D
            font="/fonts/Geist_Bold.json"
            size={0.8}
            height={0.2}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={5}
          >
            USER MANAGEMENT
            <meshNormalMaterial />
          </Text3D>
        </Center>
      </Float>

      <Float speed={2} rotationIntensity={2} floatIntensity={1}>
        <mesh position={[-3, 2, -2]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>
      </Float>
      <Float speed={1.8} rotationIntensity={1.5} floatIntensity={1.5}>
        <mesh position={[3, -1, -1]}>
          <sphereGeometry args={[0.3]} />
          <meshStandardMaterial color="#10b981" />
        </mesh>
      </Float>
      <Float speed={2.2} rotationIntensity={1.8} floatIntensity={1.2}>
        <mesh position={[0, -2, -3]}>
          <cylinderGeometry args={[0.3, 0.3, 0.8]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>
      </Float>
    </>
  )
}

// Mock stats data
const mockStats = [
  { title: "Total Users", value: "2,847", change: "+12%", icon: Users, color: "text-blue-600" },
  { title: "Organizations", value: "156", change: "+8%", icon: Building2, color: "text-green-600" },
  { title: "Active Roles", value: "24", change: "+3%", icon: Shield, color: "text-purple-600" },
  { title: "Tenants", value: "89", change: "+15%", icon: Settings, color: "text-orange-600" },
]

function App() {
  const [view, setView] = useState("dashboard")
  const [loading, setLoading] = useState(true)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const { toasts, removeToast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const PageWrapper = ({ children }) => (
    <motion.div
      key={view}
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 1.03 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  )

  if (loading) {
    return (
      <div className="h-screen w-full bg-slate-900 relative">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <Scene3D />
          <OrbitControls enablePan={false} enableZoom={false} />
          <Environment preset="night" />
        </Canvas>
      </div>
    )
  }

  return (
    <SessionManager>
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          {/* Navigation */}
          <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b">
            <div className="mx-auto max-w-7xl px-4 flex h-14 items-center justify-between">
              <div className="flex items-center space-x-6">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  UserSys
                </span>
                {[
                  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
                  { id: "users", label: "Users", icon: Users },
                  { id: "roles", label: "Roles", icon: Shield },
                  { id: "privileges", label: "Privileges", icon: Lock },
                  { id: "legal-entities", label: "Legal Entities", icon: FileText },
                ].map((navItem) => {
                  const IconComponent = navItem.icon
                  return (
                    <button
                      key={navItem.id}
                      onClick={() => setView(navItem.id)}
                      className={`flex items-center space-x-1 px-3 py-1.5 rounded-md transition ${
                        view === navItem.id
                          ? "bg-blue-100 text-blue-700"
                          : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{navItem.label}</span>
                    </button>
                  )
                })}
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-slate-600">
                  Welcome, {user?.firstName} {user?.lastName}
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsLogoutDialogOpen(true)}>
                  <LogOut className="mr-1 w-4 h-4" /> Logout
                </Button>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="mx-auto max-w-7xl p-6">
            <AnimatePresence mode="wait">
              {view === "dashboard" && (
                <PageWrapper>
                  <div className="space-y-8">
                    {/* Stats Cards */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {mockStats.map((stat) => {
                        const IconComponent = stat.icon
                        return (
                          <Card
                            key={stat.title}
                            className="bg-white/60 backdrop-blur-sm shadow hover:shadow-lg transition"
                          >
                            <CardContent className="p-5 flex justify-between items-center">
                              <div>
                                <p className="text-sm text-slate-600">{stat.title}</p>
                                <p className="text-3xl font-bold">{stat.value}</p>
                                <p className="text-xs text-green-600">{stat.change}</p>
                              </div>
                              <div className={`p-2 rounded-full bg-slate-100 ${stat.color}`}>
                                <IconComponent className="w-6 h-6" />
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>

                    {/* Charts */}
                    <UserActivityChart />

                    {/* 3D Visualization */}
                    <Card className="bg-white/60 backdrop-blur-sm shadow">
                      <CardHeader>
                        <CardTitle>System Overview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64">
                          <Canvas camera={{ position: [0, 0, 8] }}>
                            <ambientLight intensity={0.6} />
                            {mockStats.map((stat, i) => (
                              <Float key={stat.title} speed={1 + i * 0.2}>
                                <mesh position={[i * 2 - 3, 0, 0]}>
                                  <cylinderGeometry
                                    args={[0.3, 0.3, Number.parseInt(stat.value.replace(/,/g, "")) / 1000]}
                                  />
                                  <meshStandardMaterial color={`hsl(${i * 90},70%,60%)`} />
                                </mesh>
                              </Float>
                            ))}
                            <OrbitControls enableZoom={false} />
                          </Canvas>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </PageWrapper>
              )}

              {view === "users" && (
                <PageWrapper>
                  <UserManagementEnhanced />
                </PageWrapper>
              )}

              {view === "roles" && (
                <PageWrapper>
                  <RoleManagement />
                </PageWrapper>
              )}

              {view === "privileges" && (
                <PageWrapper>
                  <PrivilegeManagement />
                </PageWrapper>
              )}

              {view === "legal-entities" && (
                <PageWrapper>
                  <LegalEntityManagement />
                </PageWrapper>
              )}
            </AnimatePresence>
          </main>
        </div>

        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />

        {/* Logout Dialog */}
        <LogoutDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen} />
      </ProtectedRoute>
    </SessionManager>
  )
}

export default App
