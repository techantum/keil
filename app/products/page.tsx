"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { WhatsAppButton } from "@/components/common/whatsapp-button"
import { ProductsHero } from "@/components/products/products-hero"
import { ProductsGrid } from "@/components/products/products-grid"
import type { Product, Category } from "@/types"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [initialCategory, setInitialCategory] = useState("")
  const [heroData, setHeroData] = useState<{ backgroundImage?: string; title?: string } | null>(null)

  // Initialize category from URL parameters
  useEffect(() => {
    const categoryParam = searchParams.get("category")
    if (categoryParam) {
      setInitialCategory(categoryParam)
    }
  }, [searchParams])

  useEffect(() => {
    fetchCategories()
    fetchProducts()
    fetchHeroSettings()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/products?limit=1000`)
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchHeroSettings = async () => {
    try {
      const response = await fetch("/api/settings")
      const data = await response.json()
      if (data?.pageHeroes?.products) {
        setHeroData(data.pageHeroes.products)
      }
    } catch (error) {
      console.error("Failed to fetch hero settings:", error)
    }
  }

  const handleFilterChange = (newFilters: any) => {
    // Filter is now handled by the ProductsGrid component internally
  }

  return (
    <>
      <Header />
      <main>
        <ProductsHero 
          backgroundImage={heroData?.backgroundImage}
          title={heroData?.title}
        />
        <ProductsGrid 
          products={products} 
          categories={categories}
          loading={loading}
          onFilterChange={handleFilterChange}
          initialCategory={initialCategory}
        />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
