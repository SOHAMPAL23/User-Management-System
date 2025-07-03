"use client"

import { useToast } from "@/hooks/use-toast"
import { ToastContainer } from "./toast"

export function Toaster() {
  const { toasts, removeToast } = useToast()

  return <ToastContainer toasts={toasts} onRemove={removeToast} />
}
