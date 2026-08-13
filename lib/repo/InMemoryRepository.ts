import type {
  Product,
  Category,
  Service,
  Enquiry,
  HomePageContent,
  AboutPageContent,
  ContactPageContent,
  FooterContent,
  SubCategory,
  Settings,
} from "@/types"
import type { IDataRepository } from "./IDataRepository"
import { seedProducts, seedCategories, seedServices, seedSubcategories, seedHomePageContent, seedAboutPageContent, seedContactPageContent, seedFooterContent } from "./seed-content"

export class InMemoryRepository implements IDataRepository {
  private products: Map<string, Product> = new Map()
  private categories: Map<string, Category> = new Map()
  private subcategories: Map<string, SubCategory> = new Map()
  private services: Map<string, Service> = new Map()
  private enquiries: Map<string, Enquiry> = new Map()
  private homePageContent: HomePageContent
  private aboutPageContent: AboutPageContent
  private contactPageContent: ContactPageContent
  private footerContent: FooterContent

  constructor() {
    // Initialize with seed data
    seedProducts.forEach((p) => this.products.set(p.id, p))
    seedCategories.forEach((c) => this.categories.set(c.id, c))
    seedSubcategories.forEach((s) => this.subcategories.set(s.id, s))
    seedServices.forEach((s) => this.services.set(s.id, s))
    
    this.homePageContent = seedHomePageContent
    this.aboutPageContent = seedAboutPageContent
    this.contactPageContent = seedContactPageContent
    this.footerContent = seedFooterContent
  }

  // Products
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values())
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.products.get(id) || null
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    return Array.from(this.products.values()).find((p) => p.slug === slug) || null
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter((p) => p.category === category)
  }

  async getFilteredProducts(filters: any, search?: string, sort?: string): Promise<Product[]> {
    let filtered = Array.from(this.products.values())

    if (search) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.casNumber.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter((p) => p.category === filters.category)
    }

    if (sort === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sort === "date") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    return filtered
  }

  async searchProducts(query: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.casNumber.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
    )
  }

  async createProduct(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.products.set(newProduct.id, newProduct)
    return newProduct
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const product = this.products.get(id)
    if (!product) return null

    const updated = { ...product, ...updates, updatedAt: new Date() }
    this.products.set(id, updated)
    return updated
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id)
  }

  // Categories
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values())
  }

  async getCategoryById(id: string): Promise<Category | null> {
    return this.categories.get(id) || null
  }

  async createCategory(category: Omit<Category, "id">): Promise<Category> {
    const newCategory: Category = { ...category, id: Date.now().toString() }
    this.categories.set(newCategory.id, newCategory)
    return newCategory
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    const category = this.categories.get(id)
    if (!category) return null

    const updated = { ...category, ...updates }
    this.categories.set(id, updated)
    return updated
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.categories.delete(id)
  }

  // Services
  async getAllServices(): Promise<Service[]> {
    return Array.from(this.services.values())
  }

  async getServiceById(id: string): Promise<Service | null> {
    return this.services.get(id) || null
  }

  async getServiceBySlug(slug: string): Promise<Service | null> {
    return Array.from(this.services.values()).find((s) => s.slug === slug) || null
  }

  async createService(service: Omit<Service, "id" | "createdAt" | "updatedAt">): Promise<Service> {
    const newService: Service = {
      ...service,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.services.set(newService.id, newService)
    return newService
  }

  async updateService(id: string, updates: Partial<Service>): Promise<Service | null> {
    const service = this.services.get(id)
    if (!service) return null

    const updated = { ...service, ...updates, updatedAt: new Date() }
    this.services.set(id, updated)
    return updated
  }

  async deleteService(id: string): Promise<boolean> {
    return this.services.delete(id)
  }

  // Enquiries
  async createEnquiry(enquiry: Omit<Enquiry, "id" | "createdAt" | "updatedAt">): Promise<Enquiry> {
    const newEnquiry: Enquiry = {
      ...enquiry,
      id: Date.now().toString(),
      status: enquiry.status || "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.enquiries.set(newEnquiry.id, newEnquiry)
    return newEnquiry
  }

  async getAllEnquiries(): Promise<Enquiry[]> {
    return Array.from(this.enquiries.values())
  }

  async getEnquiryById(id: string): Promise<Enquiry | null> {
    return this.enquiries.get(id) || null
  }

  async updateEnquiryStatus(id: string, status: "pending" | "contacted" | "resolved"): Promise<Enquiry | null> {
    const enquiry = this.enquiries.get(id)
    if (!enquiry) return null

    const updated = { ...enquiry, status, updatedAt: new Date() }
    this.enquiries.set(id, updated)
    return updated
  }

  async deleteEnquiry(id: string): Promise<boolean> {
    return this.enquiries.delete(id)
  }

  async updateLead(id: string, data: Partial<Enquiry>): Promise<Enquiry | null> {
    const enquiry = this.enquiries.get(id)
    if (!enquiry) return null
    const updated = { ...enquiry, ...data, updatedAt: new Date() }
    this.enquiries.set(id, updated)
    return updated
  }

  async getLeadActivities(_leadId: string) {
    return [] as import("@/types").LeadActivity[]
  }

  async addLeadActivity(
    leadId: string,
    activity: Omit<import("@/types").LeadActivity, "id" | "leadId" | "createdAt">,
  ) {
    return {
      id: `act-${Date.now()}`,
      leadId,
      ...activity,
      createdAt: new Date(),
    }
  }

  // CMS content management methods
  async getHomePageContent(): Promise<HomePageContent> {
    return this.homePageContent
  }

  async updateHomePageContent(content: Partial<HomePageContent>): Promise<HomePageContent> {
    this.homePageContent = { ...this.homePageContent, ...content }
    return this.homePageContent
  }

  async getAboutPageContent(): Promise<AboutPageContent> {
    return this.aboutPageContent
  }

  async updateAboutPageContent(content: Partial<AboutPageContent>): Promise<AboutPageContent> {
    this.aboutPageContent = { ...this.aboutPageContent, ...content }
    return this.aboutPageContent
  }

  async getContactPageContent(): Promise<ContactPageContent> {
    return this.contactPageContent
  }

  async updateContactPageContent(content: Partial<ContactPageContent>): Promise<ContactPageContent> {
    this.contactPageContent = { ...this.contactPageContent, ...content }
    return this.contactPageContent
  }

  async getFooterContent(): Promise<FooterContent> {
    return this.footerContent
  }

  async updateFooterContent(content: Partial<FooterContent>): Promise<FooterContent> {
    this.footerContent = { ...this.footerContent, ...content }
    return this.footerContent
  }

  async getSettings(): Promise<Settings | null> {
    return null
  }

  async updateSettings(_data: Partial<Omit<Settings, "id" | "updatedAt">>): Promise<Settings> {
    throw new Error("Not implemented in InMemoryRepository")
  }
}
