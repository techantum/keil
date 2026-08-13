"use client";

import { MediaUpload } from "@/components/admin/media-upload";
import {
  AdminField,
  AdminFormGrid,
  AdminInput,
  AdminSection,
  AdminSections,
  AdminTextarea,
  TaggedTextField,
} from "@/components/admin/admin-form";
import { PH } from "@/lib/admin/placeholders";
import { IMAGE_PRESETS } from "@/lib/cms/image-presets";
import type { ContactPageContent } from "@/types";

type Props = {
  content: ContactPageContent;
  onChange: (content: ContactPageContent) => void;
};

export function ContactCmsForm({ content, onChange }: Props) {
  const patchHero = (partial: Partial<ContactPageContent["hero"]>) =>
    onChange({ ...content, hero: { ...content.hero, ...partial } });
  const patchForm = (partial: Partial<ContactPageContent["form"]>) =>
    onChange({ ...content, form: { ...content.form, ...partial } });
  const patchEnquiry = (partial: Partial<ContactPageContent["enquiry"]>) =>
    onChange({ ...content, enquiry: { ...content.enquiry, ...partial } });
  const patchInfo = (partial: Partial<ContactPageContent["contactInfo"]>) =>
    onChange({ ...content, contactInfo: { ...content.contactInfo, ...partial } });

  return (
    <AdminSections>
      <AdminSection
        title="Hero"
        subtitle={content.hero.title ? `hero · ${content.hero.title}` : undefined}
        enabled={content.hero.enabled}
        onEnabledChange={(enabled) => patchHero({ enabled })}
      >
        <AdminFormGrid>
          <TaggedTextField
            label="Title"
            size="lg"
            value={content.hero.title}
            onChange={(title) => patchHero({ title })}
            tag={content.hero.titleTag}
            onTagChange={(titleTag) => patchHero({ titleTag })}
            allowH1
            defaultTag="h1"
            placeholder={PH.title}
          />
          <TaggedTextField
            label="Subtitle"
            size="lg"
            value={content.hero.subtitle}
            onChange={(subtitle) => patchHero({ subtitle })}
            tag={content.hero.subtitleTag}
            onTagChange={(subtitleTag) => patchHero({ subtitleTag })}
            placeholder={PH.subtitle}
          />
          <AdminField label={`Background · ${IMAGE_PRESETS.hero.label}`} size="full">
            <MediaUpload
              value={content.hero.backgroundImage}
              onChange={(url) => patchHero({ backgroundImage: url })}
              accept="image"
              {...IMAGE_PRESETS.hero}
            />
          </AdminField>
        </AdminFormGrid>
      </AdminSection>

      <AdminSection
        title="Contact Form"
        enabled={content.form.enabled}
        onEnabledChange={(enabled) => patchForm({ enabled })}
      >
        <AdminFormGrid>
          <TaggedTextField
            label="Heading"
            size="lg"
            value={content.form.heading}
            onChange={(heading) => patchForm({ heading })}
            tag={content.form.headingTag}
            onTagChange={(headingTag) => patchForm({ headingTag })}
            placeholder={PH.formHeading}
          />
          <TaggedTextField
            label="Description"
            value={content.form.description}
            onChange={(description) => patchForm({ description })}
            tag={content.form.descriptionTag}
            onTagChange={(descriptionTag) => patchForm({ descriptionTag })}
            multiline
            placeholder={PH.description}
          />
          <AdminField label="Submit Button" size="sm">
            <AdminInput
              value={content.form.submitButtonText}
              placeholder={PH.buttonText}
              onChange={(e) => patchForm({ submitButtonText: e.target.value })}
            />
          </AdminField>
          <AdminField label="While Submitting" size="sm">
            <AdminInput
              value={content.form.submittingText}
              placeholder="e.g. Sending…"
              onChange={(e) => patchForm({ submittingText: e.target.value })}
            />
          </AdminField>
          <AdminField label="Success Message" size="xl">
            <AdminInput
              value={content.form.successMessage}
              placeholder={PH.successMessage}
              onChange={(e) => patchForm({ successMessage: e.target.value })}
            />
          </AdminField>
          <AdminField label="Privacy Notice" size="full">
            <AdminTextarea
              rows={2}
              value={content.form.privacyText}
              placeholder={PH.privacyText}
              onChange={(e) => patchForm({ privacyText: e.target.value })}
            />
          </AdminField>
        </AdminFormGrid>
      </AdminSection>

      <AdminSection
        title="Enquiry Modal"
        enabled={content.enquiry.enabled}
        onEnabledChange={(enabled) => patchEnquiry({ enabled })}
      >
        <AdminFormGrid>
          <TaggedTextField
            label="Modal Title"
            size="md"
            value={content.enquiry.title}
            onChange={(title) => patchEnquiry({ title })}
            tag={content.enquiry.titleTag}
            onTagChange={(titleTag) => patchEnquiry({ titleTag })}
            placeholder={PH.modalTitle}
          />
          <AdminField label="Header Button" size="sm">
            <AdminInput
              value={content.enquiry.buttonText}
              placeholder={PH.ctaButton}
              onChange={(e) => patchEnquiry({ buttonText: e.target.value })}
            />
          </AdminField>
          <AdminField label="Default Subtitle" size="md">
            <AdminInput
              value={content.enquiry.defaultSubtitle}
              placeholder="e.g. Product Enquiry"
              onChange={(e) => patchEnquiry({ defaultSubtitle: e.target.value })}
            />
          </AdminField>
          <AdminField label="Submit Button" size="sm">
            <AdminInput
              value={content.enquiry.submitButtonText}
              placeholder={PH.buttonText}
              onChange={(e) => patchEnquiry({ submitButtonText: e.target.value })}
            />
          </AdminField>
          <AdminField label="While Submitting" size="sm">
            <AdminInput
              value={content.enquiry.submittingText}
              placeholder="e.g. Submitting…"
              onChange={(e) => patchEnquiry({ submittingText: e.target.value })}
            />
          </AdminField>
          <AdminField label="Success Message" size="xl">
            <AdminInput
              value={content.enquiry.successMessage}
              placeholder={PH.successMessage}
              onChange={(e) => patchEnquiry({ successMessage: e.target.value })}
            />
          </AdminField>
        </AdminFormGrid>
      </AdminSection>

      <AdminSection
        title="Contact Information"
        enabled={content.contactInfo.enabled}
        onEnabledChange={(enabled) => patchInfo({ enabled })}
      >
        <AdminFormGrid>
          <AdminField label="Email Label" size="sm">
            <AdminInput
              value={content.contactInfo.email.title}
              placeholder={PH.contactTitle}
              onChange={(e) =>
                patchInfo({ email: { ...content.contactInfo.email, title: e.target.value } })
              }
            />
          </AdminField>
          <AdminField label="Email Address" size="lg">
            <AdminInput
              value={content.contactInfo.email.value}
              placeholder={PH.email}
              onChange={(e) =>
                patchInfo({ email: { ...content.contactInfo.email, value: e.target.value } })
              }
            />
          </AdminField>
          <AdminField label="Phone Label" size="sm">
            <AdminInput
              value={content.contactInfo.phone.title}
              placeholder={PH.contactTitle}
              onChange={(e) =>
                patchInfo({ phone: { ...content.contactInfo.phone, title: e.target.value } })
              }
            />
          </AdminField>
          <AdminField label="Phone Number" size="md">
            <AdminInput
              value={content.contactInfo.phone.value}
              placeholder={PH.phone}
              onChange={(e) =>
                patchInfo({ phone: { ...content.contactInfo.phone, value: e.target.value } })
              }
            />
          </AdminField>
          <AdminField label="Office Label" size="sm">
            <AdminInput
              value={content.contactInfo.office.title}
              placeholder={PH.officeTitle}
              onChange={(e) =>
                patchInfo({ office: { ...content.contactInfo.office, title: e.target.value } })
              }
            />
          </AdminField>
          <AdminField label="Office Address" size="full">
            <AdminTextarea
              rows={3}
              value={content.contactInfo.office.address}
              placeholder={PH.address}
              onChange={(e) =>
                patchInfo({ office: { ...content.contactInfo.office, address: e.target.value } })
              }
            />
          </AdminField>
        </AdminFormGrid>
      </AdminSection>
    </AdminSections>
  );
}
