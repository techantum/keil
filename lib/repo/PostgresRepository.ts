import type { IDataRepository } from "./IDataRepository";
import type {
  Product,
  ProductDetailItem,
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
import {
  defaultAboutPageContent,
  defaultContactPageContent,
  defaultFooterContent,
  defaultHomePageContent,
} from "@/lib/content/default-content";
import { query } from "@/lib/db/postgres";
import {
  getSettingsDocument,
  updateSettingsDocument,
} from "@/lib/db/settings-service";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  category_id: string | null;
  subcategory: string | null;
  image: string | null;
  details_section_title: string | null;
  details: ProductDetailItem[] | null;
  product_type: string | null;
  capacity: string | null;
  screen_dimension: string | null;
  number_of_decks: string | null;
  motor_power: string | null;
  gyratory_circular: string | null;
  special_features: string | null;
  availability: string | null;
  in_stock: boolean | null;
  featured: boolean;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[];
  created_at: Date;
  updated_at: Date;
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string | null;
  image: string | null;
  created_at: Date;
  updated_at: Date;
};

type ServiceRow = {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  features: string[];
  featured: boolean;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[];
  created_at: Date;
  updated_at: Date;
};

type LeadRow = {
  id: string;
  type: Enquiry["type"];
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  product_name: string | null;
  product_category: string | null;
  selected_product_id: string | null;
  message: string | null;
  status: Enquiry["status"];
  stage: Enquiry["stage"];
  priority: Enquiry["priority"];
  assigned_to: string | null;
  source: string | null;
  follow_up_at: Date | null;
  tags: string[];
  created_at: Date;
  updated_at: Date;
};

type GalleryRow = {
  id: string;
  name: string;
  image: string;
  category: string | null;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
};

type ClientRow = {
  id: string;
  name: string;
  logo: string;
  website: string | null;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
};

type TestimonialRow = {
  id: string;
  name: string;
  title: string;
  company: string;
  content: string;
  image: string | null;
  rating: number | null;
  featured: boolean;
  created_at: Date;
  updated_at: Date;
};

