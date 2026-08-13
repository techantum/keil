"use client";

import { cn } from "@/lib/utils";

export function AdminShell({
  children,
  title,
  description,
  actions,
  className,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("cms-studio admin-compact", className)}>
      {(title || description || actions) && (
        <div className="cms-studio-header">
          <div>
            {title && <div className="cms-studio-title">{title}</div>}
            {description && <div className="cms-studio-sub">{description}</div>}
          </div>
          {actions && (
            <div className="cms-studio-actions">{actions}</div>
          )}
        </div>
      )}
      <div className="cms-studio-body">{children}</div>
    </div>
  );
}

export function AdminCard({
  className,
  children,
  title,
  description,
}: {
  className?: string;
  children: React.ReactNode;
  title?: string;
  description?: string;
}) {
  return (
    <div className={cn("lp-panel", className)}>
      {(title || description) && (
        <div className="lp-panel-head">
          <div>
            {title && <h3>{title}</h3>}
            {description && <p className="lp-hint mt-0.5">{description}</p>}
          </div>
        </div>
      )}
      <div className="lp-panel-body">{children}</div>
    </div>
  );
}
