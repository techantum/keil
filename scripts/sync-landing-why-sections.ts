import { readFile } from "fs/promises";
import path from "path";
import {
  updateLandingPage,
  getLandingPageBySlug,
} from "../lib/landing-pages/store";

async function main() {
  const raw = await readFile(
    path.join(process.cwd(), "data/landing-pages.json"),
    "utf8",
  );
  const pages = JSON.parse(raw);
  const filePage = pages.find((p: { slug: string }) => p.slug === "keil-ec-sheds");
  if (!filePage) throw new Error("keil-ec-sheds not in JSON");

  const existing = await getLandingPageBySlug("keil-ec-sheds");
  if (!existing) {
    console.log("No page found via store; JSON file already updated.");
    return;
  }

  const updated = await updateLandingPage(existing.id, {
    sections: filePage.sections,
    title: filePage.title,
    status: filePage.status,
    designImage: filePage.designImage,
    seo: filePage.seo,
    branding: filePage.branding,
    redirect: filePage.redirect,
  });

  const features = updated?.sections?.find((s) => s.type === "features");
  const leaders = updated?.sections?.find((s) => s.type === "leaders");
  console.log(
    JSON.stringify(
      {
        id: updated?.id,
        featuresTitle: features?.title?.slice(0, 60),
        promiseItems: features?.promiseItems,
        leadersCount: leaders?.items?.length ?? 0,
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
