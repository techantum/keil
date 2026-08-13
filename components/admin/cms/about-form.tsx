"use client";

import { Label } from "@/components/ui/label";
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
import type { AboutPageContent } from "@/types";
import { Trash2 } from "lucide-react";

type Props = {
  content: AboutPageContent;
  onChange: (content: AboutPageContent) => void;
};

export function AboutCmsForm({ content, onChange }: Props) {
  const patchIntro = (partial: Partial<AboutPageContent["intro"]>) =>
    onChange({ ...content, intro: { ...content.intro, ...partial } });
  const patchVision = (partial: Partial<AboutPageContent["vision"]>) =>
    onChange({ ...content, vision: { ...content.vision, ...partial } });
  const patchMission = (partial: Partial<AboutPageContent["mission"]>) =>
    onChange({ ...content, mission: { ...content.mission, ...partial } });
  const patchWhyUs = (partial: Partial<AboutPageContent["whyUs"]>) =>
    onChange({ ...content, whyUs: { ...content.whyUs, ...partial } });

  return (
    <AdminSections>
      <AdminSection
        title="Hero"
        enabled={content.hero.enabled}
        onEnabledChange={(enabled) =>
          onChange({ ...content, hero: { ...content.hero, enabled } })
        }
      >
        <AdminField label={`Background · ${IMAGE_PRESETS.hero.label}`} size="full">
          <MediaUpload
            value={content.hero.backgroundImage}
            onChange={(url) => onChange({ ...content, hero: { ...content.hero, backgroundImage: url } })}
            accept="image"
            {...IMAGE_PRESETS.hero}
          />
        </AdminField>
      </AdminSection>

      <AdminSection
        title="Introduction"
        enabled={content.intro.enabled}
        onEnabledChange={(enabled) => patchIntro({ enabled })}
      >
        <AdminFormGrid>
          <TaggedTextField
            label="Badge"
            size="sm"
            placeholder={PH.badge}
            value={content.intro.badge}
            onChange={(badge) => patchIntro({ badge })}
            tag={content.intro.badgeTag}
            onTagChange={(badgeTag) => patchIntro({ badgeTag })}
          />
          <TaggedTextField
            label="Title"
            size="lg"
            placeholder={PH.title}
            value={content.intro.title}
            onChange={(title) => patchIntro({ title })}
            tag={content.intro.titleTag}
            onTagChange={(titleTag) => patchIntro({ titleTag })}
            allowH1
            defaultTag="h1"
          />
          <TaggedTextField
            label="Description"
            placeholder={PH.description}
            value={content.intro.description}
            onChange={(description) => patchIntro({ description })}
            tag={content.intro.descriptionTag}
            onTagChange={(descriptionTag) => patchIntro({ descriptionTag })}
            multiline
            rows={4}
          />
          <AdminField label={`Image · ${IMAGE_PRESETS.section.label}`} size="full">
            <MediaUpload
              value={content.intro.image || ""}
              onChange={(url) => patchIntro({ image: url })}
              accept="image"
              {...IMAGE_PRESETS.section}
            />
          </AdminField>
        </AdminFormGrid>
      </AdminSection>

      <AdminSection
        title="Vision"
        enabled={content.vision.enabled}
        onEnabledChange={(enabled) => patchVision({ enabled })}
      >
        <AdminFormGrid>
          <TaggedTextField
            label="Badge"
            size="sm"
            placeholder={PH.badge}
            value={content.vision.badge}
            onChange={(badge) => patchVision({ badge })}
            tag={content.vision.badgeTag}
            onTagChange={(badgeTag) => patchVision({ badgeTag })}
          />
          <TaggedTextField
            label="Main Heading"
            size="lg"
            placeholder={PH.title}
            value={content.vision.mainHeading}
            onChange={(mainHeading) => patchVision({ mainHeading })}
            tag={content.vision.mainHeadingTag}
            onTagChange={(mainHeadingTag) => patchVision({ mainHeadingTag })}
          />
          <TaggedTextField
            label="Vision Title"
            size="md"
            placeholder="e.g. Our Vision"
            value={content.vision.visionTitle}
            onChange={(visionTitle) => patchVision({ visionTitle })}
            tag={content.vision.visionTitleTag}
            onTagChange={(visionTitleTag) => patchVision({ visionTitleTag })}
          />
          <TaggedTextField
            label="Vision Description"
            placeholder={PH.description}
            value={content.vision.visionDescription}
            onChange={(visionDescription) => patchVision({ visionDescription })}
            tag={content.vision.visionDescriptionTag}
            onTagChange={(visionDescriptionTag) => patchVision({ visionDescriptionTag })}
            multiline
            rows={4}
          />
          <AdminField label={`Vision Image · ${IMAGE_PRESETS.section.label}`} size="full">
            <MediaUpload
              value={content.vision.visionImage}
              onChange={(url) => patchVision({ visionImage: url })}
              accept="image"
              {...IMAGE_PRESETS.section}
            />
          </AdminField>
        </AdminFormGrid>
      </AdminSection>

      <AdminSection
        title="Mission"
        enabled={content.mission.enabled}
        onEnabledChange={(enabled) => patchMission({ enabled })}
      >
        <AdminFormGrid>
          <TaggedTextField
            label="Mission Title"
            size="md"
            placeholder="e.g. Our Mission"
            value={content.mission.missionTitle}
            onChange={(missionTitle) => patchMission({ missionTitle })}
            tag={content.mission.missionTitleTag}
            onTagChange={(missionTitleTag) => patchMission({ missionTitleTag })}
          />
          <TaggedTextField
            label="Mission Description"
            placeholder={PH.description}
            value={content.mission.missionDescription}
            onChange={(missionDescription) => patchMission({ missionDescription })}
            tag={content.mission.missionDescriptionTag}
            onTagChange={(missionDescriptionTag) => patchMission({ missionDescriptionTag })}
            multiline
            rows={4}
          />
          <AdminField label={`Mission Image · ${IMAGE_PRESETS.section.label}`} size="full">
            <MediaUpload
              value={content.mission.missionImage}
              onChange={(url) => patchMission({ missionImage: url })}
              accept="image"
              {...IMAGE_PRESETS.section}
            />
          </AdminField>
        </AdminFormGrid>
      </AdminSection>

      <AdminSection
        title="Why Choose Us"
        enabled={content.whyUs.enabled}
        onEnabledChange={(enabled) => patchWhyUs({ enabled })}
      >
        <AdminFormGrid>
          <TaggedTextField
            label="Badge"
            size="sm"
            placeholder={PH.badge}
            value={content.whyUs.badge}
            onChange={(badge) => patchWhyUs({ badge })}
            tag={content.whyUs.badgeTag}
            onTagChange={(badgeTag) => patchWhyUs({ badgeTag })}
          />
          <TaggedTextField
            label="Title"
            size="lg"
            placeholder={PH.title}
            value={content.whyUs.title}
            onChange={(title) => patchWhyUs({ title })}
            tag={content.whyUs.titleTag}
            onTagChange={(titleTag) => patchWhyUs({ titleTag })}
          />
          <TaggedTextField
            label="Description"
            placeholder={PH.description}
            value={content.whyUs.description}
            onChange={(description) => patchWhyUs({ description })}
            tag={content.whyUs.descriptionTag}
            onTagChange={(descriptionTag) => patchWhyUs({ descriptionTag })}
            multiline
          />
          <AdminField label={`Image · ${IMAGE_PRESETS.section.label}`} size="full">
            <MediaUpload
              value={content.whyUs.image || ""}
              onChange={(url) => patchWhyUs({ image: url })}
              accept="image"
              {...IMAGE_PRESETS.section}
            />
          </AdminField>
        </AdminFormGrid>

        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-between">
            <Label>Features</Label>
            <AdminAddButton
              label="Add Feature"
              onClick={() =>
                patchWhyUs({
                  features: [
                    ...content.whyUs.features,
                    { icon: "", title: "", description: "" },
                  ],
                })
              }
            />
          </div>
          {content.whyUs.features.map((feature, index) => (
            <div key={index} className="rounded border p-2">
              <div className="mb-2 flex justify-between">
                <span className="text-[10px] text-slate-500">Feature {index + 1}</span>
                <AdminIconButton
                  variant="ghost"
                  onClick={() =>
                    patchWhyUs({
                      features: content.whyUs.features.filter((_, i) => i !== index),
                    })
                  }
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </AdminIconButton>
              </div>
              <AdminFormGrid>
                <AdminField label="Icon" size="sm">
                  <MediaUpload
                    value={feature.icon}
                    onChange={(url) => {
                      const features = [...content.whyUs.features];
                      features[index] = { ...features[index], icon: url };
                      patchWhyUs({ features });
                    }}
                    accept="image"
                    {...IMAGE_PRESETS.icon}
                  />
                </AdminField>
                <AdminField label="Title" size="md">
                  <AdminInput
                    value={feature.title}
                    placeholder={PH.featureTitle}
                    onChange={(e) => {
                      const features = [...content.whyUs.features];
                      features[index] = { ...features[index], title: e.target.value };
                      patchWhyUs({ features });
                    }}
                  />
                </AdminField>
                <AdminField label="Description" size="full">
                  <AdminTextarea
                    rows={2}
                    value={feature.description}
                    placeholder={PH.featureDescription}
                    onChange={(e) => {
                      const features = [...content.whyUs.features];
                      features[index] = { ...features[index], description: e.target.value };
                      patchWhyUs({ features });
                    }}
                  />
                </AdminField>
              </AdminFormGrid>
            </div>
          ))}
        </div>
      </AdminSection>
    </AdminSections>
  );
}
