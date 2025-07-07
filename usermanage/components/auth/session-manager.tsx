"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

interface SessionManagerProps {
  children: React.ReactNode
}

export function SessionManager({ children }: SessionManagerProps) {
  const { isAuthenticated, refreshToken, logout } = useAuth()
  const { toast } = useToast()
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const warningShownRef = useRef(false)

  useEffect(() => {
    if (!isAuthenticated) {
      // Clear any existing intervals
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
      warningShownRef.current = false
      return
    }

    // Set up token refresh interval (every 15 minutes)
    refreshIntervalRef.current = setInterval(
      async () => {
        try {
          await refreshToken()
        } catch (error) {
          if (!warningShownRef.current) {
            warningShownRef.current = true
            toast({
              type: "warning",
              title: "Session expiring",
              description: "Your session is about to expire. Please save your work.",
              duration: 10000,
            })

            // Auto-logout after 1 minute if token refresh continues to fail
            setTimeout(async () => {
              try {
                await refreshToken()
              } catch {
                toast({
                  type: "error",
                  title: "Session expired",
                  description: "You have been logged out due to session expiration.",
                })
                await logout()
              }
            }, 60000)
          }
        }
      },
      15 * 60 * 1000,
    ) // 15 minutes

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [isAuthenticated, refreshToken, logout, toast])

  // Handle page visibility change
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible" && isAuthenticated) {
        try {
          await refreshToken()
        } catch (error) {
          // Token might be expired, let the interval handler deal with it
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [isAuthenticated, refreshToken])

  return <>{children}</>
}
