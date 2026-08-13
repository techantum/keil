"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Loader2, ChevronDown, ChevronRight, ChevronLeft } from "lucide-react"
import type { Product, Category } from "@/types"
import { EnquiryModal } from "@/components/products/enquiry-modal"
import { ScrollReveal } from "@/components/common/scroll-reveal"

interface ProductsGridProps {
  products: Product[]
  categories: Category[]
  loading?: boolean
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
  onFilterChange?: (filters: any) => void
  onPageChange?: (page: number) => void
  initialCategory?: string
}

export function ProductsGrid({ 
  products, 
  categories, 
  loading = false,
  pagination,
  onFilterChange,
  onPageChange,
  initialCategory = ""
}: ProductsGridProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined)

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory)
      // Auto-expand the initial category
      const category = categories.find(c => c.name === initialCategory)
      if (category) {
        setExpandedCategories(new Set([category.id]))
      }
    }
  }, [initialCategory, categories])

  const handleCategoryClick = (categoryName: string, categoryId: string) => {
    setSelectedCategory(categoryName)
    onFilterChange?.({ category: categoryName })
    // Auto-expand when clicking on a category
    setExpandedCategories(prev => new Set([...prev, categoryId]))
  }

  const toggleCategoryExpand = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  const handleEnquiryClick = (product: Product) => {
    setSelectedProduct(product)
    setIsEnquiryModalOpen(true)
  }

  // Get products for a specific category
  const getProductsForCategory = (categoryName: string) => {
    return products.filter(p => p.category === categoryName)
  }

  // Get current selected category's products to display
  const displayProducts = selectedCategory 
    ? products.filter(p => p.category === selectedCategory)
    : products

  return (
    <section className="py-16">
      <ScrollReveal>
        <div className="container mx-auto px-4">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Sidebar */}
          <div className="w-full shrink-0 lg:w-64">
            <div className="bg-[#1a2847] rounded-xl overflow-hidden">
              <div className="p-4">
                <h2 className="text-xl font-bold text-white">PRODUCTS</h2>
              </div>
              <div className="space-y-1">
                {categories.map((category) => {
                  const categoryProducts = getProductsForCategory(category.name)
                  const isExpanded = expandedCategories.has(category.id)
                  const isSelected = selectedCategory === category.name
                  
                  return (
                    <div key={category.id}>
                      <div 
                        className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#2a3a5a]' : 'hover:bg-[#2a3a5a]'
                        }`}
                        onClick={() => handleCategoryClick(category.name, category.id)}
                      >
                        <span className="text-white font-medium text-sm">{category.name}</span>
                        {categoryProducts.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleCategoryExpand(category.id)
                            }}
                            className="text-white p-1 hover:bg-[#3a4a6a] rounded"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>
                      
                      {/* Sub-items (products in category) */}
                      {isExpanded && categoryProducts.length > 0 && (
                        <div className="bg-[#1a2847]/80">
                          {categoryProducts.map((product) => (
                            <Link
                              key={product.id}
                              href={`/products/${product.slug}`}
                              className="flex items-center gap-2 px-6 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#2a3a5a] transition-colors"
                            >
                              <span className="w-2 h-2 rounded-full bg-[#e87c2e]"></span>
                              {product.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {/* No Products */}
            {!loading && displayProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500">No products found</p>
              </div>
            )}

            {/* Products */}
            {!loading && displayProducts.length > 0 && (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {displayProducts.map((product) => (
                    <Link 
                      key={product.id} 
                      href={`/products/${product.slug}`}
                      className="group overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-lg"
                    >
                      {/* Image */}
                      <div className="aspect-square overflow-hidden bg-gray-50 p-4">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="h-full w-full object-contain transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      {/* Title */}
                      <div className="p-4 text-center border-t">
                        <h3 className="font-semibold text-gray-900">
                          {product.name}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>

              </>
            )}
          </div>
        </div>
        </div>
      </ScrollReveal>

      {/* Enquiry Modal */}
      {selectedProduct && (
        <EnquiryModal
          isOpen={isEnquiryModalOpen}
          onClose={() => setIsEnquiryModalOpen(false)}
          product={selectedProduct}
        />
      )}
    </section>
  )
}
