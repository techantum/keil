"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import type { Product } from "@/types"
import { Button } from "@/components/ui/button"
import { EnquiryModal } from "@/components/products/enquiry-modal"
import {
  getProductDetails,
  getProductDetailsSectionTitle,
} from "@/lib/products/product-details"

import { defaultContactPageContent } from "@/lib/content/default-content";

const DEFAULT_ENQUIRY = defaultContactPageContent().enquiry;

interface ProductDetailContentProps {
  product: Product
}

export function ProductDetailContent({ product }: ProductDetailContentProps) {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false)
  const [enquiryButtonText, setEnquiryButtonText] = useState(DEFAULT_ENQUIRY.buttonText)

  const details = getProductDetails(product)
  const detailsSectionTitle = getProductDetailsSectionTitle(product)

  useEffect(() => {
    fetch("/api/content/contact")
      .then((res) => res.json())
      .then((data) => {
        if (data?.enquiry?.buttonText) setEnquiryButtonText(data.enquiry.buttonText)
      })
      .catch(() => {})
  }, [])

  return (
    <>
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Product Image */}
          <div className="lg:w-1/3">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-50">
              <Image
                src={product.image || "/images/placeholder.png"}
                alt={product.name}
                fill
                className="object-contain p-4"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:w-2/3">
            {/* Product Title */}
            <h1 className="text-2xl font-semibold text-[#1a2847] mb-6">
              {product.name}
            </h1>

            {/* Description */}
            {product.description && (
              <div className="mb-8">
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Key Features and Details */}
            {details.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#e87c2e] mb-4">
                  {detailsSectionTitle}
                </h3>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <tbody className="divide-y">
                      {details.map((detail, index) => (
                        <tr key={`${detail.title}-${index}`}>
                          <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700 w-1/3">
                            {detail.title}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {detail.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div>
              <Button
                onClick={() => setIsEnquiryOpen(true)}
                size="lg"
                className="rounded-full bg-[#1a2847] px-12 hover:bg-[#2a3a5a]"
              >
                {enquiryButtonText}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} product={product} />
    </>
  )
}
