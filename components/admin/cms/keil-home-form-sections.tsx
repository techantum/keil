"use client";

import { MediaUpload } from "@/components/admin/media-upload";
import {
  AdminAddButton,
  AdminField,
  AdminFormGrid,
  AdminIconButton,
  AdminInput,
  AdminSection,
  AdminTextarea,
  TaggedTextField,
} from "@/components/admin/admin-form";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { IMAGE_PRESETS } from "@/lib/cms/image-presets";
import { PH } from "@/lib/admin/placeholders";
import type { HomePageContent } from "@/types";

type Props = {
  content: HomePageContent;
  onChange: (content: HomePageContent) => void;
};

export function KeilHomeFormSections({ content, onChange }: Props) {
  const patchAboutKeil = (partial: Partial<HomePageContent["aboutKeil"]>) =>
    onChange({ ...content, aboutKeil: { ...content.aboutKeil, ...partial } });

  const patchTeam = (partial: Partial<HomePageContent["team"]>) =>
    onChange({ ...content, team: { ...content.team, ...partial } });

  const patchWhyKeil = (partial: Partial<HomePageContent["whyKeil"]>) =>
    onChange({ ...content, whyKeil: { ...content.whyKeil, ...partial } });

  const patchSolutions = (partial: Partial<HomePageContent["solutions"]>) =>
    onChange({ ...content, solutions: { ...content.solutions, ...partial } });

  const patchBenefits = (
    partial: Partial<HomePageContent["benefitsApplications"]>,
  ) => onChange({ ...content, benefitsApplications: { ...content.benefitsApplications, ...partial } });

  const patchProjects = (partial: Partial<HomePageContent["projects"]>) =>
    onChange({ ...content, projects: { ...content.projects, ...partial } });

  const patchCta = (partial: Partial<HomePageContent["ctaBanner"]>) =>
    onChange({ ...content, ctaBanner: { ...content.ctaBanner, ...partial } });

  return (
    <>
      <AdminSection
        title="About KEIL"
        subtitle={content.aboutKeil.title ? `about · ${content.aboutKeil.title}` : undefined}
        enabled={content.aboutKeil.enabled}
        onEnabledChange={(enabled) => patchAboutKeil({ enabled })}
      >
        <AdminFormGrid>
          <TaggedTextField label="Badge" size="sm" value={content.aboutKeil.badge} onChange={(badge) => patchAboutKeil({ badge })} tag={content.aboutKeil.badgeTag} onTagChange={(badgeTag) => patchAboutKeil({ badgeTag })} placeholder={PH.badge} />
          <TaggedTextField label="Title" size="lg" value={content.aboutKeil.title} onChange={(title) => patchAboutKeil({ title })} tag={content.aboutKeil.titleTag} onTagChange={(titleTag) => patchAboutKeil({ titleTag })} placeholder={PH.title} />
          <TaggedTextField label="Description" value={content.aboutKeil.description} onChange={(description) => patchAboutKeil({ description })} tag={content.aboutKeil.descriptionTag} onTagChange={(descriptionTag) => patchAboutKeil({ descriptionTag })} multiline placeholder={PH.description} />
          <TaggedTextField label="Sub Heading" size="md" value={content.aboutKeil.subHeading || ""} onChange={(subHeading) => patchAboutKeil({ subHeading })} tag={content.aboutKeil.subHeadingTag} onTagChange={(subHeadingTag) => patchAboutKeil({ subHeadingTag })} placeholder={PH.subtitle} />
          <AdminField label="Sub Description" size="full">
            <AdminTextarea rows={2} value={content.aboutKeil.subDescription || ""} onChange={(e) => patchAboutKeil({ subDescription: e.target.value })} />
          </AdminField>
          <AdminField label={`Image · ${IMAGE_PRESETS.section.label}`} size="full">
            <MediaUpload value={content.aboutKeil.image || ""} onChange={(url) => patchAboutKeil({ image: url })} accept="image" {...IMAGE_PRESETS.section} />
          </AdminField>
          <AdminField label="Image Badge" size="md">
            <AdminInput value={content.aboutKeil.imageBadge || ""} onChange={(e) => patchAboutKeil({ imageBadge: e.target.value })} />
          </AdminField>
          <AdminField label="Glance Title" size="md">
            <AdminInput value={content.aboutKeil.glanceTitle || ""} onChange={(e) => patchAboutKeil({ glanceTitle: e.target.value })} />
          </AdminField>
        </AdminFormGrid>
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-between">
            <Label>Company at a Glance</Label>
            <AdminAddButton label="Add Item" onClick={() => patchAboutKeil({ glanceItems: [...content.aboutKeil.glanceItems, { icon: "calendar", label: "", value: "" }] })} />
          </div>
          {content.aboutKeil.glanceItems.map((item, index) => (
            <div key={index} className="flex flex-wrap items-center gap-2 rounded border p-2">
              <AdminField size="sm"><AdminInput value={item.icon} placeholder="Icon name" onChange={(e) => { const glanceItems = [...content.aboutKeil.glanceItems]; glanceItems[index] = { ...glanceItems[index], icon: e.target.value }; patchAboutKeil({ glanceItems }); }} /></AdminField>
              <AdminField size="md"><AdminInput value={item.label} placeholder="Label" onChange={(e) => { const glanceItems = [...content.aboutKeil.glanceItems]; glanceItems[index] = { ...glanceItems[index], label: e.target.value }; patchAboutKeil({ glanceItems }); }} /></AdminField>
              <AdminField size="md"><AdminInput value={item.value} placeholder="Value" onChange={(e) => { const glanceItems = [...content.aboutKeil.glanceItems]; glanceItems[index] = { ...glanceItems[index], value: e.target.value }; patchAboutKeil({ glanceItems }); }} /></AdminField>
              <AdminIconButton variant="ghost" onClick={() => patchAboutKeil({ glanceItems: content.aboutKeil.glanceItems.filter((_, i) => i !== index) })}><Trash2 className="h-3.5 w-3.5" /></AdminIconButton>
            </div>
          ))}
        </div>
      </AdminSection>

      <AdminSection title="Team" subtitle={content.team.title ? `team · ${content.team.title}` : undefined} enabled={content.team.enabled} onEnabledChange={(enabled) => patchTeam({ enabled })}>
        <AdminFormGrid>
          <TaggedTextField label="Title" size="lg" value={content.team.title} onChange={(title) => patchTeam({ title })} tag={content.team.titleTag} onTagChange={(titleTag) => patchTeam({ titleTag })} placeholder={PH.title} />
          <TaggedTextField label="Subtitle" size="lg" value={content.team.subtitle} onChange={(subtitle) => patchTeam({ subtitle })} tag={content.team.subtitleTag} onTagChange={(subtitleTag) => patchTeam({ subtitleTag })} placeholder={PH.subtitle} />
          <AdminField label="Button Text" size="sm"><AdminInput value={content.team.buttonText} onChange={(e) => patchTeam({ buttonText: e.target.value })} /></AdminField>
          <AdminField label="Button Link" size="md"><AdminInput value={content.team.buttonLink} onChange={(e) => patchTeam({ buttonLink: e.target.value })} /></AdminField>
        </AdminFormGrid>
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-between"><Label>Team Members</Label><AdminAddButton label="Add Member" onClick={() => patchTeam({ members: [...content.team.members, { name: "", role: "", bio: "", image: "" }] })} /></div>
          {content.team.members.map((member, index) => (
            <div key={index} className="rounded border p-2 space-y-2">
              <AdminFormGrid>
                <AdminField label="Name" size="md"><AdminInput value={member.name} onChange={(e) => { const members = [...content.team.members]; members[index] = { ...members[index], name: e.target.value }; patchTeam({ members }); }} /></AdminField>
                <AdminField label="Role" size="md"><AdminInput value={member.role} onChange={(e) => { const members = [...content.team.members]; members[index] = { ...members[index], role: e.target.value }; patchTeam({ members }); }} /></AdminField>
                <AdminField label="Bio" size="full"><AdminTextarea rows={2} value={member.bio} onChange={(e) => { const members = [...content.team.members]; members[index] = { ...members[index], bio: e.target.value }; patchTeam({ members }); }} /></AdminField>
                <AdminField label="Photo" size="full"><MediaUpload value={member.image} onChange={(url) => { const members = [...content.team.members]; members[index] = { ...members[index], image: url }; patchTeam({ members }); }} accept="image" {...IMAGE_PRESETS.section} /></AdminField>
              </AdminFormGrid>
              <AdminIconButton variant="ghost" onClick={() => patchTeam({ members: content.team.members.filter((_, i) => i !== index) })}><Trash2 className="h-3.5 w-3.5" /></AdminIconButton>
            </div>
          ))}
        </div>
      </AdminSection>

      <AdminSection title="Why KEIL" subtitle={content.whyKeil.title ? `why · ${content.whyKeil.title}` : undefined} enabled={content.whyKeil.enabled} onEnabledChange={(enabled) => patchWhyKeil({ enabled })}>
        <AdminFormGrid>
          <TaggedTextField label="Badge" size="sm" value={content.whyKeil.badge} onChange={(badge) => patchWhyKeil({ badge })} tag={content.whyKeil.badgeTag} onTagChange={(badgeTag) => patchWhyKeil({ badgeTag })} placeholder={PH.badge} />
          <TaggedTextField label="Title" size="lg" value={content.whyKeil.title} onChange={(title) => patchWhyKeil({ title })} tag={content.whyKeil.titleTag} onTagChange={(titleTag) => patchWhyKeil({ titleTag })} placeholder={PH.title} />
          <TaggedTextField label="Description" value={content.whyKeil.description} onChange={(description) => patchWhyKeil({ description })} tag={content.whyKeil.descriptionTag} onTagChange={(descriptionTag) => patchWhyKeil({ descriptionTag })} multiline placeholder={PH.description} />
          <AdminField label="Promise Title" size="md"><AdminInput value={content.whyKeil.promiseTitle} onChange={(e) => patchWhyKeil({ promiseTitle: e.target.value })} /></AdminField>
          <AdminField label="Promise Button" size="sm"><AdminInput value={content.whyKeil.promiseButtonText} onChange={(e) => patchWhyKeil({ promiseButtonText: e.target.value })} /></AdminField>
          <AdminField label="Promise Link" size="md"><AdminInput value={content.whyKeil.promiseButtonLink} onChange={(e) => patchWhyKeil({ promiseButtonLink: e.target.value })} /></AdminField>
        </AdminFormGrid>
        <div className="mt-2 space-y-2">
          <Label>Promise Items</Label>
          {content.whyKeil.promiseItems.map((item, index) => (
            <div key={index} className="flex gap-2">
              <AdminInput value={item} onChange={(e) => { const promiseItems = [...content.whyKeil.promiseItems]; promiseItems[index] = e.target.value; patchWhyKeil({ promiseItems }); }} />
              <AdminIconButton variant="ghost" onClick={() => patchWhyKeil({ promiseItems: content.whyKeil.promiseItems.filter((_, i) => i !== index) })}><Trash2 className="h-3.5 w-3.5" /></AdminIconButton>
            </div>
          ))}
          <AdminAddButton label="Add Item" onClick={() => patchWhyKeil({ promiseItems: [...content.whyKeil.promiseItems, ""] })} />
        </div>
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-between"><Label>Features Grid</Label><AdminAddButton label="Add Feature" onClick={() => patchWhyKeil({ features: [...content.whyKeil.features, { icon: "settings", title: "", description: "" }] })} /></div>
          {content.whyKeil.features.map((feature, index) => (
            <div key={index} className="flex flex-wrap gap-2 rounded border p-2">
              <AdminField size="sm"><AdminInput value={feature.icon} placeholder="Icon" onChange={(e) => { const features = [...content.whyKeil.features]; features[index] = { ...features[index], icon: e.target.value }; patchWhyKeil({ features }); }} /></AdminField>
              <AdminField size="md"><AdminInput value={feature.title} placeholder="Title" onChange={(e) => { const features = [...content.whyKeil.features]; features[index] = { ...features[index], title: e.target.value }; patchWhyKeil({ features }); }} /></AdminField>
              <AdminField size="full"><AdminTextarea rows={1} value={feature.description || ""} placeholder="Description" onChange={(e) => { const features = [...content.whyKeil.features]; features[index] = { ...features[index], description: e.target.value }; patchWhyKeil({ features }); }} /></AdminField>
              <AdminIconButton variant="ghost" onClick={() => patchWhyKeil({ features: content.whyKeil.features.filter((_, i) => i !== index) })}><Trash2 className="h-3.5 w-3.5" /></AdminIconButton>
            </div>
          ))}
        </div>
      </AdminSection>

      <AdminSection title="EC Shed Solutions" subtitle={content.solutions.title ? `solutions · ${content.solutions.title}` : undefined} enabled={content.solutions.enabled} onEnabledChange={(enabled) => patchSolutions({ enabled })}>
        <AdminFormGrid>
          <TaggedTextField label="Title" size="lg" value={content.solutions.title} onChange={(title) => patchSolutions({ title })} tag={content.solutions.titleTag} onTagChange={(titleTag) => patchSolutions({ titleTag })} placeholder={PH.title} />
          <AdminField label="Button Text" size="sm"><AdminInput value={content.solutions.buttonText} onChange={(e) => patchSolutions({ buttonText: e.target.value })} /></AdminField>
          <AdminField label="Button Link" size="md"><AdminInput value={content.solutions.buttonLink} onChange={(e) => patchSolutions({ buttonLink: e.target.value })} /></AdminField>
        </AdminFormGrid>
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-between"><Label>Solution Cards</Label><AdminAddButton label="Add Solution" onClick={() => patchSolutions({ items: [...content.solutions.items, { title: "", description: "", image: "" }] })} /></div>
          {content.solutions.items.map((item, index) => (
            <div key={index} className="rounded border p-2 space-y-2">
              <AdminFormGrid>
                <AdminField label="Title" size="md"><AdminInput value={item.title} onChange={(e) => { const items = [...content.solutions.items]; items[index] = { ...items[index], title: e.target.value }; patchSolutions({ items }); }} /></AdminField>
                <AdminField label="Description" size="full"><AdminTextarea rows={2} value={item.description} onChange={(e) => { const items = [...content.solutions.items]; items[index] = { ...items[index], description: e.target.value }; patchSolutions({ items }); }} /></AdminField>
                <AdminField label="Image" size="full"><MediaUpload value={item.image} onChange={(url) => { const items = [...content.solutions.items]; items[index] = { ...items[index], image: url }; patchSolutions({ items }); }} accept="image" {...IMAGE_PRESETS.section} /></AdminField>
              </AdminFormGrid>
              <AdminIconButton variant="ghost" onClick={() => patchSolutions({ items: content.solutions.items.filter((_, i) => i !== index) })}><Trash2 className="h-3.5 w-3.5" /></AdminIconButton>
            </div>
          ))}
        </div>
      </AdminSection>

      <AdminSection title="Benefits & Applications" subtitle={content.benefitsApplications.title ? `benefits · ${content.benefitsApplications.title}` : undefined} enabled={content.benefitsApplications.enabled} onEnabledChange={(enabled) => patchBenefits({ enabled })}>
        <AdminFormGrid>
          <TaggedTextField label="Benefits Title" size="md" value={content.benefitsApplications.benefits.title} onChange={(title) => patchBenefits({ benefits: { ...content.benefitsApplications.benefits, title } })} tag={content.benefitsApplications.benefits.titleTag} onTagChange={(titleTag) => patchBenefits({ benefits: { ...content.benefitsApplications.benefits, titleTag } })} placeholder={PH.title} />
          <AdminField label="Benefits Description" size="full"><AdminTextarea rows={2} value={content.benefitsApplications.benefits.description} onChange={(e) => patchBenefits({ benefits: { ...content.benefitsApplications.benefits, description: e.target.value } })} /></AdminField>
          <AdminField label="Outcome Title" size="md"><AdminInput value={content.benefitsApplications.benefits.outcomeTitle} onChange={(e) => patchBenefits({ benefits: { ...content.benefitsApplications.benefits, outcomeTitle: e.target.value } })} /></AdminField>
          <TaggedTextField label="Applications Title" size="md" value={content.benefitsApplications.applications.title} onChange={(title) => patchBenefits({ applications: { ...content.benefitsApplications.applications, title } })} tag={content.benefitsApplications.applications.titleTag} onTagChange={(titleTag) => patchBenefits({ applications: { ...content.benefitsApplications.applications, titleTag } })} placeholder={PH.title} />
          <AdminField label="Applications Description" size="full"><AdminTextarea rows={2} value={content.benefitsApplications.applications.description} onChange={(e) => patchBenefits({ applications: { ...content.benefitsApplications.applications, description: e.target.value } })} /></AdminField>
          <AdminField label="Explore Text" size="sm"><AdminInput value={content.benefitsApplications.applications.exploreText} onChange={(e) => patchBenefits({ applications: { ...content.benefitsApplications.applications, exploreText: e.target.value } })} /></AdminField>
          <AdminField label="Explore Link" size="md"><AdminInput value={content.benefitsApplications.applications.exploreLink} onChange={(e) => patchBenefits({ applications: { ...content.benefitsApplications.applications, exploreLink: e.target.value } })} /></AdminField>
        </AdminFormGrid>
      </AdminSection>

      <AdminSection title="Recent Projects" subtitle={content.projects.title ? `projects · ${content.projects.title}` : undefined} enabled={content.projects.enabled} onEnabledChange={(enabled) => patchProjects({ enabled })}>
        <AdminFormGrid>
          <TaggedTextField label="Title" size="lg" value={content.projects.title} onChange={(title) => patchProjects({ title })} tag={content.projects.titleTag} onTagChange={(titleTag) => patchProjects({ titleTag })} placeholder={PH.title} />
          <AdminField label="Button Text" size="sm"><AdminInput value={content.projects.buttonText} onChange={(e) => patchProjects({ buttonText: e.target.value })} /></AdminField>
          <AdminField label="Button Link" size="md"><AdminInput value={content.projects.buttonLink} onChange={(e) => patchProjects({ buttonLink: e.target.value })} /></AdminField>
        </AdminFormGrid>
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-between"><Label>Project Images</Label><AdminAddButton label="Add Image" onClick={() => patchProjects({ images: [...content.projects.images, { image: "", title: "", alt: "" }] })} /></div>
          {content.projects.images.map((project, index) => (
            <div key={index} className="rounded border p-2">
              <MediaUpload value={project.image} onChange={(url) => { const images = [...content.projects.images]; images[index] = { ...images[index], image: url }; patchProjects({ images }); }} accept="image" {...IMAGE_PRESETS.section} />
              <AdminIconButton variant="ghost" onClick={() => patchProjects({ images: content.projects.images.filter((_, i) => i !== index) })}><Trash2 className="h-3.5 w-3.5" /></AdminIconButton>
            </div>
          ))}
        </div>
      </AdminSection>

      <AdminSection title="CTA Banner" subtitle={content.ctaBanner.title ? `cta · ${content.ctaBanner.title}` : undefined} enabled={content.ctaBanner.enabled} onEnabledChange={(enabled) => patchCta({ enabled })}>
        <AdminFormGrid>
          <TaggedTextField label="Title" size="lg" value={content.ctaBanner.title} onChange={(title) => patchCta({ title })} tag={content.ctaBanner.titleTag} onTagChange={(titleTag) => patchCta({ titleTag })} placeholder={PH.title} />
          <AdminField label="Description" size="full"><AdminTextarea rows={2} value={content.ctaBanner.description} onChange={(e) => patchCta({ description: e.target.value })} /></AdminField>
          <AdminField label="Phone" size="md"><AdminInput value={content.ctaBanner.phone} onChange={(e) => patchCta({ phone: e.target.value })} /></AdminField>
          <AdminField label="Image" size="full"><MediaUpload value={content.ctaBanner.image || ""} onChange={(url) => patchCta({ image: url })} accept="image" {...IMAGE_PRESETS.section} /></AdminField>
        </AdminFormGrid>
      </AdminSection>
    </>
  );
}
