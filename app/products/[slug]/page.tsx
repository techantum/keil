import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getRepository } from "@/lib/repo"
import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { WhatsAppButton } from "@/components/common/whatsapp-button"
import { StructuredData } from "@/components/common/structured-data"
import { generateProductStructuredData, generateBreadcrumbStructuredData, generateSEOMetadata } from "@/lib/seo"
import { ProductDetailHero } from "@/components/products/product-detail-hero"
import { ProductDetailContent } from "@/components/products/product-detail-content"

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params
  const repo = getRepository()
  const product = await repo.getProductBySlug(slug)

  if (!product) {
    return generateSEOMetadata({ path: `/products/${slug}`, noIndex: true })
  }

  return generateSEOMetadata({
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.description,
    path: `/products/${slug}`,
  })
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const repo = getRepository()
  const [product, settings] = await Promise.all([
    repo.getProductBySlug(slug),
    repo.getSettings(),
  ])

  if (!product) {
    notFound()
  }

  const homeTitle = settings?.seo?.pages?.home?.title || ""
  const productsTitle = settings?.seo?.pages?.products?.title || ""

  const breadcrumbs = generateBreadcrumbStructuredData([
    ...(homeTitle ? [{ name: homeTitle, url: "/" }] : []),
    ...(productsTitle ? [{ name: productsTitle, url: "/products" }] : []),
    { name: product.name, url: `/products/${slug}` },
  ])

  const productData = await generateProductStructuredData(product)

  return (
    <>
      <StructuredData data={breadcrumbs} />
      <StructuredData data={productData} />
      <Header />
      <ProductDetailHero />
      <main className="min-h-screen bg-background">
        <ProductDetailContent product={product} />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
