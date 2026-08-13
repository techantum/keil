"use client";

import { Save } from "lucide-react";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  onSave?: () => void;
  isSaving?: boolean;
  actions?: ReactNode;
}

export function PageHeader({ title, description, onSave, isSaving, actions }: PageHeaderProps) {
  return (
    <div className="cms-studio-header !mb-4">
      <div>
        <div className="cms-studio-title">{title}</div>
        {description && <div className="cms-studio-sub">{description}</div>}
      </div>
      <div className="flex flex-wrap items-center gap-2 cms-studio-actions">
        {actions}
        {onSave && (
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="lp-btn lp-btn-save"
          >
            <Save className="h-3.5 w-3.5" />
            {isSaving ? "Saving..." : "Save"}
          </button>
        )}
      </div>
    </div>
  );
}
