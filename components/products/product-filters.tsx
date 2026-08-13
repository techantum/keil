"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter } from "lucide-react"

export function ProductFilters() {
  const [searchTerm, setSearchTerm] = useState("")
  const [inStockOnly, setInStockOnly] = useState(false)

  const handleApplyFilters = () => {
    const params = new URLSearchParams(window.location.search)
    
    if (searchTerm) {
      params.set("search", searchTerm)
    } else {
      params.delete("search")
    }
    
    if (inStockOnly) {
      params.set("inStock", "true")
    } else {
      params.delete("inStock")
    }
    
    // Update URL without reloading the page
    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.pushState({}, "", newUrl)
    window.location.reload()
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setInStockOnly(false)
    window.history.pushState({}, "", window.location.pathname)
    window.location.reload()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filter Products
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div>
          <Label htmlFor="search" className="text-sm font-medium">
            Search Products
          </Label>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="search"
              type="text"
              placeholder="Search by name, CAS number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stock Status */}
        <div>
          <Label className="text-sm font-medium">Availability</Label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="inStock"
                checked={inStockOnly}
                onCheckedChange={setInStockOnly}
              />
              <Label htmlFor="inStock" className="text-sm">
                In Stock Only
              </Label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button onClick={handleApplyFilters} className="w-full">
            Apply Filters
          </Button>
          <Button
            onClick={handleClearFilters}
            variant="outline"
            className="w-full"
          >
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
