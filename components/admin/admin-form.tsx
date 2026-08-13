"use client";

import {
  createContext,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HEADING_TAG_OPTIONS, type HeadingTag } from "@/lib/cms/types";
import { ChevronDown, ChevronUp, Loader2, Save } from "lucide-react";

type AdminSectionsContextValue = {
  register: (id: string) => number;
  isOpen: (id: string, index: number) => boolean;
  setOpen: (id: string, open: boolean) => void;
};

const AdminSectionsContext = createContext<AdminSectionsContextValue | null>(
  null,
);

/** Field width preset — input wraps to content, not full grid cell. */
export type AdminFieldSize = "xs" | "sm" | "md" | "lg" | "xl" | "full";

const SIZE_CLASS: Record<AdminFieldSize, string> = {
  xs: "admin-field-xs",
  sm: "admin-field-sm",
  md: "admin-field-md",
  lg: "admin-field-lg",
  xl: "admin-field-xl",
  full: "admin-field-full",
};

export function AdminFormGrid({
  children,
  className,
  cols,
}: {
  children: React.ReactNode;
  className?: string;
  /** When set, uses fixed column grid; otherwise uses flowing inline layout. */
  cols?: 2 | 3 | 4;
}) {
  if (cols) {
    return (
      <div className={cn("admin-form-grid", `admin-form-grid-cols-${cols}`, className)}>
        {children}
      </div>
    );
  }
  return <div className={cn("admin-form-flow", className)}>{children}</div>;
}

export function AdminInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn(
        "admin-input h-9 w-full min-w-0 rounded-xl border-slate-200 text-sm shadow-none focus-visible:border-teal-500 focus-visible:ring-teal-500/20",
        className,
      )}
      {...props}
    />
  );
}

export function AdminTextarea({
  className,
  ...props
}: React.ComponentProps<typeof Textarea>) {
  return (
    <Textarea
      className={cn(
        "admin-input min-h-[3.5rem] w-full min-w-0 rounded-xl border-slate-200 text-sm shadow-none focus-visible:border-teal-500 focus-visible:ring-teal-500/20",
        className,
      )}
      {...props}
    />
  );
}

export function AdminSelectTrigger({
  className,
  placeholder,
  children,
  ...props
}: React.ComponentProps<typeof SelectTrigger> & {
  placeholder?: string;
}) {
  return (
    <SelectTrigger
      size="sm"
      className={cn(
        "admin-input h-9 min-h-9 w-full rounded-xl border-slate-200 px-3 text-sm shadow-none",
        className,
      )}
      {...props}
    >
      {children ?? <SelectValue placeholder={placeholder} />}
    </SelectTrigger>
  );
}

export function AdminField({
  label,
  children,
  wide,
  span,
  size = "md",
  placeholder,
  className,
}: {
  label?: string;
  children: React.ReactNode;
  wide?: boolean;
  span?: 2 | 3 | 4;
  size?: AdminFieldSize;
  /** Only applied when child input has no placeholder already */
  placeholder?: string;
  className?: string;
}) {
  const fieldChild =
    placeholder &&
    isValidElement(children) &&
    !(children.props as { placeholder?: string }).placeholder &&
    (children.type === AdminInput || children.type === AdminTextarea)
      ? cloneElement(children as React.ReactElement<{ placeholder?: string }>, {
          placeholder,
        })
      : children;

  return (
    <div
      className={cn(
        SIZE_CLASS[wide || size === "full" ? "full" : size],
        span === 2 && "admin-field-span-2",
        span === 3 && "admin-field-span-3",
        span === 4 && "admin-field-span-4",
        className,
      )}
    >
      {label && (
        <Label className="mb-1 block text-[0.65rem] font-bold uppercase tracking-wide text-slate-500">
          {label}
        </Label>
      )}
      {fieldChild}
    </div>
  );
}

/** Accordion group: numbered rows, click to expand (Landing Pages style). */
export function AdminSections({
  title = "Sections",
  children,
  defaultOpenFirst = true,
}: {
  title?: string;
  children: ReactNode;
  defaultOpenFirst?: boolean;
}) {
  const frameIds = useRef<string[]>([]);
  frameIds.current = [];
  const [count, setCount] = useState(0);
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const defaultOpenFirstRef = useRef(defaultOpenFirst);

  const register = (id: string) => {
    const index = frameIds.current.length;
    frameIds.current.push(id);
    return index;
  };

  useLayoutEffect(() => {
    setCount(frameIds.current.length);
  });

  const value: AdminSectionsContextValue = {
    register,
    isOpen: (id, index) => {
      if (openMap[id] !== undefined) return openMap[id];
      return defaultOpenFirstRef.current && index === 0;
    },
    setOpen: (id, open) => setOpenMap((prev) => ({ ...prev, [id]: open })),
  };

  return (
    <AdminSectionsContext.Provider value={value}>
      <div>
        <div className="mb-2">
          <h2 className="text-sm font-bold text-slate-900">{title}</h2>
          <p className="lp-hint">{count} blocks · click a row to expand</p>
        </div>
        {children}
      </div>
    </AdminSectionsContext.Provider>
  );
}

