"use client";

import { MediaUpload } from "@/components/admin/media-upload";
import {
  AdminAddButton,
  AdminField,
  AdminFormGrid,
  AdminIconButton,
  AdminInput,
  AdminSection,
  AdminSections,
  AdminTextarea,
  TaggedTextField,
} from "@/components/admin/admin-form";
import { PH } from "@/lib/admin/placeholders";
import { IMAGE_PRESETS } from "@/lib/cms/image-presets";
import type { FooterContent } from "@/types";
import { Trash2 } from "lucide-react";

type Props = {
  content: FooterContent;
  onChange: (content: FooterContent) => void;
};

export function FooterCmsForm({ content, onChange }: Props) {
  const patch = (partial: Partial<FooterContent>) => onChange({ ...content, ...partial });

  return (
    <AdminSections>
      <AdminSection
        title="Footer Settings"
        enabled={content.settings?.enabled}
        onEnabledChange={(enabled) =>
          patch({ settings: { ...content.settings, enabled } })
        }
      >
        <AdminFormGrid>
          <AdminField label={`Logo · ${IMAGE_PRESETS.logo.label}`} size="full">
            <MediaUpload
              value={content.logo}
              onChange={(url) => patch({ logo: url })}
              accept="image"
              {...IMAGE_PRESETS.logo}
            />
          </AdminField>
          <AdminField label="Company Description" size="full">
            <AdminTextarea
              rows={3}
              value={content.companyInfo}
              placeholder={PH.companyDescription}
              onChange={(e) => patch({ companyInfo: e.target.value })}
            />
          </AdminField>
          <AdminField label="Copyright" size="xl">
            <AdminInput
              value={content.copyright}
              placeholder={PH.copyright}
              onChange={(e) => patch({ copyright: e.target.value })}
            />
          </AdminField>
        </AdminFormGrid>
      </AdminSection>

      <AdminSection
        title="Product Links"
        enabled={content.productLinksSection?.enabled}
        onEnabledChange={(enabled) =>
          patch({ productLinksSection: { ...content.productLinksSection, enabled } })
        }
      >
        <AdminFormGrid>
          <AdminField label="Column title" size="md">
            <AdminInput
              value={content.productLinksSection?.title || ""}
              placeholder="Our Solutions"
              onChange={(e) =>
                patch({
                  productLinksSection: {
                    ...content.productLinksSection,
                    title: e.target.value,
                  },
                })
              }
            />
          </AdminField>
        </AdminFormGrid>
        <div className="space-y-2">
          {content.productLinks.map((link, index) => (
            <div key={index} className="flex flex-wrap items-center gap-2">
              <AdminField size="md">
                <AdminInput
                  value={link.name}
                  placeholder={PH.linkName}
                  onChange={(e) => {
                    const productLinks = [...content.productLinks];
                    productLinks[index] = { ...productLinks[index], name: e.target.value };
                    patch({ productLinks });
                  }}
                />
              </AdminField>
              <AdminField size="lg">
                <AdminInput
                  value={link.href}
                  placeholder={PH.linkUrl}
                  onChange={(e) => {
                    const productLinks = [...content.productLinks];
                    productLinks[index] = { ...productLinks[index], href: e.target.value };
                    patch({ productLinks });
                  }}
                />
              </AdminField>
              <AdminIconButton
                variant="ghost"
                onClick={() =>
                  patch({ productLinks: content.productLinks.filter((_, i) => i !== index) })
                }
              >
                <Trash2 className="h-3.5 w-3.5" />
              </AdminIconButton>
            </div>
          ))}
          <AdminAddButton
            label="Add Link"
            onClick={() => patch({ productLinks: [...content.productLinks, { name: "", href: "" }] })}
          />
        </div>
      </AdminSection>

      <AdminSection
        title="About Links"
        enabled={content.aboutLinksSection?.enabled}
        onEnabledChange={(enabled) =>
          patch({ aboutLinksSection: { ...content.aboutLinksSection, enabled } })
        }
      >
        <AdminFormGrid>
          <AdminField label="Column title" size="md">
            <AdminInput
              value={content.aboutLinksSection?.title || ""}
              placeholder="Quick Links"
              onChange={(e) =>
                patch({
                  aboutLinksSection: {
                    ...content.aboutLinksSection,
                    title: e.target.value,
                  },
                })
              }
            />
          </AdminField>
        </AdminFormGrid>
        <div className="space-y-2">
          {content.aboutLinks.map((link, index) => (
            <div key={index} className="flex flex-wrap items-center gap-2">
              <AdminField size="md">
                <AdminInput
                  value={link.name}
                  placeholder={PH.linkName}
                  onChange={(e) => {
                    const aboutLinks = [...content.aboutLinks];
                    aboutLinks[index] = { ...aboutLinks[index], name: e.target.value };
                    patch({ aboutLinks });
                  }}
                />
              </AdminField>
              <AdminField size="lg">
                <AdminInput
                  value={link.href}
                  placeholder={PH.linkUrl}
                  onChange={(e) => {
                    const aboutLinks = [...content.aboutLinks];
                    aboutLinks[index] = { ...aboutLinks[index], href: e.target.value };
                    patch({ aboutLinks });
                  }}
                />
              </AdminField>
              <AdminIconButton
                variant="ghost"
                onClick={() =>
                  patch({ aboutLinks: content.aboutLinks.filter((_, i) => i !== index) })
                }
              >
                <Trash2 className="h-3.5 w-3.5" />
              </AdminIconButton>
            </div>
          ))}
          <AdminAddButton
            label="Add Link"
            onClick={() => patch({ aboutLinks: [...content.aboutLinks, { name: "", href: "" }] })}
          />
        </div>
      </AdminSection>

      <AdminSection
        title="Resources Links"
        enabled={content.resourcesLinksSection?.enabled}
        onEnabledChange={(enabled) =>
          patch({ resourcesLinksSection: { ...content.resourcesLinksSection, enabled } })
        }
      >
        <AdminFormGrid>
          <AdminField label="Column title" size="md">
            <AdminInput
              value={content.resourcesLinksSection?.title || ""}
              placeholder="Resources"
              onChange={(e) =>
                patch({
                  resourcesLinksSection: {
                    ...content.resourcesLinksSection,
                    title: e.target.value,
                  },
                })
              }
            />
          </AdminField>
        </AdminFormGrid>
        <div className="space-y-2">
          {(content.resourcesLinks || []).map((link, index) => (
            <div key={index} className="flex flex-wrap items-center gap-2">
              <AdminField size="md">
                <AdminInput
                  value={link.name}
                  placeholder={PH.linkName}
                  onChange={(e) => {
                    const resourcesLinks = [...(content.resourcesLinks || [])];
                    resourcesLinks[index] = { ...resourcesLinks[index], name: e.target.value };
                    patch({ resourcesLinks });
                  }}
                />
              </AdminField>
              <AdminField size="lg">
                <AdminInput
                  value={link.href}
                  placeholder={PH.linkUrl}
                  onChange={(e) => {
                    const resourcesLinks = [...(content.resourcesLinks || [])];
                    resourcesLinks[index] = { ...resourcesLinks[index], href: e.target.value };
                    patch({ resourcesLinks });
                  }}
                />
              </AdminField>
              <AdminIconButton
                variant="ghost"
                onClick={() =>
                  patch({
                    resourcesLinks: (content.resourcesLinks || []).filter((_, i) => i !== index),
                  })
                }
              >
                <Trash2 className="h-3.5 w-3.5" />
              </AdminIconButton>
            </div>
          ))}
          <AdminAddButton
            label="Add Link"
            onClick={() =>
              patch({ resourcesLinks: [...(content.resourcesLinks || []), { name: "", href: "" }] })
            }
          />
        </div>
      </AdminSection>

      <AdminSection title="Legal Links">
        <div className="space-y-2">
          {(content.legalLinks || []).map((link, index) => (
            <div key={index} className="flex flex-wrap items-center gap-2">
              <AdminField size="md">
                <AdminInput
                  value={link.name}
                  placeholder={PH.linkName}
                  onChange={(e) => {
                    const legalLinks = [...(content.legalLinks || [])];
                    legalLinks[index] = { ...legalLinks[index], name: e.target.value };
                    patch({ legalLinks });
                  }}
                />
              </AdminField>
              <AdminField size="lg">
                <AdminInput
                  value={link.href}
                  placeholder={PH.linkUrl}
                  onChange={(e) => {
                    const legalLinks = [...(content.legalLinks || [])];
                    legalLinks[index] = { ...legalLinks[index], href: e.target.value };
                    patch({ legalLinks });
                  }}
                />
              </AdminField>
              <AdminIconButton
                variant="ghost"
                onClick={() =>
                  patch({ legalLinks: (content.legalLinks || []).filter((_, i) => i !== index) })
                }
              >
                <Trash2 className="h-3.5 w-3.5" />
              </AdminIconButton>
            </div>
          ))}
          <AdminAddButton
            label="Add Link"
            onClick={() =>
              patch({ legalLinks: [...(content.legalLinks || []), { name: "", href: "" }] })
            }
          />
        </div>
      </AdminSection>

      <AdminSection
        title="Newsletter"
        enabled={content.newsletterSection?.enabled}
        onEnabledChange={(enabled) =>
          patch({ newsletterSection: { ...content.newsletterSection, enabled } })
        }
      >
        <AdminFormGrid>
          <TaggedTextField
            label="Heading"
            size="md"
            value={content.newsletter.heading}
            onChange={(heading) =>
              patch({ newsletter: { ...content.newsletter, heading } })
            }
            tag={content.newsletter.headingTag}
            onTagChange={(headingTag) =>
              patch({ newsletter: { ...content.newsletter, headingTag } })
            }
            placeholder={PH.newsletterHeading}
          />
          <AdminField label="Input Placeholder" size="md">
            <AdminInput
              value={content.newsletter.placeholder}
              placeholder={PH.emailPlaceholder}
              onChange={(e) =>
                patch({ newsletter: { ...content.newsletter, placeholder: e.target.value } })
              }
            />
          </AdminField>
        </AdminFormGrid>
      </AdminSection>

      <AdminSection
        title="Footer Contact"
        enabled={content.contactSection?.enabled}
        onEnabledChange={(enabled) =>
          patch({ contactSection: { ...content.contactSection, enabled } })
        }
      >
        <AdminFormGrid>
          <AdminField label="Column title" size="md">
            <AdminInput
              value={content.contactSection?.title || ""}
              placeholder="Contact Us"
              onChange={(e) =>
                patch({
                  contactSection: { ...content.contactSection, title: e.target.value },
                })
              }
            />
          </AdminField>
          <AdminField label="Location" size="xl">
            <AdminInput
              value={content.contact.location}
              placeholder={PH.address}
              onChange={(e) => patch({ contact: { ...content.contact, location: e.target.value } })}
            />
          </AdminField>
          <AdminField label="Phone" size="md">
            <AdminInput
              value={content.contact.phone}
              placeholder={PH.phone}
              onChange={(e) => patch({ contact: { ...content.contact, phone: e.target.value } })}
            />
          </AdminField>
          <AdminField label="Email" size="lg">
            <AdminInput
              value={content.contact.email}
              placeholder={PH.email}
              onChange={(e) => patch({ contact: { ...content.contact, email: e.target.value } })}
            />
          </AdminField>
        </AdminFormGrid>
      </AdminSection>

      <AdminSection
        title="Social Media"
        enabled={content.socialSection?.enabled}
        onEnabledChange={(enabled) =>
          patch({ socialSection: { ...content.socialSection, enabled } })
        }
      >
        <AdminFormGrid>
          {(["facebook", "twitter", "youtube", "linkedin", "instagram"] as const).map((key) => (
            <AdminField key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} size="xl">
              <AdminInput
                value={content.socialMedia[key] || ""}
                placeholder={PH.socialUrl}
                onChange={(e) =>
                  patch({ socialMedia: { ...content.socialMedia, [key]: e.target.value } })
                }
              />
            </AdminField>
          ))}
        </AdminFormGrid>
      </AdminSection>
    </AdminSections>
  );
}
