"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Facebook, Linkedin, Youtube, Instagram, Mail, Phone, MapPin } from "lucide-react";
import type { FooterContent, Settings } from "@/types";
import { defaultFooterContent, defaultPublicSettings } from "@/lib/content/default-content";
import { mergeFooterContent } from "@/lib/content/merge-content";
import { isSectionEnabled } from "@/lib/cms/section-utils";
import { ContentHeading } from "@/components/common/content-heading";

const DEFAULT_FOOTER = defaultFooterContent();
const DEFAULT_COMPANY = defaultPublicSettings().company;

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function Footer({
  logoOverride,
  content,
}: {
  logoOverride?: string;
  content?: FooterContent | null;
} = {}) {
  const [footer, setFooter] = useState<FooterContent>(
    content ? mergeFooterContent(content) : DEFAULT_FOOTER,
  );
  const [company, setCompany] = useState<Settings["company"]>(DEFAULT_COMPANY);

  useEffect(() => {
    if (content) {
      setFooter(mergeFooterContent(content));
    }

    fetch("/api/settings", { cache: "no-store" })
      .then((res) => res.json())
      .then((settingsData) => {
        if (settingsData?.company) setCompany(settingsData.company);
      })
      .catch(() => undefined);

    if (content) return;

    fetch("/api/content/footer", { cache: "no-store" })
      .then((res) => res.json())
      .then((footerData) => {
        if (footerData && !footerData.error) {
          setFooter(mergeFooterContent(footerData));
        }
      })
      .catch(() => undefined);
  }, [content]);

  const productLinks = footer.productLinks?.filter((l) => l.name && l.href) ?? [];
  const aboutLinks = footer.aboutLinks?.filter((l) => l.name && l.href) ?? [];
  const resourcesLinks = footer.resourcesLinks?.filter((l) => l.name && l.href) ?? [];
  const legalLinks = footer.legalLinks?.filter((l) => l.name && l.href) ?? [];
  const footerSocial = footer.socialMedia ?? {};
  const companySocial = company.socialMedia || {};
  const social = {
    facebook: footerSocial.facebook || companySocial.facebook,
    twitter: footerSocial.twitter || companySocial.twitter,
    youtube: footerSocial.youtube || companySocial.youtube,
    linkedin: footerSocial.linkedin || companySocial.linkedin,
    instagram: footerSocial.instagram || companySocial.instagram,
  };
  const contactEmail = footer.contact?.email || company.email;
  const contactPhone = footer.contact?.phone || company.phone;
  const address = company.address;
  const contactLocation =
    footer.contact?.location ||
    [
      typeof address === "string" ? address : address?.street,
      typeof address === "object" ? address?.city : undefined,
      typeof address === "object" ? address?.state : undefined,
      typeof address === "object" ? address?.zipCode : undefined,
      typeof address === "object" ? address?.country : undefined,
    ]
      .filter(Boolean)
      .join(", ");

  const columns: Array<{ key: string; node: React.ReactNode } | null> = [];

  if (isSectionEnabled(footer.settings)) {
    columns.push({
      key: "brand",
      node: (
        <>
          {logoOverride || footer.logo ? (
            <img
              src={logoOverride || footer.logo}
              alt="KEIL logo"
              className="keil-footer-logo"
            />
          ) : (
            <div className="keil-footer-brand-name">KEIL</div>
          )}
          {footer.companyInfo ? (
            <ContentHeading tag="p" className="keil-footer-about">
              {footer.companyInfo}
            </ContentHeading>
          ) : null}
          {isSectionEnabled(footer.socialSection) &&
            (social.facebook ||
              social.twitter ||
              social.youtube ||
              social.linkedin ||
              social.instagram) && (
              <div className="keil-footer-social">
                {social.facebook ? (
                  <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <Facebook className="h-4 w-4" />
                  </a>
                ) : null}
                {social.instagram ? (
                  <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <Instagram className="h-4 w-4" />
                  </a>
                ) : null}
                {social.linkedin ? (
                  <a href={social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <Linkedin className="h-4 w-4" />
                  </a>
                ) : null}
                {social.youtube ? (
                  <a href={social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                    <Youtube className="h-4 w-4" />
                  </a>
                ) : null}
                {social.twitter ? (
                  <a href={social.twitter} target="_blank" rel="noopener noreferrer" aria-label="X">
                    <XIcon />
                  </a>
                ) : null}
              </div>
            )}
        </>
      ),
    });
  }

  const pushLinks = (
    key: string,
    title: string,
    links: Array<{ name: string; href: string }>,
    enabled?: boolean,
  ) => {
    if (!isSectionEnabled({ enabled }) || !links.length) return;
    columns.push({
      key,
      node: (
        <>
          <h4 className="keil-footer-heading">{title}</h4>
          <ul className="keil-footer-links">
            {links.map((link) => (
              <li key={link.href + link.name}>
                <Link href={link.href}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </>
      ),
    });
  };

  pushLinks(
    "quick",
    footer.aboutLinksSection?.title || "Quick Links",
    aboutLinks,
    footer.aboutLinksSection?.enabled,
  );
  pushLinks(
    "solutions",
    footer.productLinksSection?.title || "Our Solutions",
    productLinks,
    footer.productLinksSection?.enabled,
  );
  pushLinks(
    "resources",
    footer.resourcesLinksSection?.title || "Resources",
    resourcesLinks,
    footer.resourcesLinksSection?.enabled,
  );

  if (isSectionEnabled(footer.contactSection)) {
    columns.push({
      key: "contact",
      node: (
        <>
          <h4 className="keil-footer-heading">
            {footer.contactSection?.title || "Contact Us"}
          </h4>
          <div className="keil-footer-contact">
            {contactLocation ? (
              <p className="keil-footer-contact-row">
                <MapPin className="keil-footer-contact-icon" />
                <span>{contactLocation}</span>
              </p>
            ) : null}
            {contactEmail ? (
              <a href={`mailto:${contactEmail}`} className="keil-footer-contact-row">
                <Mail className="keil-footer-contact-icon" />
                <span>{contactEmail}</span>
              </a>
            ) : null}
            {contactPhone ? (
              <a
                href={`tel:${contactPhone.replace(/\s/g, "")}`}
                className="keil-footer-contact-row"
              >
                <Phone className="keil-footer-contact-icon" />
                <span>{contactPhone}</span>
              </a>
            ) : null}
          </div>
        </>
      ),
    });
  }

  const colCount = Math.max(columns.length, 1);

  return (
    <>
      <footer className="keil-footer">
        <div className="keil-container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="keil-footer-grid"
            style={{ ["--footer-cols" as string]: String(colCount) }}
          >
            {columns.map((col) =>
              col ? (
                <div key={col.key} className="keil-footer-col">
                  {col.node}
                </div>
              ) : null,
            )}
          </div>
        </div>
      </footer>

      <div className="keil-footer-bottom">
        <div className="keil-container mx-auto flex flex-col items-center justify-between gap-3 px-4 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <ContentHeading tag="p" className="keil-footer-copy">
            {footer.copyright}
          </ContentHeading>
          {legalLinks.length > 0 ? (
            <div className="keil-footer-legal">
              {legalLinks.map((link, i) => (
                <span key={link.href + link.name} className="keil-footer-legal-item">
                  {i > 0 ? <span className="keil-footer-legal-sep" aria-hidden>|</span> : null}
                  <Link href={link.href}>{link.name}</Link>
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
