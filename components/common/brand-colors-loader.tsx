"use client"

import { useEffect } from "react"

export function BrandColorsLoader() {
  useEffect(() => {
    // Fetch and apply brand colors on client mount as fallback
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.branding?.colors) {
          document.documentElement.style.setProperty("--color-primary", data.branding.colors.primary)
          document.documentElement.style.setProperty("--color-secondary", data.branding.colors.secondary)
        }
      })
      .catch((error) => {
        console.error("Failed to fetch brand colors:", error)
      })
  }, [])

  return null
}
