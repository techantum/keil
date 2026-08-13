"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";
import { EnquiryModal } from "@/components/products/enquiry-modal";
import { defaultContactPageContent } from "@/lib/content/default-content";

const DEFAULT_ENQUIRY = defaultContactPageContent().enquiry;

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);

  const handleEnquiryClick = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedProduct(product);
    setIsEnquiryModalOpen(true);
  };

  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-gray-500">No products found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="block overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl"
          >
            <div className="flex min-h-[180px] flex-col justify-center p-8 text-center">
              <h3 className="mb-3 text-lg font-semibold leading-tight text-[#1a2847]">{product.name}</h3>
              {product.category && <p className="text-sm text-[#6b7a99]">{product.category}</p>}
            </div>
            {product.category && (
              <div className="bg-[#5b8dc5] px-6 py-3 text-center">
                <p className="text-sm font-medium text-white">{product.category}</p>
              </div>
            )}
            <div className="flex justify-center p-8">
              <Button
                onClick={(e) => handleEnquiryClick(e, product)}
                className="rounded-full bg-[#1a2847] px-10 py-6 text-base font-medium text-white hover:bg-[#2a3857]"
              >
                {DEFAULT_ENQUIRY.buttonText}
              </Button>
            </div>
          </Link>
        ))}
      </div>

      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
}
