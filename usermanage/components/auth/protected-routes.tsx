"use client"

import type React from "react"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { LoginForm } from "./login-form"
import { Lock } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: string[]
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, requiredRoles, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, hasAnyRole, refreshToken } = useAuth()

  useEffect(() => {
    // Auto-refresh token on mount
    if (isAuthenticated) {
      refreshToken().catch(() => {
        // Token refresh failed, user will be logged out automatically
      })
    }
  }, [isAuthenticated, refreshToken])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-white"
        >
          <motion.div
            className="w-16 h-16 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <p className="text-xl font-semibold">Authenticating...</p>
        </motion.div>
      </div>
    )
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm />
  }

  // Check role-based access
  if (requiredRoles && requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    return (
      fallback || (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Access Denied</h2>
            <p className="text-slate-600 mb-6">You don't have the required permissions to access this page.</p>
            <div className="bg-slate-100 rounded-lg p-4">
              <p className="text-sm text-slate-600">
                Required roles: <span className="font-medium">{requiredRoles.join(", ")}</span>
              </p>
              <p className="text-sm text-slate-600 mt-1">
                Your roles: <span className="font-medium">{user?.roles.join(", ") || "None"}</span>
              </p>
            </div>
          </motion.div>
        </div>
      )
    )
  }

  return <>{children}</>
}