class PostgresRepository implements IDataRepository {
  private toProduct(row: ProductRow): Product {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description ?? "",
      category: row.category ?? "",
      categoryId: row.category_id ?? undefined,
      image: row.image ?? undefined,
      detailsSectionTitle: row.details_section_title ?? undefined,
      details: row.details?.length ? row.details : undefined,
      productType: row.product_type ?? undefined,
      capacity: row.capacity ?? undefined,
      screenDimension: row.screen_dimension ?? undefined,
      numberOfDecks: row.number_of_decks ?? undefined,
      motorPower: row.motor_power ?? undefined,
      gyratoryCircular: row.gyratory_circular ?? undefined,
      specialFeatures: row.special_features ?? undefined,
      availability: row.availability ?? undefined,
      featured: row.featured,
      metaTitle: row.meta_title ?? undefined,
      metaDescription: row.meta_description ?? undefined,
      metaKeywords: row.meta_keywords ?? [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private toCategory(row: CategoryRow): Category {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      icon: row.icon ?? undefined,
      image: row.image ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private toService(row: ServiceRow): Service {
    return {
      id: row.id,
      title: row.title,
      subtitle: row.subtitle,
      slug: row.slug,
      description: row.description,
      icon: row.icon,
      image: row.image,
      features: row.features ?? [],
      featured: row.featured,
      metaTitle: row.meta_title ?? undefined,
      metaDescription: row.meta_description ?? undefined,
      metaKeywords: row.meta_keywords ?? [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private toEnquiry(row: LeadRow): Enquiry {
    return {
      id: row.id,
      type: row.type,
      name: row.name,
      email: row.email,
      phone: row.phone ?? undefined,
      company: row.company ?? undefined,
      productName: row.product_name ?? undefined,
      productCategory: row.product_category ?? undefined,
      selectedProductId: row.selected_product_id ?? undefined,
      message: row.message ?? undefined,
      status: row.status,
      stage: row.stage ?? "new",
      priority: row.priority ?? "medium",
      assignedTo: row.assigned_to ?? undefined,
      source: row.source ?? undefined,
      followUpAt: row.follow_up_at ?? undefined,
      tags: row.tags ?? [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private toGalleryItem(row: GalleryRow): GalleryItem {
    return {
      id: row.id,
      name: row.name,
      image: row.image,
      category: row.category ?? undefined,
      order: row.sort_order,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private toClient(row: ClientRow): Client {
    return {
      id: row.id,
      name: row.name,
      logo: row.logo,
      website: row.website ?? undefined,
      order: row.sort_order,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private toTestimonial(row: TestimonialRow): Testimonial {
    return {
      id: row.id,
      name: row.name,
      title: row.title,
      company: row.company,
      content: row.content,
      image: row.image ?? undefined,
      rating: row.rating ?? undefined,
      featured: row.featured,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // Products
  async getAllProducts(): Promise<Product[]> {
    const result = await query<ProductRow>(
      "SELECT * FROM products ORDER BY created_at DESC",
    );
    return result.rows.map((row) => this.toProduct(row));
  }

  async getProductById(id: string): Promise<Product | null> {
    const result = await query<ProductRow>(
      "SELECT * FROM products WHERE id = $1",
      [id],
    );
    return result.rows[0] ? this.toProduct(result.rows[0]) : null;
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    const result = await query<ProductRow>(
      "SELECT * FROM products WHERE slug = $1",
      [slug],
    );
    return result.rows[0] ? this.toProduct(result.rows[0]) : null;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const result = await query<ProductRow>(
      "SELECT * FROM products WHERE category = $1 ORDER BY created_at DESC",
      [category],
    );
    return result.rows.map((row) => this.toProduct(row));
  }

  async searchProducts(searchQuery: string): Promise<Product[]> {
    const pattern = `%${searchQuery}%`;
    const result = await query<ProductRow>(
      `SELECT * FROM products
       WHERE name ILIKE $1 OR description ILIKE $1
       ORDER BY created_at DESC`,
      [pattern],
    );
    return result.rows.map((row) => this.toProduct(row));
  }

  async getFilteredProducts(
    filters: Record<string, unknown>,
    search?: string,
    sort?: string,
    limit?: number,
    skip?: number,
  ): Promise<Product[]> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (filters.category) {
      conditions.push(`category = $${paramIndex++}`);
      params.push(filters.category);
    }
    if (filters.subcategory) {
      conditions.push(`subcategory = $${paramIndex++}`);
      params.push(filters.subcategory);
    }
    if (filters.inStock !== undefined) {
      conditions.push(`in_stock = $${paramIndex++}`);
      params.push(filters.inStock);
    }
    if (search) {
      conditions.push(
        `(name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`,
      );
      params.push(`%${search}%`);
      paramIndex++;
    }

    let orderBy = "created_at DESC";
    if (sort === "name") orderBy = "name ASC";
    else if (sort === "name-desc") orderBy = "name DESC";
    else if (sort === "oldest") orderBy = "created_at ASC";

    const where =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    let sql = `SELECT * FROM products ${where} ORDER BY ${orderBy}`;

    if (limit) {
      sql += ` LIMIT $${paramIndex++}`;
      params.push(limit);
    }
    if (skip) {
      sql += ` OFFSET $${paramIndex++}`;
      params.push(skip);
    }

    const result = await query<ProductRow>(sql, params);
    return result.rows.map((row) => this.toProduct(row));
  }

  async getProductsCount(
    filters: Record<string, unknown>,
    search?: string,
  ): Promise<number> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (filters.category) {
      conditions.push(`category = $${paramIndex++}`);
      params.push(filters.category);
    }
    if (filters.subcategory) {
      conditions.push(`subcategory = $${paramIndex++}`);
      params.push(filters.subcategory);
    }
    if (filters.inStock !== undefined) {
      conditions.push(`in_stock = $${paramIndex++}`);
      params.push(filters.inStock);
    }
    if (search) {
      conditions.push(
        `(name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`,
      );
      params.push(`%${search}%`);
    }

    const where =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const result = await query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM products ${where}`,
      params,
    );
    return parseInt(result.rows[0]?.count ?? "0", 10);
  }

  async createProduct(
    productData: Omit<Product, "id" | "createdAt" | "updatedAt">,
  ): Promise<Product> {
    const result = await query<ProductRow>(
      `INSERT INTO products (
        name, slug, description, category, category_id, subcategory, image,
        details_section_title, details,
        product_type, capacity, screen_dimension, number_of_decks, motor_power,
        gyratory_circular, special_features, availability, in_stock, featured,
        meta_title, meta_description, meta_keywords
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22
      ) RETURNING *`,
      [
        productData.name,
        productData.slug,
        productData.description,
        productData.category,
        productData.categoryId ?? null,
        null,
        productData.image ?? null,
        productData.detailsSectionTitle ?? null,
        JSON.stringify(productData.details ?? []),
        productData.productType ?? null,
        productData.capacity ?? null,
        productData.screenDimension ?? null,
        productData.numberOfDecks ?? null,
        productData.motorPower ?? null,
        productData.gyratoryCircular ?? null,
        productData.specialFeatures ?? null,
        productData.availability ?? "In Stock",
        null,
        productData.featured ?? false,
        productData.metaTitle ?? null,
        productData.metaDescription ?? null,
        productData.metaKeywords ?? [],
      ],
    );
    return this.toProduct(result.rows[0]);
  }

  async updateProduct(
    id: string,
    updates: Partial<Product>,
  ): Promise<Product | null> {
    const current = await this.getProductById(id);
    if (!current) return null;

    const merged = { ...current, ...updates };
    const result = await query<ProductRow>(
      `UPDATE products SET
        name = $1, slug = $2, description = $3, category = $4, category_id = $5,
        image = $6, details_section_title = $7, details = $8,
        product_type = $9, capacity = $10, screen_dimension = $11,
        number_of_decks = $12, motor_power = $13, gyratory_circular = $14,
        special_features = $15, availability = $16, featured = $17,
        meta_title = $18, meta_description = $19, meta_keywords = $20,
        updated_at = NOW()
       WHERE id = $21 RETURNING *`,
      [
        merged.name,
        merged.slug,
        merged.description,
        merged.category,
        merged.categoryId ?? null,
        merged.image ?? null,
        merged.detailsSectionTitle ?? null,
        JSON.stringify(merged.details ?? []),
        merged.productType ?? null,
        merged.capacity ?? null,
        merged.screenDimension ?? null,
        merged.numberOfDecks ?? null,
        merged.motorPower ?? null,
        merged.gyratoryCircular ?? null,
        merged.specialFeatures ?? null,
        merged.availability ?? null,
        merged.featured ?? false,
        merged.metaTitle ?? null,
        merged.metaDescription ?? null,
        merged.metaKeywords ?? [],
        id,
      ],
    );
    return result.rows[0] ? this.toProduct(result.rows[0]) : null;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await query("DELETE FROM products WHERE id = $1", [id]);
    return (result.rowCount ?? 0) > 0;
  }

  // Categories
  async getAllCategories(): Promise<Category[]> {
    const result = await query<CategoryRow>("SELECT * FROM categories");
    return result.rows.map((row) => this.toCategory(row));
  }

  async getCategoryById(id: string): Promise<Category | null> {
    const result = await query<CategoryRow>(
      "SELECT * FROM categories WHERE id = $1",
      [id],
    );
    return result.rows[0] ? this.toCategory(result.rows[0]) : null;
  }

  async createCategory(
    categoryData: Omit<Category, "id">,
  ): Promise<Category> {
    const result = await query<CategoryRow>(
      `INSERT INTO categories (name, slug, description, icon, image)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        categoryData.name,
        categoryData.slug,
        categoryData.description,
        categoryData.icon ?? null,
        categoryData.image ?? null,
      ],
    );
    return this.toCategory(result.rows[0]);
  }

  async updateCategory(
    id: string,
    updates: Partial<Category>,
  ): Promise<Category | null> {
    const current = await this.getCategoryById(id);
    if (!current) return null;
    const merged = { ...current, ...updates };
    const result = await query<CategoryRow>(
      `UPDATE categories SET name = $1, slug = $2, description = $3, icon = $4, image = $5, updated_at = NOW()
       WHERE id = $6 RETURNING *`,
      [
        merged.name,
        merged.slug,
        merged.description,
        merged.icon ?? null,
        merged.image ?? null,
        id,
      ],
    );
    return result.rows[0] ? this.toCategory(result.rows[0]) : null;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await query("DELETE FROM categories WHERE id = $1", [id]);
    return (result.rowCount ?? 0) > 0;
  }

  // Services
  async getAllServices(): Promise<Service[]> {
    const result = await query<ServiceRow>(
      "SELECT * FROM services ORDER BY created_at DESC",
    );
    return result.rows.map((row) => this.toService(row));
  }

  async getServiceById(id: string): Promise<Service | null> {
    const result = await query<ServiceRow>(
      "SELECT * FROM services WHERE id = $1",
      [id],
    );
    return result.rows[0] ? this.toService(result.rows[0]) : null;
  }

  async getServiceBySlug(slug: string): Promise<Service | null> {
    const result = await query<ServiceRow>(
      "SELECT * FROM services WHERE slug = $1",
      [slug],
    );
    return result.rows[0] ? this.toService(result.rows[0]) : null;
  }

  async createService(
    serviceData: Omit<Service, "id" | "createdAt" | "updatedAt">,
  ): Promise<Service> {
    const result = await query<ServiceRow>(
      `INSERT INTO services (title, subtitle, slug, description, icon, image, features, featured, meta_title, meta_description, meta_keywords)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        serviceData.title,
        serviceData.subtitle,
        serviceData.slug,
        serviceData.description,
        serviceData.icon,
        serviceData.image,
        serviceData.features ?? [],
        serviceData.featured ?? false,
        serviceData.metaTitle ?? null,
        serviceData.metaDescription ?? null,
        serviceData.metaKeywords ?? [],
      ],
    );
    return this.toService(result.rows[0]);
  }

  async updateService(
    id: string,
    updates: Partial<Service>,
  ): Promise<Service | null> {
    const current = await this.getServiceById(id);
    if (!current) return null;
    const merged = { ...current, ...updates };
    const result = await query<ServiceRow>(
      `UPDATE services SET title = $1, subtitle = $2, slug = $3, description = $4, icon = $5, image = $6,
        features = $7, featured = $8, meta_title = $9, meta_description = $10, meta_keywords = $11, updated_at = NOW()
       WHERE id = $12 RETURNING *`,
      [
        merged.title,
        merged.subtitle,
        merged.slug,
        merged.description,
        merged.icon,
        merged.image,
        merged.features ?? [],
        merged.featured ?? false,
        merged.metaTitle ?? null,
        merged.metaDescription ?? null,
        merged.metaKeywords ?? [],
        id,
      ],
    );
    return result.rows[0] ? this.toService(result.rows[0]) : null;
  }

  async deleteService(id: string): Promise<boolean> {
    const result = await query("DELETE FROM services WHERE id = $1", [id]);
    return (result.rowCount ?? 0) > 0;
  }

  // Enquiries / Leads
  async createEnquiry(
    enquiryData: Omit<Enquiry, "id" | "createdAt" | "updatedAt">,
  ): Promise<Enquiry> {
    const result = await query<LeadRow>(
      `INSERT INTO leads (type, name, email, phone, company, product_name, product_category, selected_product_id, message, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        enquiryData.type,
        enquiryData.name,
        enquiryData.email,
        enquiryData.phone ?? null,
        enquiryData.company ?? null,
        enquiryData.productName ?? null,
        enquiryData.productCategory ?? null,
        enquiryData.selectedProductId ?? null,
        enquiryData.message ?? null,
        enquiryData.status ?? "pending",
      ],
    );
    return this.toEnquiry(result.rows[0]);
  }

  async getAllEnquiries(): Promise<Enquiry[]> {
    const result = await query<LeadRow>(
      "SELECT * FROM leads ORDER BY created_at DESC",
    );
    return result.rows.map((row) => this.toEnquiry(row));
  }

  async getEnquiryById(id: string): Promise<Enquiry | null> {
    const result = await query<LeadRow>("SELECT * FROM leads WHERE id = $1", [
      id,
    ]);
    return result.rows[0] ? this.toEnquiry(result.rows[0]) : null;
  }

  async updateEnquiryStatus(
    id: string,
    status: "pending" | "contacted" | "resolved",
  ): Promise<Enquiry | null> {
    const result = await query<LeadRow>(
      "UPDATE leads SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [status, id],
    );
    if (result.rows[0]) {
      await this.addLeadActivity(id, {
        activityType: "status_change",
        content: `Status changed to ${status}`,
      });
    }
    return result.rows[0] ? this.toEnquiry(result.rows[0]) : null;
  }

  async updateLead(id: string, data: Partial<Enquiry>): Promise<Enquiry | null> {
    const current = await this.getEnquiryById(id);
    if (!current) return null;
    const merged = { ...current, ...data };
    const result = await query<LeadRow>(
      `UPDATE leads SET
        status = $1, stage = $2, priority = $3, assigned_to = $4, source = $5,
        follow_up_at = $6, tags = $7, updated_at = NOW()
       WHERE id = $8 RETURNING *`,
      [
        merged.status,
        merged.stage ?? "new",
        merged.priority ?? "medium",
        merged.assignedTo ?? null,
        merged.source ?? null,
        merged.followUpAt ?? null,
        merged.tags ?? [],
        id,
      ],
    );
    return result.rows[0] ? this.toEnquiry(result.rows[0]) : null;
  }

  async getLeadActivities(leadId: string) {
    const result = await query<{
      id: string;
      lead_id: string;
      activity_type: string;
      content: string;
      created_by: string | null;
      created_at: Date;
    }>(
      "SELECT * FROM lead_activities WHERE lead_id = $1 ORDER BY created_at DESC",
      [leadId],
    );
    return result.rows.map((row) => ({
      id: row.id,
      leadId: row.lead_id,
      activityType: row.activity_type as import("@/types").LeadActivity["activityType"],
      content: row.content,
      createdBy: row.created_by ?? undefined,
      createdAt: row.created_at,
    }));
  }

  async addLeadActivity(
    leadId: string,
    activity: Omit<import("@/types").LeadActivity, "id" | "leadId" | "createdAt">,
  ) {
    const result = await query<{
      id: string;
      lead_id: string;
      activity_type: string;
      content: string;
      created_by: string | null;
      created_at: Date;
    }>(
      `INSERT INTO lead_activities (lead_id, activity_type, content, created_by)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [leadId, activity.activityType, activity.content, activity.createdBy ?? null],
    );
    const row = result.rows[0];
    return {
      id: row.id,
      leadId: row.lead_id,
      activityType: row.activity_type as import("@/types").LeadActivity["activityType"],
      content: row.content,
      createdBy: row.created_by ?? undefined,
      createdAt: row.created_at,
    };
  }

  async deleteEnquiry(id: string): Promise<boolean> {
    const result = await query("DELETE FROM leads WHERE id = $1", [id]);
    return (result.rowCount ?? 0) > 0;
  }

  // Content blocks
  private async getContentBlock<T>(type: string, fallback: T): Promise<T> {
    const result = await query<{ data: T }>(
      "SELECT data FROM content_blocks WHERE type = $1",
      [type],
    );
    if (result.rows[0]?.data) {
      return result.rows[0].data;
    }

    await query(
      `INSERT INTO content_blocks (type, data) VALUES ($1, $2::jsonb)
       ON CONFLICT (type) DO NOTHING`,
      [type, JSON.stringify(fallback)],
    );
    return fallback;
  }

  private async upsertContentBlock<T>(
    type: string,
    data: T,
  ): Promise<T> {
    const payload = { ...data, updatedAt: new Date() };
    const result = await query<{ data: T }>(
      `INSERT INTO content_blocks (type, data) VALUES ($1, $2::jsonb)
       ON CONFLICT (type) DO UPDATE SET data = $2::jsonb, updated_at = NOW()
       RETURNING data`,
      [type, JSON.stringify(payload)],
    );
    return result.rows[0].data;
  }

  async getHomePageContent(): Promise<HomePageContent> {
    return this.getContentBlock<HomePageContent>("home", defaultHomePageContent());
  }

  async updateHomePageContent(
    updates: Partial<HomePageContent>,
  ): Promise<HomePageContent> {
    const current = await this.getHomePageContent();
    return this.upsertContentBlock("home", { ...current, ...updates });
  }

  async getAboutPageContent(): Promise<AboutPageContent> {
    return this.getContentBlock<AboutPageContent>("about", defaultAboutPageContent());
  }

  async updateAboutPageContent(
    updates: Partial<AboutPageContent>,
  ): Promise<AboutPageContent> {
    const current = await this.getAboutPageContent();
    return this.upsertContentBlock("about", { ...current, ...updates });
  }

  async getContactPageContent(): Promise<ContactPageContent> {
    return this.getContentBlock<ContactPageContent>("contact", defaultContactPageContent());
  }

  async updateContactPageContent(
    updates: Partial<ContactPageContent>,
  ): Promise<ContactPageContent> {
    const current = await this.getContactPageContent();
    return this.upsertContentBlock("contact", { ...current, ...updates });
  }

  async getFooterContent(): Promise<FooterContent> {
    return this.getContentBlock<FooterContent>("footer", defaultFooterContent());
  }

  async updateFooterContent(
    updates: Partial<FooterContent>,
  ): Promise<FooterContent> {
    const current = await this.getFooterContent();
    return this.upsertContentBlock("footer", { ...current, ...updates });
  }

  // Gallery
  async getAllGalleryItems(): Promise<GalleryItem[]> {
    const result = await query<GalleryRow>(
      "SELECT * FROM gallery_items ORDER BY sort_order ASC, created_at DESC",
    );
    return result.rows.map((row) => this.toGalleryItem(row));
  }

  async getGalleryItemById(id: string): Promise<GalleryItem | null> {
    const result = await query<GalleryRow>(
      "SELECT * FROM gallery_items WHERE id = $1",
      [id],
    );
    return result.rows[0] ? this.toGalleryItem(result.rows[0]) : null;
  }

  async createGalleryItem(
    itemData: Omit<GalleryItem, "id" | "createdAt" | "updatedAt">,
  ): Promise<GalleryItem> {
    const result = await query<GalleryRow>(
      `INSERT INTO gallery_items (name, image, category, sort_order)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [itemData.name, itemData.image, itemData.category ?? null, itemData.order],
    );
    return this.toGalleryItem(result.rows[0]);
  }

  async updateGalleryItem(
    id: string,
    updates: Partial<GalleryItem>,
  ): Promise<GalleryItem | null> {
    const current = await this.getGalleryItemById(id);
    if (!current) return null;
    const merged = { ...current, ...updates };
    const result = await query<GalleryRow>(
      `UPDATE gallery_items SET name = $1, image = $2, category = $3, sort_order = $4, updated_at = NOW()
       WHERE id = $5 RETURNING *`,
      [merged.name, merged.image, merged.category ?? null, merged.order, id],
    );
    return result.rows[0] ? this.toGalleryItem(result.rows[0]) : null;
  }

  async deleteGalleryItem(id: string): Promise<boolean> {
    const result = await query("DELETE FROM gallery_items WHERE id = $1", [
      id,
    ]);
    return (result.rowCount ?? 0) > 0;
  }

  // Clients
  async getAllClients(): Promise<Client[]> {
    const result = await query<ClientRow>(
      "SELECT * FROM clients ORDER BY sort_order ASC, created_at DESC",
    );
    return result.rows.map((row) => this.toClient(row));
  }

  async getClientById(id: string): Promise<Client | null> {
    const result = await query<ClientRow>(
      "SELECT * FROM clients WHERE id = $1",
      [id],
    );
    return result.rows[0] ? this.toClient(result.rows[0]) : null;
  }

  async createClient(
    clientData: Omit<Client, "id" | "createdAt" | "updatedAt">,
  ): Promise<Client> {
    const result = await query<ClientRow>(
      `INSERT INTO clients (name, logo, website, sort_order)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [clientData.name, clientData.logo, clientData.website ?? null, clientData.order],
    );
    return this.toClient(result.rows[0]);
  }

  async updateClient(
    id: string,
    updates: Partial<Client>,
  ): Promise<Client | null> {
    const current = await this.getClientById(id);
    if (!current) return null;
    const merged = { ...current, ...updates };
    const result = await query<ClientRow>(
      `UPDATE clients SET name = $1, logo = $2, website = $3, sort_order = $4, updated_at = NOW()
       WHERE id = $5 RETURNING *`,
      [merged.name, merged.logo, merged.website ?? null, merged.order, id],
    );
    return result.rows[0] ? this.toClient(result.rows[0]) : null;
  }

  async deleteClient(id: string): Promise<boolean> {
    const result = await query("DELETE FROM clients WHERE id = $1", [id]);
    return (result.rowCount ?? 0) > 0;
  }

  // Testimonials
  async getAllTestimonials(): Promise<Testimonial[]> {
    const result = await query<TestimonialRow>(
      "SELECT * FROM testimonials ORDER BY featured DESC, created_at DESC",
    );
    return result.rows.map((row) => this.toTestimonial(row));
  }

  async getTestimonialById(id: string): Promise<Testimonial | null> {
    const result = await query<TestimonialRow>(
      "SELECT * FROM testimonials WHERE id = $1",
      [id],
    );
    return result.rows[0] ? this.toTestimonial(result.rows[0]) : null;
  }

  async createTestimonial(
    testimonialData: Omit<Testimonial, "id" | "createdAt" | "updatedAt">,
  ): Promise<Testimonial> {
    const result = await query<TestimonialRow>(
      `INSERT INTO testimonials (name, title, company, content, image, rating, featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        testimonialData.name,
        testimonialData.title,
        testimonialData.company,
        testimonialData.content,
        testimonialData.image ?? null,
        testimonialData.rating ?? null,
        testimonialData.featured ?? false,
      ],
    );
    return this.toTestimonial(result.rows[0]);
  }

  async updateTestimonial(
    id: string,
    updates: Partial<Testimonial>,
  ): Promise<Testimonial | null> {
    const current = await this.getTestimonialById(id);
    if (!current) return null;
    const merged = { ...current, ...updates };
    const result = await query<TestimonialRow>(
      `UPDATE testimonials SET name = $1, title = $2, company = $3, content = $4, image = $5, rating = $6, featured = $7, updated_at = NOW()
       WHERE id = $8 RETURNING *`,
      [
        merged.name,
        merged.title,
        merged.company,
        merged.content,
        merged.image ?? null,
        merged.rating ?? null,
        merged.featured ?? false,
        id,
      ],
    );
    return result.rows[0] ? this.toTestimonial(result.rows[0]) : null;
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    const result = await query("DELETE FROM testimonials WHERE id = $1", [id]);
    return (result.rowCount ?? 0) > 0;
  }

  // Settings
  async getSettings(): Promise<Settings | null> {
    return getSettingsDocument();
  }

  async updateSettings(
    data: Partial<Omit<Settings, "id" | "updatedAt">>,
  ): Promise<Settings> {
    return updateSettingsDocument(data);
  }
}

export { PostgresRepository };
