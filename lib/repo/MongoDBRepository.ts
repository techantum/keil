import type { IDataRepository } from "./IDataRepository";
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
} from "@/types";
import connectDB from "@/lib/db/mongodb";
import { ProductModel } from "@/lib/db/models/Product";
import { CategoryModel } from "@/lib/db/models/Category";
import { ServiceModel } from "@/lib/db/models/Service";
import { EnquiryModel } from "@/lib/db/models/Enquiry";
import { ContentModel } from "@/lib/db/models/Content";
import { GalleryModel } from "@/lib/db/models/Gallery";
import { ClientModel } from "@/lib/db/models/Client";
import { TestimonialModel } from "@/lib/db/models/Testimonial";
import { SettingsModel } from "@/lib/db/models/Settings";

class MongoDBRepository implements IDataRepository {
  private async ensureConnection() {
    await connectDB();
  }

  // Helper to convert MongoDB document to Product type
  private toProduct(doc: any): Product {
    return {
      id: doc._id.toString(),
      name: doc.name,
      slug: doc.slug,
      category: doc.category,
      categoryId: doc.categoryId,
      description: doc.description,
      image: doc.image,
      // Industrial equipment specifications
      productType: doc.productType,
      capacity: doc.capacity,
      screenDimension: doc.screenDimension,
      numberOfDecks: doc.numberOfDecks,
      motorPower: doc.motorPower,
      gyratoryCircular: doc.gyratoryCircular,
      specialFeatures: doc.specialFeatures,
      availability: doc.availability,
      featured: doc.featured,
      // SEO fields
      metaTitle: doc.metaTitle,
      metaDescription: doc.metaDescription,
      metaKeywords: doc.metaKeywords || [],
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  private toCategory(doc: any): Category {
    return {
      id: doc._id.toString(),
      name: doc.name,
      slug: doc.slug,
      description: doc.description,
      icon: doc.icon,
      image: doc.image,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  private toService(doc: any): Service {
    return {
      id: doc._id.toString(),
      title: doc.title,
      subtitle: doc.subtitle,
      slug: doc.slug,
      description: doc.description,
      icon: doc.icon,
      image: doc.image,
      features: doc.features || [],
      featured: doc.featured,
      // SEO fields
      metaTitle: doc.metaTitle,
      metaDescription: doc.metaDescription,
      metaKeywords: doc.metaKeywords || [],
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  private toEnquiry(doc: any): Enquiry {
    return {
      id: doc._id.toString(),
      type: doc.type || "general",
      name: doc.name,
      email: doc.email,
      phone: doc.phone,
      company: doc.company,
      productName: doc.productName,
      productCategory: doc.productCategory,
      selectedProductId: doc.selectedProductId,
      message: doc.message,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  // Products
  async getAllProducts(): Promise<Product[]> {
    await this.ensureConnection();
    const products = await ProductModel.find().sort({ createdAt: -1 });
    return products.map(this.toProduct);
  }

  async getProductById(id: string): Promise<Product | null> {
    await this.ensureConnection();
    const product = await ProductModel.findById(id);
    return product ? this.toProduct(product) : null;
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    await this.ensureConnection();
    const product = await ProductModel.findOne({ slug });
    return product ? this.toProduct(product) : null;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    await this.ensureConnection();
    const products = await ProductModel.find({ category }).sort({
      createdAt: -1,
    });
    return products.map(this.toProduct);
  }

  async searchProducts(query: string): Promise<Product[]> {
    await this.ensureConnection();
    const products = await ProductModel.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { casNumber: { $regex: query, $options: "i" } },
        { hsCode: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });
    return products.map(this.toProduct);
  }

  async getFilteredProducts(
    filters: any,
    search?: string,
    sort?: string,
    limit?: number,
    skip?: number,
  ): Promise<Product[]> {
    await this.ensureConnection();
    const query: any = {};

    // Apply filters
    if (filters.category) {
      query.category = filters.category;
    }
    if (filters.subcategory) {
      query.subcategory = filters.subcategory;
    }
    if (filters.inStock !== undefined) {
      query.inStock = filters.inStock;
    }

    // Add search criteria
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { casNumber: { $regex: search, $options: "i" } },
        { hsCode: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Build sort criteria
    let sortCriteria: any = { createdAt: -1 }; // default sort
    if (sort === "name") {
      sortCriteria = { name: 1 };
    } else if (sort === "name-desc") {
      sortCriteria = { name: -1 };
    } else if (sort === "newest") {
      sortCriteria = { createdAt: -1 };
    } else if (sort === "oldest") {
      sortCriteria = { createdAt: 1 };
    }

    let query_builder = ProductModel.find(query).sort(sortCriteria);
    if (limit) query_builder = query_builder.limit(limit);
    if (skip) query_builder = query_builder.skip(skip);
    const products = await query_builder;
    return products.map(this.toProduct);
  }

  async getProductsCount(filters: any, search?: string): Promise<number> {
    await this.ensureConnection();
    const query: any = {};

    // Apply filters
    if (filters.category) {
      query.category = filters.category;
    }
    if (filters.subcategory) {
      query.subcategory = filters.subcategory;
    }
    if (filters.inStock !== undefined) {
      query.inStock = filters.inStock;
    }

    // Add search criteria
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { casNumber: { $regex: search, $options: "i" } },
        { hsCode: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    return await ProductModel.countDocuments(query);
  }

  async createProduct(
    productData: Omit<Product, "id" | "createdAt" | "updatedAt">,
  ): Promise<Product> {
    await this.ensureConnection();
    const product = await ProductModel.create(productData);
    return this.toProduct(product);
  }

  async updateProduct(
    id: string,
    updates: Partial<Product>,
  ): Promise<Product | null> {
    await this.ensureConnection();
    const product = await ProductModel.findByIdAndUpdate(id, updates, {
      new: true,
    });
    return product ? this.toProduct(product) : null;
  }

  async deleteProduct(id: string): Promise<boolean> {
    await this.ensureConnection();
    const result = await ProductModel.findByIdAndDelete(id);
    return !!result;
  }

  // Categories
  async getAllCategories(): Promise<Category[]> {
    await this.ensureConnection();
    const categories = await CategoryModel.find();
    return categories.map(this.toCategory);
  }

  async getCategoryById(id: string): Promise<Category | null> {
    await this.ensureConnection();
    const category = await CategoryModel.findById(id);
    return category ? this.toCategory(category) : null;
  }

  async createCategory(categoryData: Omit<Category, "id">): Promise<Category> {
    await this.ensureConnection();
    const category = await CategoryModel.create(categoryData);
    return this.toCategory(category);
  }

  async updateCategory(
    id: string,
    updates: Partial<Category>,
  ): Promise<Category | null> {
    await this.ensureConnection();
    const category = await CategoryModel.findByIdAndUpdate(id, updates, {
      new: true,
    });
    return category ? this.toCategory(category) : null;
  }

  async deleteCategory(id: string): Promise<boolean> {
    await this.ensureConnection();
    const result = await CategoryModel.findByIdAndDelete(id);
    return !!result;
  }

  // Services
  async getAllServices(): Promise<Service[]> {
    await this.ensureConnection();
    const services = await ServiceModel.find().sort({ createdAt: -1 });
    return services.map(this.toService);
  }

  async getServiceById(id: string): Promise<Service | null> {
    await this.ensureConnection();
    const service = await ServiceModel.findById(id);
    return service ? this.toService(service) : null;
  }

  async getServiceBySlug(slug: string): Promise<Service | null> {
    await this.ensureConnection();
    const service = await ServiceModel.findOne({ slug });
    return service ? this.toService(service) : null;
  }

  async createService(
    serviceData: Omit<Service, "id" | "createdAt" | "updatedAt">,
  ): Promise<Service> {
    await this.ensureConnection();
    const service = await ServiceModel.create(serviceData);
    return this.toService(service);
  }

  async updateService(
    id: string,
    updates: Partial<Service>,
  ): Promise<Service | null> {
    await this.ensureConnection();
    const service = await ServiceModel.findByIdAndUpdate(id, updates, {
      new: true,
    });
    return service ? this.toService(service) : null;
  }

  async deleteService(id: string): Promise<boolean> {
    await this.ensureConnection();
    const result = await ServiceModel.findByIdAndDelete(id);
    return !!result;
  }

  // Enquiries
  async createEnquiry(
    enquiryData: Omit<Enquiry, "id" | "createdAt" | "updatedAt">,
  ): Promise<Enquiry> {
    await this.ensureConnection();
    const enquiry = await EnquiryModel.create(enquiryData);
    return this.toEnquiry(enquiry);
  }

  async getAllEnquiries(): Promise<Enquiry[]> {
    await this.ensureConnection();
    const enquiries = await EnquiryModel.find().sort({ createdAt: -1 });
    return enquiries.map(this.toEnquiry);
  }

  async getEnquiryById(id: string): Promise<Enquiry | null> {
    await this.ensureConnection();
    const enquiry = await EnquiryModel.findById(id);
    return enquiry ? this.toEnquiry(enquiry) : null;
  }

  async updateEnquiryStatus(
    id: string,
    status: "pending" | "contacted" | "resolved",
  ): Promise<Enquiry | null> {
    await this.ensureConnection();
    const enquiry = await EnquiryModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    return enquiry ? this.toEnquiry(enquiry) : null;
  }

  async updateLead(id: string, data: Partial<Enquiry>): Promise<Enquiry | null> {
    await this.ensureConnection();
    const enquiry = await EnquiryModel.findByIdAndUpdate(id, data, { new: true });
    return enquiry ? this.toEnquiry(enquiry) : null;
  }

  async getLeadActivities(_leadId: string) {
    return [];
  }

  async addLeadActivity(
    leadId: string,
    activity: Omit<import("@/types").LeadActivity, "id" | "leadId" | "createdAt">,
  ) {
    return {
      id: "local",
      leadId,
      activityType: activity.activityType,
      content: activity.content,
      createdBy: activity.createdBy,
      createdAt: new Date(),
    };
  }

  async deleteEnquiry(id: string): Promise<boolean> {
    await this.ensureConnection();
    const result = await EnquiryModel.findByIdAndDelete(id);
    return !!result;
  }

  // CMS Content Management with fallbacks
  async getHomePageContent(): Promise<HomePageContent> {
    await this.ensureConnection();

    let content = await ContentModel.findOne({ type: "home" });

    // ✅ Auto-create document if missing
    if (!content) {
      content = await ContentModel.create({
        type: "home",
        data: {
          hero: {
            title: "Welcome to your site",
            subtitle: "Customize this content from the admin panel",
            backgroundImage: "/images/hero-bg.jpg",
          },
          about: {
            title: "About Us",
            content:
              "Leading pharmaceutical company providing high-quality ingredients.",
          },
          services: {
            title: "Our Services",
            items: [],
          },
          updatedAt: new Date(),
        },
      });
    }

    return content.data as HomePageContent;
  }

  async updateHomePageContent(
    updates: Partial<HomePageContent>,
  ): Promise<HomePageContent> {
    await this.ensureConnection();

    const content = await ContentModel.findOneAndUpdate(
      { type: "home" },
      {
        $set: {
          data: {
            ...updates,
            updatedAt: new Date(),
          },
        },
      },
      {
        upsert: true,
        new: true,
      },
    );

    return content!.data as HomePageContent;
  }

  async getAboutPageContent(): Promise<AboutPageContent> {
    try {
      await this.ensureConnection();
      const content = await ContentModel.findOne({ type: "about" });
      if (!content) {
        console.log("⚠️ About page content not found, using defaults");
        return {
          title: "About us",
          content: "Default about content",
          updatedAt: new Date(),
        };
      }
      return content.data as AboutPageContent;
    } catch (error) {
      console.error("❌ Error fetching about content:", error);
      return {
        title: "About us",
        content: "Loading...",
        updatedAt: new Date(),
      };
    }
  }

  async updateAboutPageContent(
    updates: Partial<AboutPageContent>,
  ): Promise<AboutPageContent> {
    await this.ensureConnection();
    
    const content = await ContentModel.findOneAndUpdate(
      { type: "about" },
      {
        $set: {
          data: {
            ...updates,
            updatedAt: new Date(),
          },
        },
      },
      {
        upsert: true,
        new: true,
      },
    );
    
    return content!.data as AboutPageContent;
  }

  async getContactPageContent(): Promise<ContactPageContent> {
    try {
      await this.ensureConnection();
      const content = await ContentModel.findOne({ type: "contact" });
      if (!content) {
        console.log("⚠️ Contact page content not found, using defaults");
        return {
          title: "Contact Us",
          content: "Get in touch with us",
          updatedAt: new Date(),
        };
      }
      return content.data as ContactPageContent;
    } catch (error) {
      console.error("❌ Error fetching contact content:", error);
      return {
        title: "Contact Us",
        content: "Loading...",
        updatedAt: new Date(),
      };
    }
  }

  async updateContactPageContent(
    updates: Partial<ContactPageContent>,
  ): Promise<ContactPageContent> {
    await this.ensureConnection();
    
    const content = await ContentModel.findOneAndUpdate(
      { type: "contact" },
      {
        $set: {
          data: {
            ...updates,
            updatedAt: new Date(),
          },
        },
      },
      {
        upsert: true,
        new: true,
      },
    );
    
    return content!.data as ContactPageContent;
  }

  async getFooterContent(): Promise<FooterContent> {
    await this.ensureConnection();

    let content = await ContentModel.findOne({ type: "footer" });

    // Auto-create if missing
    if (!content) {
      console.log("⚠️ Footer not found. Creating default footer...");

      content = await ContentModel.create({
        type: "footer",
        data: {
          company: "My Company",
          description: "",
          links: [],
          social: [],
        },
      });
    }

    return content.data as FooterContent;
  }

  async updateFooterContent(data: any) {
    await this.ensureConnection();

    return ContentModel.findOneAndUpdate(
      { type: "footer" },
      { $set: { data } },
      {
        new: true,
        upsert: true, // 👈 Critical
      },
    );
  }

  // Gallery methods
  private toGalleryItem(doc: any): GalleryItem {
    return {
      id: doc._id.toString(),
      name: doc.name,
      image: doc.image,
      category: doc.category,
      order: doc.order || 0,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async getAllGalleryItems(): Promise<GalleryItem[]> {
    await this.ensureConnection();
    const items = await GalleryModel.find().sort({ order: 1, createdAt: -1 });
    return items.map(this.toGalleryItem);
  }

  async getGalleryItemById(id: string): Promise<GalleryItem | null> {
    await this.ensureConnection();
    const item = await GalleryModel.findById(id);
    return item ? this.toGalleryItem(item) : null;
  }

  async createGalleryItem(
    itemData: Omit<GalleryItem, "id" | "createdAt" | "updatedAt">,
  ): Promise<GalleryItem> {
    await this.ensureConnection();
    const item = await GalleryModel.create(itemData);
    return this.toGalleryItem(item);
  }

  async updateGalleryItem(
    id: string,
    updates: Partial<GalleryItem>,
  ): Promise<GalleryItem | null> {
    await this.ensureConnection();
    const item = await GalleryModel.findByIdAndUpdate(id, updates, { new: true });
    return item ? this.toGalleryItem(item) : null;
  }

  async deleteGalleryItem(id: string): Promise<boolean> {
    await this.ensureConnection();
    const result = await GalleryModel.findByIdAndDelete(id);
    return !!result;
  }

  // Client methods
  private toClient(doc: any): Client {
    return {
      id: doc._id.toString(),
      name: doc.name,
      logo: doc.logo,
      website: doc.website,
      order: doc.order || 0,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async getAllClients(): Promise<Client[]> {
    await this.ensureConnection();
    const clients = await ClientModel.find().sort({ order: 1, createdAt: -1 });
    return clients.map(this.toClient);
  }

  async getClientById(id: string): Promise<Client | null> {
    await this.ensureConnection();
    const client = await ClientModel.findById(id);
    return client ? this.toClient(client) : null;
  }

  async createClient(
    clientData: Omit<Client, "id" | "createdAt" | "updatedAt">,
  ): Promise<Client> {
    await this.ensureConnection();
    const client = await ClientModel.create(clientData);
    return this.toClient(client);
  }

  async updateClient(
    id: string,
    updates: Partial<Client>,
  ): Promise<Client | null> {
    await this.ensureConnection();
    const client = await ClientModel.findByIdAndUpdate(id, updates, { new: true });
    return client ? this.toClient(client) : null;
  }

  async deleteClient(id: string): Promise<boolean> {
    await this.ensureConnection();
    const result = await ClientModel.findByIdAndDelete(id);
    return !!result;
  }

  // Testimonial methods
  private toTestimonial(doc: any): Testimonial {
    return {
      id: doc._id.toString(),
      name: doc.name,
      title: doc.title,
      company: doc.company,
      content: doc.content,
      image: doc.image,
      rating: doc.rating,
      featured: doc.featured || false,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async getAllTestimonials(): Promise<Testimonial[]> {
    await this.ensureConnection();
    const testimonials = await TestimonialModel.find().sort({ featured: -1, createdAt: -1 });
    return testimonials.map(this.toTestimonial);
  }

  async getTestimonialById(id: string): Promise<Testimonial | null> {
    await this.ensureConnection();
    const testimonial = await TestimonialModel.findById(id);
    return testimonial ? this.toTestimonial(testimonial) : null;
  }

  async createTestimonial(
    testimonialData: Omit<Testimonial, "id" | "createdAt" | "updatedAt">,
  ): Promise<Testimonial> {
    await this.ensureConnection();
    const testimonial = await TestimonialModel.create(testimonialData);
    return this.toTestimonial(testimonial);
  }

  async updateTestimonial(
    id: string,
    updates: Partial<Testimonial>,
  ): Promise<Testimonial | null> {
    await this.ensureConnection();
    const testimonial = await TestimonialModel.findByIdAndUpdate(id, updates, { new: true });
    return testimonial ? this.toTestimonial(testimonial) : null;
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    await this.ensureConnection();
    const result = await TestimonialModel.findByIdAndDelete(id);
    return !!result;
  }

  // Settings
  async getSettings(): Promise<Settings | null> {
    await this.ensureConnection();
    const settings = await SettingsModel.findOne();
    if (!settings) {
      // Create default settings if none exist
      const defaultSettings = await SettingsModel.create({});
      return this.toSettings(defaultSettings);
    }
    return this.toSettings(settings);
  }

  private toSettings(doc: any): Settings {
    return {
      id: doc._id.toString(),
      seo: doc.seo,
      pageHeroes: doc.pageHeroes,
      branding: doc.branding,
      company: doc.company,
      updatedAt: doc.updatedAt,
    };
  }

  async updateSettings(
    data: Partial<Omit<Settings, "id" | "updatedAt">>,
  ): Promise<Settings> {
    await this.ensureConnection();
    let settings = await SettingsModel.findOne();
    if (!settings) {
      settings = await SettingsModel.create(data);
    } else {
      Object.assign(settings, data);
      await settings.save();
    }
    return this.toSettings(settings);
  }
}

export { MongoDBRepository };
