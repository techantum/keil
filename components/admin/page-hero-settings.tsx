"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MediaUpload } from "@/components/admin/media-upload"
import { useToastContext } from "@/components/providers/toast-provider"
import { Image, Save, ChevronDown, ChevronUp } from "lucide-react"

interface PageHeroSettingsProps {
  pageKey: "services" | "gallery" | "clients" | "testimonials" | "products"
  pageTitle: string
}

export function PageHeroSettings({ pageKey, pageTitle }: PageHeroSettingsProps) {
  const { success, error } = useToastContext()
  const [isExpanded, setIsExpanded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [heroData, setHeroData] = useState({
    backgroundImage: "",
    title: pageTitle.toUpperCase()
  })

  useEffect(() => {
    fetchHeroSettings()
  }, [])

  const fetchHeroSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings")
      const data = await response.json()
      if (data?.pageHeroes?.[pageKey]) {
        setHeroData(data.pageHeroes[pageKey])
      }
    } catch (err) {
      console.error("Failed to fetch hero settings:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveHero = async () => {
    setSaving(true)
    try {
      // First fetch current settings
      const getResponse = await fetch("/api/admin/settings")
      const currentSettings = await getResponse.json()
      
      // Update only the pageHeroes for this page
      const updatedSettings = {
        ...currentSettings,
        pageHeroes: {
          ...currentSettings.pageHeroes,
          [pageKey]: heroData
        }
      }
      
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSettings)
      })

      if (!response.ok) throw new Error("Failed to save hero settings")
      
      success("Hero settings saved successfully")
    } catch (err) {
      error("Failed to save hero settings")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="mb-6 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Image className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Page Hero Settings</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Configure the hero banner image and title for the {pageTitle.toLowerCase()} page
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      
      {isExpanded && (
        <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700 mt-0">
          {loading ? (
            <div className="py-8 text-center text-gray-500">Loading hero settings...</div>
          ) : (
            <div className="space-y-4 pt-4">
              {/* Hero Preview */}
              {heroData.backgroundImage && (
                <div className="relative h-40 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img 
                    src={heroData.backgroundImage} 
                    alt="Hero Preview" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white tracking-wider">
                      {heroData.title}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="heroTitle" className="mb-2 block">Hero Title</Label>
                  <Input
                    id="heroTitle"
                    value={heroData.title}
                    onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                    placeholder={`e.g., ${pageTitle.toUpperCase()}`}
                  />
                </div>
                
                <div>
                  <Label className="mb-2 block">Hero Background Image</Label>
                  <MediaUpload
                    value={heroData.backgroundImage}
                    onChange={(url) => setHeroData({ ...heroData, backgroundImage: url })}
                    accept="image"
                    maxWidth={1920}
                    maxHeight={600}
                    maxSizeMB={5}
                    placeholder="Upload hero banner image"
                  />
                </div>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Recommended: 1920x600px, JPG or PNG format
              </p>
              
              <div className="flex justify-end pt-2">
                <Button onClick={handleSaveHero} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Hero Settings"}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
