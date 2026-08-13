"use client"

import { createContext, useContext, ReactNode } from "react"
import { useToast as useToastHook } from "@/components/ui/toast"
import { ToastContainer as CustomToastContainer } from "@/components/ui/toast"

interface ToastContextType {
  success: (title: string, description?: string) => string
  error: (title: string, description?: string) => string
  warning: (title: string, description?: string) => string
  info: (title: string, description?: string) => string
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const { success, error, warning, info, toasts, dismissToast } = useToastHook()

  const contextValue: ToastContextType = {
    success,
    error, 
    warning,
    info,
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <CustomToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  )
}

export function useToastContext() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToastContext must be used within a ToastProvider")
  }
  return context
}