export function AdminSection({
  title,
  subtitle,
  enabled = true,
  onEnabledChange,
  children,
  defaultOpen = false,
}: {
  title: string;
  subtitle?: string;
  enabled?: boolean;
  onEnabledChange?: (enabled: boolean) => void;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const ctx = useContext(AdminSectionsContext);
  const id = useId();
  const index = ctx ? ctx.register(id) : 0;
  const [soloOpen, setSoloOpen] = useState(defaultOpen);

  const open = ctx ? ctx.isOpen(id, index) : soloOpen;
  const setOpen = (next: boolean) => {
    if (ctx) ctx.setOpen(id, next);
    else setSoloOpen(next);
  };
  const isOn = enabled !== false;

  return (
    <div
      className={cn("lp-section-card", !isOn && "opacity-55")}
      data-accent={String(index % 6)}
    >
      <div className="lp-section-toggle">
        <button
          type="button"
          className="lp-section-toggle-main"
          onClick={() => setOpen(!open)}
        >
          <div className="lp-section-meta">
            <span className="lp-section-index">{index + 1}</span>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-slate-900">
                {title}
              </div>
              {subtitle ? (
                <div className="truncate text-[11px] text-slate-500">{subtitle}</div>
              ) : null}
            </div>
          </div>
          {open ? (
            <ChevronUp className="h-4 w-4 shrink-0 text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
          )}
        </button>
        {onEnabledChange ? (
          <div className="lp-section-toggle-controls">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
              {isOn ? "On" : "Off"}
              <Switch checked={isOn} onCheckedChange={onEnabledChange} />
            </div>
          </div>
        ) : null}
      </div>

      {open && isOn ? (
        <div className="border-t border-slate-100 px-3 py-3">{children}</div>
      ) : null}
      {open && !isOn ? (
        <div className="border-t border-slate-100 px-3 py-3 text-xs text-slate-500">
          Section is turned off. Enable the toggle to edit content.
        </div>
      ) : null}
    </div>
  );
}

export function HeadingTagSelect({
  value,
  onChange,
  allowH1 = true,
}: {
  value?: HeadingTag;
  onChange: (tag: HeadingTag) => void;
  allowH1?: boolean;
}) {
  const options = allowH1
    ? HEADING_TAG_OPTIONS
    : HEADING_TAG_OPTIONS.filter((o) => o.value !== "h1");

  return (
    <Select value={value || "p"} onValueChange={(v) => onChange(v as HeadingTag)}>
      <SelectTrigger
        size="sm"
        className="admin-input h-7 min-h-[1.75rem] w-[5.5rem] shrink-0 px-1.5 py-0 text-xs shadow-none"
      >
        <SelectValue placeholder="Tag" />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} className="text-xs">
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function TaggedTextField({
  label,
  value,
  onChange,
  tag,
  onTagChange,
  multiline,
  rows = 2,
  allowH1 = false,
  defaultTag = "p",
  placeholder,
  size = "lg",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  tag?: HeadingTag;
  onTagChange?: (tag: HeadingTag) => void;
  multiline?: boolean;
  rows?: number;
  allowH1?: boolean;
  defaultTag?: HeadingTag;
  placeholder?: string;
  size?: AdminFieldSize;
}) {
  if (multiline) {
    return (
      <AdminField label={label} size="full">
        <div className="flex w-full gap-1.5">
          <AdminTextarea
            rows={rows}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="min-w-0 flex-1"
          />
          {onTagChange && (
            <HeadingTagSelect
              value={tag || defaultTag}
              onChange={onTagChange}
              allowH1={allowH1}
            />
          )}
        </div>
      </AdminField>
    );
  }

  return (
    <AdminField label={label} size={size}>
      <div className="flex items-center gap-1.5">
        <AdminInput
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1"
        />
        {onTagChange && (
          <HeadingTagSelect
            value={tag || defaultTag}
            onChange={onTagChange}
            allowH1={allowH1}
          />
        )}
      </div>
    </AdminField>
  );
}

export function AdminSaveButton({
  saving,
  onClick,
  label = "Save",
}: {
  saving?: boolean;
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      className="lp-btn lp-btn-save"
      disabled={saving}
      onClick={onClick}
    >
      {saving ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Saving
        </>
      ) : (
        <>
          <Save className="h-3.5 w-3.5" />
          {label}
        </>
      )}
    </button>
  );
}

export function AdminAddButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button type="button" className="lp-btn lp-btn-accent" onClick={onClick}>
      {label}
    </button>
  );
}

export function AdminIconButton({
  onClick,
  children,
  variant = "outline",
}: {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "outline" | "ghost" | "destructive";
}) {
  return (
    <Button
      type="button"
      variant={variant}
      size="sm"
      className="h-7 w-7 shrink-0 p-0"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
