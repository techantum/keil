"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type EntitySeoValues = {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
};

type EntitySeoFieldsProps = {
  values: EntitySeoValues;
  onChange: (values: EntitySeoValues) => void;
};

export function EntitySeoFields({ values, onChange }: EntitySeoFieldsProps) {
  return (
    <div className="border-t pt-4 mt-2 space-y-3">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        SEO
      </h4>
      <div>
        <Label htmlFor="metaTitle">Meta title</Label>
        <Input
          id="metaTitle"
          value={values.metaTitle}
          onChange={(e) => onChange({ ...values, metaTitle: e.target.value })}
          placeholder="Page title for search engines"
          className="h-8 text-sm"
        />
      </div>
      <div>
        <Label htmlFor="metaDescription">Meta description</Label>
        <Textarea
          id="metaDescription"
          value={values.metaDescription}
          onChange={(e) =>
            onChange({ ...values, metaDescription: e.target.value })
          }
          placeholder="Short description for search results"
          rows={2}
          className="text-sm"
        />
      </div>
      <div>
        <Label htmlFor="metaKeywords">Meta keywords</Label>
        <Input
          id="metaKeywords"
          value={values.metaKeywords}
          onChange={(e) => onChange({ ...values, metaKeywords: e.target.value })}
          placeholder="keyword one, keyword two"
          className="h-8 text-sm"
        />
        <p className="text-xs text-muted-foreground mt-1">Comma-separated</p>
      </div>
    </div>
  );
}

export function parseMetaKeywords(value: string): string[] {
  return value
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
}

export function formatMetaKeywords(keywords?: string[]): string {
  return keywords?.join(", ") ?? "";
}
