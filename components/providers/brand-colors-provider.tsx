"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface BrandColors {
  primary: string
  secondary: string
}

interface BrandColorsContextType {
  colors: BrandColors
  isLoading: boolean
}

const BrandColorsContext = createContext<BrandColorsContextType>({
  colors: {
    primary: "#4384C5",
    secondary: "#053C74"
  },
  isLoading: true
})

export function useBrandColors() {
  return useContext(BrandColorsContext)
}

export function BrandColorsProvider({ children }: { children: ReactNode }) {
  const [colors, setColors] = useState<BrandColors>({
    primary: "#4384C5",
    secondary: "#053C74"
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.branding?.colors) {
          setColors(data.branding.colors)
          
          // Set CSS custom properties for global use
          document.documentElement.style.setProperty("--color-primary", data.branding.colors.primary)
          document.documentElement.style.setProperty("--color-secondary", data.branding.colors.secondary)
        }
      })
      .catch((error) => {
        console.error("Failed to fetch brand colors:", error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return (
    <BrandColorsContext.Provider value={{ colors, isLoading }}>
      {children}
    </BrandColorsContext.Provider>
  )
}
