"use client";

import type React from "react";
import { useState, useEffect } from "react";
import type { Product, Category, ContactPageContent } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { asArray } from "@/lib/utils";
import { defaultContactPageContent, withDefault } from "@/lib/content/default-content";

const DEFAULT_COPY = defaultContactPageContent().enquiry;

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
}

export function EnquiryModal({ isOpen, onClose, product }: EnquiryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [copy, setCopy] = useState(DEFAULT_COPY);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    productCategory: "",
    selectedProduct: "",
    message: "",
  });

  useEffect(() => {
    fetch("/api/content/contact")
      .then((res) => res.json())
      .then((data: ContactPageContent) => {
        const enquiry = data?.enquiry;
        if (enquiry) {
          setCopy({
            title: withDefault(enquiry.title, DEFAULT_COPY.title),
            buttonText: withDefault(enquiry.buttonText, DEFAULT_COPY.buttonText),
            submitButtonText: withDefault(enquiry.submitButtonText, DEFAULT_COPY.submitButtonText),
            submittingText: withDefault(enquiry.submittingText, DEFAULT_COPY.submittingText),
            successMessage: withDefault(enquiry.successMessage, DEFAULT_COPY.successMessage),
            defaultSubtitle: withDefault(enquiry.defaultSubtitle, DEFAULT_COPY.defaultSubtitle),
          });
        }
      })
      .catch(() => setCopy(DEFAULT_COPY));
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      fetchAllProducts();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && product) {
      setFormData((prev) => ({
        ...prev,
        productCategory: product.category || "",
        selectedProduct: product.id || "",
      }));
    } else if (isOpen && !product) {
      setFormData({
        name: "",
        email: "",
        mobile: "",
        productCategory: "",
        selectedProduct: "",
        message: "",
      });
    }
  }, [isOpen, product]);

  useEffect(() => {
    if (formData.productCategory) {
      setFilteredProducts(allProducts.filter((p) => p.category === formData.productCategory));
    } else {
      setFilteredProducts(allProducts);
    }
  }, [formData.productCategory, allProducts]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      setCategories(asArray<Category>(await response.json()));
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const response = await fetch("/api/products?limit=1000");
      const data = await response.json();
      setAllProducts(data.products || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const selectedProductObj = allProducts.find((p) => p.id === formData.selectedProduct);

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: product ? "product" : "general_product",
          name: formData.name,
          email: formData.email,
          phone: formData.mobile,
          productName: selectedProductObj?.name || product?.name || undefined,
          productCategory: formData.productCategory || undefined,
          selectedProductId: formData.selectedProduct || product?.id || undefined,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setFormData({
          name: "",
          email: "",
          mobile: "",
          productCategory: "",
          selectedProduct: "",
          message: "",
        });
        onClose();
        alert(copy.successMessage);
      } else {
        alert("Failed to submit enquiry. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSubtitle = () => {
    if (product?.name) return product.name;
    const selectedProd = allProducts.find((p) => p.id === formData.selectedProduct);
    return selectedProd?.name || copy.defaultSubtitle;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="flex max-h-[90vh] max-w-[500px] flex-col p-0" showCloseButton={false}>
        <DialogTitle className="sr-only">{copy.title}</DialogTitle>
        <DialogDescription className="sr-only">{getSubtitle()}</DialogDescription>

        <button onClick={onClose} type="button" className="absolute right-4 top-4 z-10 rounded-sm opacity-70 hover:opacity-100">
          <X className="h-5 w-5" />
        </button>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6 text-center">
              <h2 className="mb-1 font-sans text-xl font-semibold text-[#1a2847]">{copy.title}</h2>
              <p className="font-sans text-sm text-gray-500">{getSubtitle()}</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name*</Label>
                <Input id="name" type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email">Email address*</Label>
                <Input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="mobile">Mobile number*</Label>
                <Input id="mobile" type="tel" required value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} className="mt-1" placeholder="+91 1234567890" />
              </div>
              {categories.length > 0 && (
                <div>
                  <Label>Product Category</Label>
                  <Select value={formData.productCategory} onValueChange={(value) => setFormData({ ...formData, productCategory: value, selectedProduct: "" })} disabled={!!product}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select Product" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {filteredProducts.length > 0 && (
                <div>
                  <Label>Select Product</Label>
                  <Select value={formData.selectedProduct} onValueChange={(value) => setFormData({ ...formData, selectedProduct: value })} disabled={!!product}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select Product" /></SelectTrigger>
                    <SelectContent>
                      {filteredProducts.map((prod) => (
                        <SelectItem key={prod.id} value={prod.id}>{prod.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <Label htmlFor="message">Write Message</Label>
                <Textarea id="message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="mt-1 min-h-[80px]" placeholder="Your message..." />
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 border-t bg-white p-4">
            <Button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-[#1a2847] py-5 font-medium hover:bg-[#2a3a5a]">
              {isSubmitting ? copy.submittingText : copy.submitButtonText}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
