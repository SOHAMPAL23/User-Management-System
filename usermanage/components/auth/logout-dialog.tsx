"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/src/components/ui/Button"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { LogOut, AlertTriangle } from "lucide-react"

interface LogoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm?: () => void
}

export function LogoutDialog({ open, onOpenChange, onConfirm }: LogoutDialogProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { logout, user } = useAuth()
  const { toast } = useToast()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      if (onConfirm) {
        await onConfirm()
      } else {
        await logout()
        toast({
          type: "success",
          title: "Logged out successfully",
          description: "You have been securely logged out of the system",
        })
      }
      onOpenChange(false)
    } catch (error) {
      toast({
        type: "error",
        title: "Logout failed",
        description: error instanceof Error ? error.message : "Failed to logout",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <DialogTitle>Confirm Logout</DialogTitle>
              <DialogDescription>Are you sure you want to sign out?</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-sm text-slate-600">
              You are currently signed in as <span className="font-medium">{user?.username}</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">You will need to sign in again to access the system.</p>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1" disabled={isLoggingOut}>
              Cancel
            </Button>
            <Button onClick={handleLogout} className="flex-1 bg-red-600 hover:bg-red-700" disabled={isLoggingOut}>
              {isLoggingOut ? (
                <div className="flex items-center space-x-2">
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                  <span>Signing out...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
