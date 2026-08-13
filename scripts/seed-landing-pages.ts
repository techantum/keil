/**
 * Seed / upsert landing pages from data/landing-pages.json into Postgres (or file store).
 * Usage: npx tsx scripts/seed-landing-pages.ts
 */
import { readFile } from "fs/promises";
import path from "path";
import {
  createLandingPage,
  getLandingPageBySlug,
  updateLandingPage,
  listLandingPages,
} from "../lib/landing-pages/store";
import type { LandingPage } from "../types/landing-page";

async function main() {
  const raw = await readFile(
    path.join(process.cwd(), "data/landing-pages.json"),
    "utf8",
  );
  const pages = JSON.parse(raw) as LandingPage[];
  if (!pages.length) {
    console.log("No pages in data/landing-pages.json");
    return;
  }

  for (const filePage of pages) {
    const existing = await getLandingPageBySlug(filePage.slug);
    if (existing) {
      const updated = await updateLandingPage(existing.id, {
        title: filePage.title,
        status: filePage.status,
        designImage: filePage.designImage,
        sections: filePage.sections,
        seo: filePage.seo,
        branding: filePage.branding,
        redirect: filePage.redirect,
      });
      console.log(`Updated: ${updated?.slug} (${updated?.id})`);
    } else {
      const created = await createLandingPage({
        title: filePage.title,
        slug: filePage.slug,
        designImage: filePage.designImage,
        sections: filePage.sections,
        seo: filePage.seo,
        branding: filePage.branding,
        status: filePage.status,
        redirect: filePage.redirect,
      });
      // Preserve published status / exact slug if create mutated
      if (created.slug !== filePage.slug || created.status !== filePage.status) {
        await updateLandingPage(created.id, {
          slug: filePage.slug,
          status: filePage.status,
        });
      }
      console.log(`Created: ${created.slug} (${created.id})`);
    }
  }

  const all = await listLandingPages();
  console.log(
    JSON.stringify(
      {
        total: all.length,
        pages: all.map((p) => ({
          slug: p.slug,
          status: p.status,
          sections: p.sections.length,
        })),
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
