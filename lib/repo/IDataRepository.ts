import type {
  Product,
  Category,
  Service,
  Enquiry,
  HomePageContent,
  AboutPageContent,
  ContactPageContent,
  FooterContent,
  GalleryItem,
  Client,
  Testimonial,
  Settings,
} from "@/types"

export interface IDataRepository {
  // Products
  getAllProducts(): Promise<Product[]>
  getProductById(id: string): Promise<Product | null>
  getProductBySlug(slug: string): Promise<Product | null>
  getProductsByCategory(category: string): Promise<Product[]>
  getFilteredProducts(filters: any, search?: string, sort?: string, limit?: number, skip?: number): Promise<Product[]>
  getProductsCount(filters: any, search?: string): Promise<number>
  searchProducts(query: string): Promise<Product[]>
  createProduct(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product>
  updateProduct(id: string, product: Partial<Product>): Promise<Product | null>
  deleteProduct(id: string): Promise<boolean>

  // Categories
  getAllCategories(): Promise<Category[]>
  getCategoryById(id: string): Promise<Category | null>
  createCategory(category: Omit<Category, "id">): Promise<Category>
  updateCategory(id: string, category: Partial<Category>): Promise<Category | null>
  deleteCategory(id: string): Promise<boolean>

  // Services
  getAllServices(): Promise<Service[]>
  getServiceById(id: string): Promise<Service | null>
  getServiceBySlug(slug: string): Promise<Service | null>
  createService(service: Omit<Service, "id" | "createdAt" | "updatedAt">): Promise<Service>
  updateService(id: string, service: Partial<Service>): Promise<Service | null>
  deleteService(id: string): Promise<boolean>

  // Enquiries
  createEnquiry(enquiry: Omit<Enquiry, "id" | "createdAt" | "updatedAt">): Promise<Enquiry>
  getAllEnquiries(): Promise<Enquiry[]>
  getEnquiryById(id: string): Promise<Enquiry | null>
  updateEnquiryStatus(id: string, status: "pending" | "contacted" | "resolved"): Promise<Enquiry | null>
  updateLead(id: string, data: Partial<Enquiry>): Promise<Enquiry | null>
  getLeadActivities(leadId: string): Promise<import("@/types").LeadActivity[]>
  addLeadActivity(leadId: string, activity: Omit<import("@/types").LeadActivity, "id" | "leadId" | "createdAt">): Promise<import("@/types").LeadActivity>
  deleteEnquiry(id: string): Promise<boolean>

  // CMS content management methods
  // Home Page Content
  getHomePageContent(): Promise<HomePageContent>
  updateHomePageContent(content: Partial<HomePageContent>): Promise<HomePageContent>

  // About Page Content
  getAboutPageContent(): Promise<AboutPageContent>
  updateAboutPageContent(content: Partial<AboutPageContent>): Promise<AboutPageContent>

  // Contact Page Content
  getContactPageContent(): Promise<ContactPageContent>
  updateContactPageContent(content: Partial<ContactPageContent>): Promise<ContactPageContent>

  // Footer Content
  getFooterContent(): Promise<FooterContent>
  updateFooterContent(content: Partial<FooterContent>): Promise<FooterContent>

  // Gallery
  getAllGalleryItems(): Promise<GalleryItem[]>
  getGalleryItemById(id: string): Promise<GalleryItem | null>
  createGalleryItem(item: Omit<GalleryItem, "id" | "createdAt" | "updatedAt">): Promise<GalleryItem>
  updateGalleryItem(id: string, item: Partial<GalleryItem>): Promise<GalleryItem | null>
  deleteGalleryItem(id: string): Promise<boolean>

  // Clients
  getAllClients(): Promise<Client[]>
  getClientById(id: string): Promise<Client | null>
  createClient(client: Omit<Client, "id" | "createdAt" | "updatedAt">): Promise<Client>
  updateClient(id: string, client: Partial<Client>): Promise<Client | null>
  deleteClient(id: string): Promise<boolean>

  // Testimonials
  getAllTestimonials(): Promise<Testimonial[]>
  getTestimonialById(id: string): Promise<Testimonial | null>
  createTestimonial(testimonial: Omit<Testimonial, "id" | "createdAt" | "updatedAt">): Promise<Testimonial>
  updateTestimonial(id: string, testimonial: Partial<Testimonial>): Promise<Testimonial | null>
  deleteTestimonial(id: string): Promise<boolean>

  // Settings
  getSettings(): Promise<Settings | null>
  updateSettings(data: Partial<Omit<Settings, "id" | "updatedAt">>): Promise<Settings>
}
