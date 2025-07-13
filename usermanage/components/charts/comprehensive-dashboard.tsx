"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/src/components/ui/Card"
import { Badge } from "@/components/ui/badge"
import {
  EnhancedPerformanceMetrics,
  EnhancedSecurityOverview,
  EnhancedUserActivity,
  EnhancedRoleDistribution,
} from "./enhanced-dashbored"
import { BarChart3, Shield, Users, Activity, TrendingUp, Server, Lock, Eye, Globe } from "lucide-react"

export function ComprehensiveDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const dashboardTabs = [
    {
      id: "overview",
      label: "Overview",
      icon: BarChart3,
      description: "System overview and key metrics",
    },
    {
      id: "performance",
      label: "Performance",
      icon: Server,
      description: "System performance and resource usage",
    },
    {
      id: "security",
      label: "Security",
      icon: Shield,
      description: "Security metrics and threat analysis",
    },
    {
      id: "users",
      label: "User Activity",
      icon: Users,
      description: "User engagement and behavior analytics",
    },
    {
      id: "roles",
      label: "Role Analytics",
      icon: Lock,
      description: "Role distribution and privilege analysis",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-slate-600">Comprehensive system analytics and insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            Live Data
          </Badge>
          <Badge variant="outline">Last updated: 2 min ago</Badge>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-white/60 backdrop-blur-sm">
          {dashboardTabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center space-x-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                <IconComponent className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {/* Tab Content */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Users</p>
                    <p className="text-3xl font-bold">2,847</p>
                    <p className="text-blue-100 text-sm flex items-center mt-1">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +12% this month
                    </p>
                  </div>
                  <Users className="w-12 h-12 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">System Health</p>
                    <p className="text-3xl font-bold">98%</p>
                    <p className="text-green-100 text-sm flex items-center mt-1">
                      <Activity className="w-4 h-4 mr-1" />
                      Excellent
                    </p>
                  </div>
                  <Server className="w-12 h-12 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Security Score</p>
                    <p className="text-3xl font-bold">95%</p>
                    <p className="text-purple-100 text-sm flex items-center mt-1">
                      <Shield className="w-4 h-4 mr-1" />
                      Secure
                    </p>
                  </div>
                  <Shield className="w-12 h-12 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Active Sessions</p>
                    <p className="text-3xl font-bold">1,234</p>
                    <p className="text-orange-100 text-sm flex items-center mt-1">
                      <Eye className="w-4 h-4 mr-1" />
                      Real-time
                    </p>
                  </div>
                  <Globe className="w-12 h-12 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Overview Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EnhancedUserActivity />
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <EnhancedPerformanceMetrics />
        </TabsContent>

        <TabsContent value="security">
          <EnhancedSecurityOverview />
        </TabsContent>

        <TabsContent value="users">
          <EnhancedUserActivity />
        </TabsContent>

        <TabsContent value="roles">
          <EnhancedRoleDistribution />
        </TabsContent>
      </Tabs>
    </div>
  )
}
