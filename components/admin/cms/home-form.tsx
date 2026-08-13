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
  AdminSelectTrigger,
  AdminTextarea,
  TaggedTextField,
} from "@/components/admin/admin-form";
import {
  Select,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { IMAGE_PRESETS } from "@/lib/cms/image-presets";
import { PH } from "@/lib/admin/placeholders";
import type { HeroMediaType, HomePageContent } from "@/types";
import { KeilHomeFormSections } from "@/components/admin/cms/keil-home-form-sections";

type Props = {
  content: HomePageContent;
  onChange: (content: HomePageContent) => void;
};

export function HomeCmsForm({ content, onChange }: Props) {
  const patchHero = (partial: Partial<HomePageContent["hero"]>) =>
    onChange({ ...content, hero: { ...content.hero, ...partial } });

  const patchStats = (partial: Partial<HomePageContent["stats"]>) =>
    onChange({ ...content, stats: { ...content.stats, ...partial } });

  const patchAbout = (partial: Partial<HomePageContent["aboutPreview"]>) =>
    onChange({ ...content, aboutPreview: { ...content.aboutPreview, ...partial } });

  const patchProcess = (partial: Partial<HomePageContent["process"]>) =>
    onChange({ ...content, process: { ...content.process, ...partial } });

  return (
    <AdminSections>
      <AdminSection
        title="Hero"
        subtitle={`hero · ${content.hero.title || "Untitled"}`}
        enabled={content.hero.enabled}
        onEnabledChange={(enabled) => patchHero({ enabled })}
      >
        <AdminFormGrid>
          <TaggedTextField
            label="Title"
            size="xl"
            value={content.hero.title}
            onChange={(title) => patchHero({ title })}
            tag={content.hero.titleTag}
            onTagChange={(titleTag) => patchHero({ titleTag })}
            allowH1
            defaultTag="h1"
            placeholder={PH.title}
          />
          <AdminField label="Media Type" size="sm">
            <Select
              value={content.hero.mediaType || "image"}
              onValueChange={(value: HeroMediaType) => patchHero({ mediaType: value })}
            >
              <AdminSelectTrigger placeholder="Select type" />
              <SelectContent>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="carousel">Carousel</SelectItem>
              </SelectContent>
            </Select>
          </AdminField>
          <TaggedTextField
            label="Description"
            value={content.hero.description}
            onChange={(description) => patchHero({ description })}
            tag={content.hero.descriptionTag}
            onTagChange={(descriptionTag) => patchHero({ descriptionTag })}
            multiline
            rows={2}
            placeholder={PH.heroDescription}
          />
          <TaggedTextField
            label="Tagline"
            size="lg"
            value={content.hero.tagline || ""}
            onChange={(tagline) => patchHero({ tagline })}
            tag={content.hero.taglineTag}
            onTagChange={(taglineTag) => patchHero({ taglineTag })}
            placeholder="Better Environment. Better Performance."
          />
          <AdminField label="Badge Text" size="md">
            <AdminInput
              value={content.hero.badgeText || ""}
              placeholder="BUILT FOR A GREENER TOMORROW"
              onChange={(e) => patchHero({ badgeText: e.target.value })}
            />
          </AdminField>
          <AdminField label="Primary Button" size="sm">
            <AdminInput
              value={content.hero.primaryButtonText}
              placeholder={PH.buttonText}
              onChange={(e) => patchHero({ primaryButtonText: e.target.value })}
            />
          </AdminField>
          <AdminField label="Primary Link" size="lg">
            <AdminInput
              value={content.hero.primaryButtonLink}
              placeholder={PH.link}
              onChange={(e) => patchHero({ primaryButtonLink: e.target.value })}
            />
          </AdminField>
          <AdminField label="Secondary Button" size="sm">
            <AdminInput
              value={content.hero.secondaryButtonText}
              placeholder={PH.buttonText}
              onChange={(e) => patchHero({ secondaryButtonText: e.target.value })}
            />
          </AdminField>
          <AdminField label="Secondary Link" size="lg">
            <AdminInput
              value={content.hero.secondaryButtonLink}
              placeholder={PH.link}
              onChange={(e) => patchHero({ secondaryButtonLink: e.target.value })}
            />
          </AdminField>
        </AdminFormGrid>

        {(content.hero.mediaType || "image") === "image" && (
          <AdminField label={`Background · ${IMAGE_PRESETS.hero.label}`} size="full" className="mt-2">
            <MediaUpload
              value={content.hero.backgroundImage}
              onChange={(url) => patchHero({ backgroundImage: url })}
              accept="image"
              {...IMAGE_PRESETS.hero}
            />
          </AdminField>
        )}

        {(content.hero.mediaType || "image") === "video" && (
          <AdminFormGrid className="mt-2">
            <AdminField label="Video URL" size="xl">
              <AdminInput
                value={content.hero.backgroundVideo || ""}
                placeholder={PH.videoUrl}
                onChange={(e) => patchHero({ backgroundVideo: e.target.value })}
              />
            </AdminField>
            <AdminField label={`Poster · ${IMAGE_PRESETS.hero.label}`} size="full">
              <MediaUpload
                value={content.hero.backgroundImage}
                onChange={(url) => patchHero({ backgroundImage: url })}
                accept="image"
                {...IMAGE_PRESETS.hero}
              />
            </AdminField>
          </AdminFormGrid>
        )}

        {(content.hero.mediaType || "image") === "carousel" && (
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between">
              <Label>Slides</Label>
              <AdminAddButton
                label="Add Slide"
                onClick={() =>
                  patchHero({
                    carouselImages: [...(content.hero.carouselImages || []), ""],
                  })
                }
              />
            </div>
            {(content.hero.carouselImages || []).map((slide, index) => (
              <div key={index} className="flex items-start gap-2 rounded border p-2">
                <div className="min-w-0 flex-1">
                  <MediaUpload
                    value={slide}
                    onChange={(url) => {
                      const next = [...(content.hero.carouselImages || [])];
                      next[index] = url;
                      patchHero({ carouselImages: next });
                    }}
                    accept="image"
                    {...IMAGE_PRESETS.hero}
                  />
                </div>
                <AdminIconButton
                  variant="ghost"
                  onClick={() =>
                    patchHero({
                      carouselImages: (content.hero.carouselImages || []).filter((_, i) => i !== index),
                    })
                  }
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </AdminIconButton>
              </div>
            ))}
          </div>
        )}
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-between">
            <Label>Hero Features (bottom bar)</Label>
            <AdminAddButton
              label="Add Feature"
              onClick={() =>
                patchHero({
                  features: [...(content.hero.features || []), { icon: "settings", title: "" }],
                })
              }
            />
          </div>
          {(content.hero.features || []).map((feature, index) => (
            <div key={index} className="flex flex-wrap items-center gap-2 rounded border p-2">
              <AdminField size="sm">
                <AdminInput
                  value={feature.icon}
                  placeholder="Icon name"
                  onChange={(e) => {
                    const features = [...(content.hero.features || [])];
                    features[index] = { ...features[index], title: features[index].title, icon: e.target.value };
                    patchHero({ features });
                  }}
                />
              </AdminField>
              <AdminField size="md">
                <AdminInput
                  value={feature.title}
                  placeholder="Title"
                  onChange={(e) => {
                    const features = [...(content.hero.features || [])];
                    features[index] = { ...features[index], icon: features[index].icon, title: e.target.value };
                    patchHero({ features });
                  }}
                />
              </AdminField>
              <AdminIconButton
                variant="ghost"
                onClick={() =>
                  patchHero({
                    features: (content.hero.features || []).filter((_, i) => i !== index),
                  })
                }
              >
                <Trash2 className="h-3.5 w-3.5" />
              </AdminIconButton>
            </div>
          ))}
        </div>
      </AdminSection>

      <KeilHomeFormSections content={content} onChange={onChange} />

      <AdminSection
        title="Statistics (Legacy)"
        enabled={content.stats.enabled}
        onEnabledChange={(enabled) => patchStats({ enabled })}
      >
        <AdminFormGrid>
          {(
            [
              ["yearsExperience", "yearsExperienceLabel", "Years"],
              ["productsDelivered", "productsDeliveredLabel", "Products"],
              ["satisfiedClients", "satisfiedClientsLabel", "Clients"],
              ["countriesServed", "countriesServedLabel", "Countries"],
            ] as const
          ).flatMap(([valueKey, labelKey, prefix]) => [
            <AdminField key={`${valueKey}-v`} label={`${prefix}`} size="xs">
              <AdminInput
                type="number"
                value={content.stats[valueKey]}
                placeholder={PH.number}
                onChange={(e) =>
                  patchStats({ [valueKey]: parseInt(e.target.value, 10) || 0 })
                }
              />
            </AdminField>,
            <AdminField key={`${valueKey}-l`} label={`${prefix} Label`} size="md">
              <AdminInput
                value={content.stats[labelKey]}
                placeholder={PH.statLabel}
                onChange={(e) => patchStats({ [labelKey]: e.target.value })}
              />
            </AdminField>,
          ])}
        </AdminFormGrid>
      </AdminSection>

      <AdminSection
        title="About Preview (Legacy)"
        enabled={content.aboutPreview.enabled}
        onEnabledChange={(enabled) => patchAbout({ enabled })}
      >
        <AdminFormGrid>
          <TaggedTextField
            label="Badge"
            size="sm"
            value={content.aboutPreview.badge}
            onChange={(badge) => patchAbout({ badge })}
            tag={content.aboutPreview.badgeTag}
            onTagChange={(badgeTag) => patchAbout({ badgeTag })}
            placeholder={PH.badge}
          />
          <TaggedTextField
            label="Title"
            size="lg"
            value={content.aboutPreview.title}
            onChange={(title) => patchAbout({ title })}
            tag={content.aboutPreview.titleTag}
            onTagChange={(titleTag) => patchAbout({ titleTag })}
            placeholder={PH.title}
          />
          <TaggedTextField
            label="Description"
            value={content.aboutPreview.description}
            onChange={(description) => patchAbout({ description })}
            tag={content.aboutPreview.descriptionTag}
            onTagChange={(descriptionTag) => patchAbout({ descriptionTag })}
            multiline
            placeholder={PH.description}
          />
          <AdminField label="Primary Button" size="sm">
            <AdminInput
              value={content.aboutPreview.primaryButtonText}
              placeholder={PH.buttonText}
              onChange={(e) => patchAbout({ primaryButtonText: e.target.value })}
            />
          </AdminField>
          <AdminField label="Secondary Button" size="sm">
            <AdminInput
              value={content.aboutPreview.secondaryButtonText}
              placeholder={PH.buttonText}
              onChange={(e) => patchAbout({ secondaryButtonText: e.target.value })}
            />
          </AdminField>
          <AdminField label={`Image · ${IMAGE_PRESETS.section.label}`} size="full">
            <MediaUpload
              value={content.aboutPreview.image || ""}
              onChange={(url) => patchAbout({ image: url })}
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
                patchAbout({
                  features: [
                    ...content.aboutPreview.features,
                    { icon: "", title: "", description: "" },
                  ],
                })
              }
            />
          </div>
          {content.aboutPreview.features.map((feature, index) => (
            <div key={index} className="rounded border p-2">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-medium text-slate-500">Feature {index + 1}</span>
                <AdminIconButton
                  variant="ghost"
                  onClick={() =>
                    patchAbout({
                      features: content.aboutPreview.features.filter((_, i) => i !== index),
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
                      const features = [...content.aboutPreview.features];
                      features[index] = { ...features[index], icon: url };
                      patchAbout({ features });
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
                      const features = [...content.aboutPreview.features];
                      features[index] = { ...features[index], title: e.target.value };
                      patchAbout({ features });
                    }}
                  />
                </AdminField>
                <AdminField label="Description" size="full">
                  <AdminTextarea
                    rows={2}
                    value={feature.description}
                    placeholder={PH.featureDescription}
                    onChange={(e) => {
                      const features = [...content.aboutPreview.features];
                      features[index] = { ...features[index], description: e.target.value };
                      patchAbout({ features });
                    }}
                  />
                </AdminField>
              </AdminFormGrid>
            </div>
          ))}
        </div>
      </AdminSection>

      <AdminSection
        title="Process (Legacy)"
        enabled={content.process.enabled}
        onEnabledChange={(enabled) => patchProcess({ enabled })}
      >
        <AdminFormGrid>
          <TaggedTextField
            label="Title"
            size="lg"
            value={content.process.title}
            onChange={(title) => patchProcess({ title })}
            tag={content.process.titleTag}
            onTagChange={(titleTag) => patchProcess({ titleTag })}
            placeholder={PH.title}
          />
          <TaggedTextField
            label="Subtitle"
            size="lg"
            value={content.process.subtitle}
            onChange={(subtitle) => patchProcess({ subtitle })}
            tag={content.process.subtitleTag}
            onTagChange={(subtitleTag) => patchProcess({ subtitleTag })}
            placeholder={PH.subtitle}
          />
        </AdminFormGrid>

        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-between">
            <Label>Steps</Label>
            <AdminAddButton
              label="Add Step"
              onClick={() =>
                patchProcess({
                  steps: [
                    ...content.process.steps,
                    { number: "", title: "", description: "", icon: "" },
                  ],
                })
              }
            />
          </div>
          {content.process.steps.map((step, index) => (
            <div key={index} className="rounded border p-2">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-medium text-slate-500">Step {index + 1}</span>
                <AdminIconButton
                  variant="ghost"
                  onClick={() =>
                    patchProcess({
                      steps: content.process.steps.filter((_, i) => i !== index),
                    })
                  }
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </AdminIconButton>
              </div>
              <AdminFormGrid>
                <AdminField label="Icon" size="sm">
                  <MediaUpload
                    value={step.icon}
                    onChange={(url) => {
                      const steps = [...content.process.steps];
                      steps[index] = { ...steps[index], icon: url };
                      patchProcess({ steps });
                    }}
                    accept="image"
                    {...IMAGE_PRESETS.icon}
                  />
                </AdminField>
                <AdminField label="#" size="xs">
                  <AdminInput
                    value={step.number}
                    placeholder={PH.stepNumber}
                    onChange={(e) => {
                      const steps = [...content.process.steps];
                      steps[index] = { ...steps[index], number: e.target.value };
                      patchProcess({ steps });
                    }}
                  />
                </AdminField>
                <AdminField label="Title" size="md">
                  <AdminInput
                    value={step.title}
                    placeholder={PH.stepTitle}
                    onChange={(e) => {
                      const steps = [...content.process.steps];
                      steps[index] = { ...steps[index], title: e.target.value };
                      patchProcess({ steps });
                    }}
                  />
                </AdminField>
                <AdminField label="Description" size="full">
                  <AdminTextarea
                    rows={2}
                    value={step.description}
                    placeholder={PH.stepDescription}
                    onChange={(e) => {
                      const steps = [...content.process.steps];
                      steps[index] = { ...steps[index], description: e.target.value };
                      patchProcess({ steps });
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
