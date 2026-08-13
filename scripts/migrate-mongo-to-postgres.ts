/**
 * One-time migration: MongoDB → PostgreSQL
 * Requires MONGODB_URI and DATABASE_URL in .env
 */
import connectDB from "../lib/db/mongodb";
import { getPool } from "../lib/db/postgres";
import { SettingsModel } from "../lib/db/models/Settings";
import { ProductModel } from "../lib/db/models/Product";
import { CategoryModel } from "../lib/db/models/Category";
import { ServiceModel } from "../lib/db/models/Service";
import { EnquiryModel } from "../lib/db/models/Enquiry";
import { ContentModel } from "../lib/db/models/Content";
import { GalleryModel } from "../lib/db/models/Gallery";
import { ClientModel } from "../lib/db/models/Client";
import { TestimonialModel } from "../lib/db/models/Testimonial";

async function migrate() {
  console.log("Connecting to MongoDB...");
  await connectDB();
  const pool = getPool();

  console.log("Migrating settings...");
  const settings = await SettingsModel.findOne().lean();
  if (settings) {
    await pool.query(
      `INSERT INTO settings (seo, branding, company, page_heroes)
       VALUES ($1::jsonb, $2::jsonb, $3::jsonb, $4::jsonb)`,
      [
        JSON.stringify(settings.seo),
        JSON.stringify(settings.branding),
        JSON.stringify(settings.company),
        JSON.stringify(settings.pageHeroes),
      ],
    );
  }

  console.log("Migrating categories...");
  for (const cat of await CategoryModel.find().lean()) {
    await pool.query(
      `INSERT INTO categories (id, name, slug, description, icon, image, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT DO NOTHING`,
      [cat._id.toString(), cat.name, cat.slug, cat.description, cat.icon, cat.image, cat.createdAt, cat.updatedAt],
    );
  }

  console.log("Migrating products...");
  for (const p of await ProductModel.find().lean()) {
    await pool.query(
      `INSERT INTO products (id, name, slug, description, category, category_id, image, featured, meta_title, meta_description, meta_keywords, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) ON CONFLICT DO NOTHING`,
      [p._id.toString(), p.name, p.slug, p.description, p.category, p.categoryId, p.image, p.featured, p.metaTitle, p.metaDescription, p.metaKeywords || [], p.createdAt, p.updatedAt],
    );
  }

  console.log("Migrating services, gallery, clients, testimonials, leads, content...");
  for (const s of await ServiceModel.find().lean()) {
    await pool.query(
      `INSERT INTO services (id, title, subtitle, slug, description, icon, image, features, featured, meta_title, meta_description, meta_keywords, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) ON CONFLICT DO NOTHING`,
      [s._id.toString(), s.title, s.subtitle, s.slug, s.description, s.icon, s.image, s.features || [], s.featured, s.metaTitle, s.metaDescription, s.metaKeywords || [], s.createdAt, s.updatedAt],
    );
  }

  for (const e of await EnquiryModel.find().lean()) {
    await pool.query(
      `INSERT INTO leads (id, type, name, email, phone, company, product_name, product_category, message, status, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) ON CONFLICT DO NOTHING`,
      [e._id.toString(), e.type, e.name, e.email, e.phone, e.company, e.productName, e.productCategory, e.message, e.status, e.createdAt, e.updatedAt],
    );
  }

  for (const c of await ContentModel.find().lean()) {
    await pool.query(
      `INSERT INTO content_blocks (type, data) VALUES ($1, $2::jsonb) ON CONFLICT (type) DO UPDATE SET data = EXCLUDED.data`,
      [c.type, JSON.stringify(c.data)],
    );
  }

  console.log("Migration complete.");
  await pool.end();
  process.exit(0);
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
