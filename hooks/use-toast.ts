"use client"

import type React from "react"

import { useState, createContext, useContext } from "react"

type ToastVariant = "default" | "destructive" | "success"

interface ToastProps {
  title: string
  description?: string
  variant?: ToastVariant
}

interface Toast {
  id: string
  title: string
  description?: string
  variant: ToastVariant
  visible: boolean
}

interface ToastContextType {
  toast: (props: ToastProps) => void
  toasts: Toast[]
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = ({ title, description, variant = "default" }: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9)

    setToasts((prev) => [...prev, { id, title, description, variant, visible: true }])

    // Auto-hide toast after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, visible: false } : t)))

      // Remove from DOM after animation
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 300)
    }, 5000)
  }

  const dismiss = (id: string) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, visible: false } : t)))

    // Remove from DOM after animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 300)
  }

  return {
    children,
    props: {
      value: { toast, toasts, dismiss }
    }
  };
}

export function useToast() {
  const context = useContext(ToastContext)

  if (context === undefined) {
    // Fallback implementation if used outside provider
    return {
      toast: ({ title, description, variant = "default" }: ToastProps) => {
        console.log(`Toast: ${title} - ${description} (${variant})`)
      },
      toasts: [],
      dismiss: (id: string) => { },
    }
  }

  return context
}
