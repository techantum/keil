import { cookies } from "next/headers";
import {
  LANDING_REDIRECTS_COOKIE,
  encodeRedirectsCookie,
} from "@/lib/landing-pages/nav";
import { listLandingPages, syncRedirectRulesFile } from "@/lib/landing-pages/store";
import { buildRedirectRules } from "@/lib/landing-pages/nav";

export async function refreshLandingRedirectCookie() {
  const pages = await listLandingPages();
  const rules = buildRedirectRules(pages);
  await syncRedirectRulesFile(pages);

  const jar = await cookies();
  jar.set(LANDING_REDIRECTS_COOKIE, encodeRedirectsCookie(rules), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return rules;
}
