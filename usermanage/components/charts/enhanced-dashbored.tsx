"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Bar,
  Line,
  ComposedChart,
  Treemap,
  ScatterChart,
  Scatter,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/Card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { mockAPI } from "@/lib/mock-api"
import { Skeleton } from "@/components/UI/skeleton"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  Zap,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  Lock,
  UserCheck,
  UserX,
  BarChart3,
  PieChartIcon,
  Target,
  Monitor,
} from "lucide-react"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316", "#84cc16"]

// Enhanced Performance Metrics Component
export function EnhancedPerformanceMetrics() {
  const [performanceData, setPerformanceData] = useState<any[]>([])
  const [realTimeMetrics, setRealTimeMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPerformanceData()
    const interval = setInterval(loadRealTimeMetrics, 5000) // Update every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const loadPerformanceData = async () => {
    try {
      const data = await mockAPI.getPerformanceData("1")
      setPerformanceData(data)
      await loadRealTimeMetrics()
    } catch (error) {
      console.error("Failed to load performance data:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadRealTimeMetrics = async () => {
    // Simulate real-time metrics
    setRealTimeMetrics({
      cpu: Math.floor(Math.random() * 40) + 30,
      memory: Math.floor(Math.random() * 30) + 50,
      disk: Math.floor(Math.random() * 20) + 15,
      network: Math.floor(Math.random() * 50) + 25,
      responseTime: Math.floor(Math.random() * 100) + 50,
      throughput: Math.floor(Math.random() * 1000) + 500,
    })
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Real-time Performance Gauges */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { key: "cpu", label: "CPU", icon: Cpu, color: "#3b82f6", unit: "%" },
          { key: "memory", label: "Memory", icon: Database, color: "#10b981", unit: "%" },
          { key: "disk", label: "Disk", icon: HardDrive, color: "#f59e0b", unit: "%" },
          { key: "network", label: "Network", icon: Wifi, color: "#ef4444", unit: "%" },
          { key: "responseTime", label: "Response", icon: Clock, color: "#8b5cf6", unit: "ms" },
          { key: "throughput", label: "Throughput", icon: Activity, color: "#06b6d4", unit: "/s" },
        ].map((metric) => {
          const IconComponent = metric.icon
          const value = realTimeMetrics?.[metric.key] || 0
          const isHigh = value > 70

          return (
            <motion.div
              key={metric.key}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white/60 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <IconComponent className="w-5 h-5" style={{ color: metric.color }} />
                    <Badge variant={isHigh ? "destructive" : "default"} className="text-xs">
                      {value}
                      {metric.unit}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{metric.label}</p>
                    <Progress value={metric.unit === "ms" ? Math.min(value / 2, 100) : value} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/60 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              <span>System Performance (24h)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="memoryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="diskGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="cpu"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#cpuGradient)"
                  name="CPU Usage (%)"
                />
                <Area
                  type="monotone"
                  dataKey="memory"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#memoryGradient)"
                  name="Memory Usage (%)"
                />
                <Area
                  type="monotone"
                  dataKey="disk"
                  stroke="#f59e0b"
                  fillOpacity={1}
                  fill="url(#diskGradient)"
                  name="Disk Usage (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Distribution */}
        <Card className="bg-white/60 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-600" />
              <span>Resource Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <Treemap
                data={[
                  { name: "CPU", size: realTimeMetrics?.cpu || 30, fill: "#3b82f6" },
                  { name: "Memory", size: realTimeMetrics?.memory || 50, fill: "#10b981" },
                  { name: "Disk", size: realTimeMetrics?.disk || 20, fill: "#f59e0b" },
                  { name: "Network", size: realTimeMetrics?.network || 35, fill: "#ef4444" },
                ]}
                dataKey="size"
                ratio={4 / 3}
                stroke="#fff"
                strokeWidth={2}
              />
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Enhanced Security Overview Component
export function EnhancedSecurityOverview() {
  const [securityData, setSecurityData] = useState<any[]>([])
  const [threatData, setThreatData] = useState<any[]>([])
  const [securityScore, setSecurityScore] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSecurityData()
  }, [])

  const loadSecurityData = async () => {
    try {
      const data = await mockAPI.getSecurityData("1")
      setSecurityData(data)

      // Generate threat data
      const threats = [
        { time: "00:00", attempts: 12, blocked: 11, allowed: 1 },
        { time: "04:00", attempts: 8, blocked: 8, allowed: 0 },
        { time: "08:00", attempts: 25, blocked: 23, allowed: 2 },
        { time: "12:00", attempts: 18, blocked: 17, allowed: 1 },
        { time: "16:00", attempts: 32, blocked: 30, allowed: 2 },
        { time: "20:00", attempts: 15, blocked: 14, allowed: 1 },
      ]
      setThreatData(threats)

      // Calculate overall security score
      const avgScore = data.reduce((sum, item) => sum + item.value, 0) / data.length
      setSecurityScore(Math.round(avgScore))
    } catch (error) {
      console.error("Failed to load security data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Security Score Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Security Score</p>
                <p className="text-3xl font-bold">{securityScore}%</p>
                <p className="text-green-100 text-sm flex items-center mt-1">
                  <Shield className="w-4 h-4 mr-1" />
                  Excellent
                </p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Threats Blocked</p>
                <p className="text-3xl font-bold">1,247</p>
                <p className="text-blue-100 text-sm flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +15% today
                </p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Active Alerts</p>
                <p className="text-3xl font-bold">3</p>
                <p className="text-orange-100 text-sm flex items-center mt-1">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Requires attention
                </p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Compliance</p>
                <p className="text-3xl font-bold">98%</p>
                <p className="text-purple-100 text-sm flex items-center mt-1">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  SOC2 Compliant
                </p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/60 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-red-600" />
              <span>Security Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={securityData}>
                <RadialBar
                  minAngle={15}
                  label={{ position: "insideStart", fill: "#fff" }}
                  background
                  clockWise
                  dataKey="value"
                >
                  {securityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </RadialBar>
                <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <span>Threat Detection (24h)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={threatData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Bar dataKey="blocked" stackId="a" fill="#10b981" name="Blocked" />
                <Bar dataKey="allowed" stackId="a" fill="#ef4444" name="Allowed" />
                <Line type="monotone" dataKey="attempts" stroke="#3b82f6" strokeWidth={3} name="Total Attempts" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Enhanced User Activity Component
export function EnhancedUserActivity() {
  const [activityData, setActivityData] = useState<any[]>([])
  const [userEngagementData, setUserEngagementData] = useState<any[]>([])
  const [userBehaviorData, setUserBehaviorData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadActivityData()
  }, [])

  const loadActivityData = async () => {
    try {
      const activity = await mockAPI.getUserActivityData("1")
      setActivityData(activity)

      // Generate enhanced engagement data
      const engagement = [
        { day: "Mon", logins: 45, sessions: 120, avgDuration: 25, bounceRate: 15 },
        { day: "Tue", logins: 52, sessions: 135, avgDuration: 28, bounceRate: 12 },
        { day: "Wed", logins: 48, sessions: 128, avgDuration: 22, bounceRate: 18 },
        { day: "Thu", logins: 61, sessions: 145, avgDuration: 30, bounceRate: 10 },
        { day: "Fri", logins: 55, sessions: 140, avgDuration: 26, bounceRate: 14 },
        { day: "Sat", logins: 35, sessions: 85, avgDuration: 20, bounceRate: 25 },
        { day: "Sun", logins: 28, sessions: 70, avgDuration: 18, bounceRate: 30 },
      ]
      setUserEngagementData(engagement)

      // Generate user behavior data
      const behavior = [
        { hour: "00", active: 12, idle: 3, offline: 85 },
        { hour: "06", active: 25, idle: 8, offline: 67 },
        { hour: "09", active: 78, idle: 15, offline: 7 },
        { hour: "12", active: 92, idle: 6, offline: 2 },
        { hour: "15", active: 85, idle: 12, offline: 3 },
        { hour: "18", active: 65, idle: 20, offline: 15 },
        { hour: "21", active: 45, idle: 25, offline: 30 },
      ]
      setUserBehaviorData(behavior)
    } catch (error) {
      console.error("Failed to load activity data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const totalActiveUsers = activityData[activityData.length - 1]?.active || 0
  const totalInactiveUsers = activityData[activityData.length - 1]?.inactive || 0
  const totalSessions = userEngagementData.reduce((sum, day) => sum + day.sessions, 0)
  const avgSessionDuration = Math.round(
    userEngagementData.reduce((sum, day) => sum + day.avgDuration, 0) / userEngagementData.length,
  )

  return (
    <div className="space-y-6">
      {/* Activity Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden relative">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Active Users</p>
                <p className="text-3xl font-bold">{totalActiveUsers}</p>
                <p className="text-blue-100 text-sm flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12% from last week
                </p>
              </div>
              <UserCheck className="w-12 h-12 text-blue-200" />
            </div>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white overflow-hidden relative">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Inactive Users</p>
                <p className="text-3xl font-bold">{totalInactiveUsers}</p>
                <p className="text-red-100 text-sm flex items-center mt-1">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  -5% from last week
                </p>
              </div>
              <UserX className="w-12 h-12 text-red-200" />
            </div>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white overflow-hidden relative">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Sessions</p>
                <p className="text-3xl font-bold">{totalSessions}</p>
                <p className="text-green-100 text-sm flex items-center mt-1">
                  <Activity className="w-4 h-4 mr-1" />
                  This week
                </p>
              </div>
              <Activity className="w-12 h-12 text-green-200" />
            </div>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white overflow-hidden relative">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Avg. Session</p>
                <p className="text-3xl font-bold">{avgSessionDuration}m</p>
                <p className="text-purple-100 text-sm flex items-center mt-1">
                  <Clock className="w-4 h-4 mr-1" />
                  Duration
                </p>
              </div>
              <Clock className="w-12 h-12 text-purple-200" />
            </div>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full" />
          </CardContent>
        </Card>
      </div>

      {/* Activity Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity Trend */}
        <Card className="bg-white/60 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span>User Activity Trend (7 Days)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="inactiveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={(value: string | number | Date) =>
                    new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }
                />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  labelFormatter={(value: string | number | Date) => new Date(value).toLocaleDateString()}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="active"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#activeGradient)"
                  name="Active Users"
                />
                <Area
                  type="monotone"
                  dataKey="inactive"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#inactiveGradient)"
                  name="Inactive Users"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Behavior Heatmap */}
        <Card className="bg-white/60 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Monitor className="w-5 h-5 text-green-600" />
              <span>User Behavior (Hourly)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userBehaviorData}>
                <defs>
                  <linearGradient id="activeUserGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="idleUserGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="offlineUserGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6b7280" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6b7280" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="active"
                  stackId="1"
                  stroke="#10b981"
                  fill="url(#activeUserGradient)"
                  name="Active"
                />
                <Area
                  type="monotone"
                  dataKey="idle"
                  stackId="1"
                  stroke="#f59e0b"
                  fill="url(#idleUserGradient)"
                  name="Idle"
                />
                <Area
                  type="monotone"
                  dataKey="offline"
                  stackId="1"
                  stroke="#6b7280"
                  fill="url(#offlineUserGradient)"
                  name="Offline"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Engagement */}
      <Card className="bg-white/60 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            <span>Weekly User Engagement</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={userEngagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <YAxis yAxisId="left" stroke="#64748b" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="logins" fill="#3b82f6" name="Daily Logins" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="left" dataKey="sessions" fill="#10b981" name="Sessions" radius={[4, 4, 0, 0]} />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgDuration"
                stroke="#f59e0b"
                strokeWidth={3}
                name="Avg Duration (min)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="bounceRate"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Bounce Rate (%)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

// Enhanced Role Distribution Component
export function EnhancedRoleDistribution() {
  const [roleData, setRoleData] = useState<any[]>([])
  const [roleHierarchy, setRoleHierarchy] = useState<any[]>([])
  const [privilegeMatrix, setPrivilegeMatrix] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRoleData()
  }, [])

  const loadRoleData = async () => {
    try {
      const roles = await mockAPI.getRoleDistributionData("1")
      setRoleData(roles)

      // Generate role hierarchy data
      const hierarchy = [
        { name: "Super Admin", level: 1, users: 5, privileges: 25, color: "#ef4444" },
        { name: "Manager", level: 2, users: 15, privileges: 18, color: "#8b5cf6" },
        { name: "User", level: 3, users: 25, privileges: 8, color: "#3b82f6" },
        { name: "Viewer", level: 4, users: 5, privileges: 3, color: "#6b7280" },
      ]
      setRoleHierarchy(hierarchy)

      // Generate privilege matrix
      const matrix = [
        { role: "Super Admin", userMgmt: 100, roleMgmt: 100, orgMgmt: 100, system: 100, reports: 100 },
        { role: "Manager", userMgmt: 80, roleMgmt: 60, orgMgmt: 90, system: 40, reports: 100 },
        { role: "User", userMgmt: 20, roleMgmt: 0, orgMgmt: 30, system: 0, reports: 60 },
        { role: "Viewer", userMgmt: 10, roleMgmt: 0, orgMgmt: 10, system: 0, reports: 40 },
      ]
      setPrivilegeMatrix(matrix)
    } catch (error) {
      console.error("Failed to load role data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Role Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {roleData.map((role, index) => (
          <Card key={role.role} className="bg-white/60 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{role.role}</p>
                  <p className="text-2xl font-bold">{role.count}</p>
                  <p className="text-xs text-slate-500">{role.percentage}% of users</p>
                </div>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: COLORS[index] + "20" }}
                >
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Role Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role Distribution Pie Chart */}
        <Card className="bg-white/60 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChartIcon className="w-5 h-5 text-purple-600" />
              <span>Role Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: { role: string; percentage: number }) => `${entry.role} (${entry.percentage}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Role Hierarchy */}
        <Card className="bg-white/60 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Role Hierarchy</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={roleHierarchy}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="privileges" stroke="#64748b" fontSize={12} name="Privileges" />
                <YAxis dataKey="users" stroke="#64748b" fontSize={12} name="Users" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  formatter={(value: any, name: string) => [value, name === "users" ? "Users" : "Privileges"]}
                  labelFormatter={(_label: any, payload: { payload: { name: any } }[]) => payload?.[0]?.payload?.name || ""}
                />
                <Scatter dataKey="users" fill="#3b82f6">
                  {roleHierarchy.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Privilege Matrix */}
      <Card className="bg-white/60 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span>Privilege Access Matrix</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {privilegeMatrix.map((role) => (
              <div key={role.role} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{role.role}</h4>
                  <Badge variant="outline">{Object.keys(role).length - 1} categories</Badge>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(role)
                    .filter(([key]) => key !== "role")
                    .map(([category, value]) => (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="capitalize">{category.replace(/([A-Z])/g, " $1").trim()}</span>
                          <span>{value}%</span>
                        </div>
                        <Progress value={value as number} className="h-2" />
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
