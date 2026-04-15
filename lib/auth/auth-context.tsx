"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

type UserRole = "landlord" | "tenant" | "agent"

interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  phone_number?: string
  isVerified: boolean
  avatar_url?: string | null;
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, full_name: string, role: UserRole, phone_number?: string) => Promise<void>
  logout: () => Promise<void>
  refreshVerificationStatus: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const refreshVerificationStatus = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error("Verification status refresh failed:", error)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Login failed")
    }

    const data = await response.json()
    setUser(data.user)
    // Force refresh from backend after login/registration
    await checkAuth();

    // Redirect based on role
    if (data.user.role === "landlord") {
      router.push("/landlord/dashboard")
    } else if (data.user.role === "tenant") {
      router.push("/tenant/dashboard")
    } else if (data.user.role === "agent") {
      router.push("/agent/dashboard")
    }
  }

  const register = async (
    email: string,
    password: string,
    full_name: string,
    role: UserRole,
    phone_number?: string,
    avatar_url?: string | null,
  ) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, full_name, role, phone_number, avatar_url }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Registration failed")
    }

    const data = await response.json()
    setUser(data.user)

    // Redirect based on role
    if (data.user.role === "landlord") {
      router.push("/landlord/dashboard")
    } else if (data.user.role === "tenant") {
      router.push("/tenant/dashboard")
    } else if (data.user.role === "agent") {
      router.push("/agent/dashboard")
    }
  }

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
    router.push("/")
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshVerificationStatus }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
