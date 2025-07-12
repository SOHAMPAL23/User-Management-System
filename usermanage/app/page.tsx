"use client"

import { useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/UI/toaster"
import { LoginForm } from "@/components/auth/login-form"
import { ProtectedRoute } from "@/components/auth/protected-routes"
import { SessionManager } from "@/components/auth/session-manager"
import { ComprehensiveDashboard } from "@/components/charts/comprehensive-dashboard"
import { UserManagementEnhanced } from "@/components/user-management-enhanced"
import { RoleManagement } from "@/components/role-management"
import { PrivilegeManagement } from "@/components/privilege-management"
import { LegalEntityManagement } from "@/components/legal-entity-management"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/Card"
import { Button } from "@/src/components/ui/button"
import { LogoutDialog } from "@/components/auth/logout-dialog"
import { useAuth } from "@/hooks/use-auth"
import { LayoutDashboard, Users, Shield, Key, Building2, Settings, LogOut } from "lucide-react"

export default function Home() {
  const { user, logout } = useAuth()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  if (!user) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <LoginForm />
        </div>
        <Toaster />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ProtectedRoute>
        <SessionManager>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                  <div className="flex items-center space-x-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management System</h1>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Welcome, {user.firstName} {user.lastName}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => setShowLogoutDialog(true)}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Tabs defaultValue="dashboard" className="space-y-6">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </TabsTrigger>
                  <TabsTrigger value="users" className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Users</span>
                  </TabsTrigger>
                  <TabsTrigger value="roles" className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Roles</span>
                  </TabsTrigger>
                  <TabsTrigger value="privileges" className="flex items-center space-x-2">
                    <Key className="h-4 w-4" />
                    <span>Privileges</span>
                  </TabsTrigger>
                  <TabsTrigger value="legal" className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4" />
                    <span>Legal Entities</span>
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard">
                  <ComprehensiveDashboard />
                </TabsContent>

                <TabsContent value="users">
                  <UserManagementEnhanced />
                </TabsContent>

                <TabsContent value="roles">
                  <RoleManagement />
                </TabsContent>

                <TabsContent value="privileges">
                  <PrivilegeManagement />
                </TabsContent>

                <TabsContent value="legal">
                  <LegalEntityManagement />
                </TabsContent>

                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle>System Settings</CardTitle>
                      <CardDescription>Configure system preferences and settings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Settings panel coming soon...</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </main>

            <LogoutDialog
              open={showLogoutDialog}
              onOpenChange={setShowLogoutDialog}
              onConfirm={() => {
                logout()
                setShowLogoutDialog(false)
              }}
            />
          </div>
        </SessionManager>
      </ProtectedRoute>
      <Toaster />
    </ThemeProvider>
  )
}
