"use client";

import { useEffect, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const UNITS = ["Feet", "Meters", "Inch"] as const;
const YES_NO = ["Yes", "No"] as const;

const DEFAULT_SHED_KINDS = [
  "Broiler Farms",
  "Layer Farms",
  "Breeder Farms",
  "Hatcheries",
  "Commercial Poultry Farms",
  "Integrated Poultry Projects",
];

type FormState = {
  name: string;
  phone: string;
  shedLength: string;
  shedWidth: string;
  shedHeight: string;
  shedUnit: (typeof UNITS)[number];
  kindOfShed: string;
  roofPuff: string;
  wallPuff: string;
  civilRequired: string;
  designRequired: string;
  subsidy: string;
};

const INITIAL: FormState = {
  name: "",
  phone: "",
  shedLength: "",
  shedWidth: "",
  shedHeight: "",
  shedUnit: "Feet",
  kindOfShed: "",
  roofPuff: "",
  wallPuff: "",
  civilRequired: "",
  designRequired: "",
  subsidy: "",
};

export function ConsultationModal({
  open,
  onOpenChange,
  shedKinds = [],
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shedKinds?: string[];
}) {
  const kinds = shedKinds.length > 0 ? shedKinds : DEFAULT_SHED_KINDS;
  const [form, setForm] = useState<FormState>(INITIAL);
  const [soilFile, setSoilFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!open) {
      setForm(INITIAL);
      setSoilFile(null);
      setErrors({});
      setDone(false);
      setSubmitError("");
      setSubmitting(false);
    }
  }, [open]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      if (key === "shedLength" || key === "shedWidth" || key === "shedHeight") {
        delete next.shedDimension;
      }
      return next;
    });
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.phone.trim()) next.phone = "Phone number is required";
    else if (!/^[\d\s+\-()]{8,20}$/.test(form.phone.trim())) {
      next.phone = "Enter a valid phone number";
    }
    if (!form.shedLength.trim() || !form.shedWidth.trim() || !form.shedHeight.trim()) {
      next.shedDimension = "Length, width and height are required";
    }
    if (!form.kindOfShed) next.kindOfShed = "Select kind of shed";
    if (!form.roofPuff) next.roofPuff = "Required";
    if (!form.civilRequired) next.civilRequired = "Required";
    if (!form.designRequired) next.designRequired = "Required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const body = new FormData();
      body.set("name", form.name.trim());
      body.set("phone", form.phone.trim());
      body.set(
        "shedDimension",
        `${form.shedLength.trim()} x ${form.shedWidth.trim()} x ${form.shedHeight.trim()}`,
      );
      body.set("shedUnit", form.shedUnit);
      body.set("kindOfShed", form.kindOfShed);
      body.set("roofPuff", form.roofPuff);
      body.set("wallPuff", form.wallPuff || "");
      body.set("civilRequired", form.civilRequired);
      body.set("designRequired", form.designRequired);
      body.set("subsidy", form.subsidy || "");
      if (soilFile) body.set("soilReport", soilFile);

      const res = await fetch("/api/consultation", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit. Please try again.");
      }
      setDone(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        fullscreen
        showCloseButton={false}
        className="lp-consult-dialog"
      >
        <div className="lp-consult">
          <div className="lp-consult-shell">
            <header className="lp-consult-header">
              <div className="lp-consult-header-copy">
                <p className="lp-consult-eyebrow">KEIL</p>
                <DialogHeader className="space-y-1 p-0 text-left">
                  <DialogTitle className="lp-consult-title">
                    Get a Project Consultation
                  </DialogTitle>
                  <DialogDescription className="lp-consult-desc">
                    Share your shed requirements and our engineering team will
                    get back to you shortly.
                  </DialogDescription>
                </DialogHeader>
              </div>
              <button
                type="button"
                className="lp-consult-close"
                onClick={() => onOpenChange(false)}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="lp-consult-body">
              {done ? (
                <div className="lp-consult-success">
                  <h3>Thank you</h3>
                  <p>
                    Your consultation request has been submitted. Our team will
                    contact you soon.
                  </p>
                  <button
                    type="button"
                    className="lp-consult-submit"
                    onClick={() => onOpenChange(false)}
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form className="lp-consult-form" onSubmit={onSubmit} noValidate>
                  <div className="lp-consult-grid">
                    <Field label="Name" required error={errors.name}>
                      <input
                        className="lp-consult-input"
                        value={form.name}
                        onChange={(e) => setField("name", e.target.value)}
                        placeholder="Enter your full name"
                        autoComplete="name"
                      />
                    </Field>

                    <Field label="Phone Number" required error={errors.phone}>
                      <input
                        className="lp-consult-input"
                        value={form.phone}
                        onChange={(e) => setField("phone", e.target.value)}
                        placeholder="Enter your phone number"
                        inputMode="tel"
                        autoComplete="tel"
                      />
                    </Field>

                    <Field
                      label="Shed Dimension"
                      required
                      error={errors.shedDimension}
                      className="lp-consult-span-2"
                    >
                      <div className="lp-consult-dim">
                        <input
                          className="lp-consult-input"
                          value={form.shedLength}
                          onChange={(e) => setField("shedLength", e.target.value)}
                          placeholder="Length"
                          inputMode="decimal"
                          aria-label="Shed length"
                        />
                        <input
                          className="lp-consult-input"
                          value={form.shedWidth}
                          onChange={(e) => setField("shedWidth", e.target.value)}
                          placeholder="Width"
                          inputMode="decimal"
                          aria-label="Shed width"
                        />
                        <input
                          className="lp-consult-input"
                          value={form.shedHeight}
                          onChange={(e) => setField("shedHeight", e.target.value)}
                          placeholder="Height"
                          inputMode="decimal"
                          aria-label="Shed height"
                        />
                        <select
                          className="lp-consult-select"
                          value={form.shedUnit}
                          onChange={(e) =>
                            setField("shedUnit", e.target.value as FormState["shedUnit"])
                          }
                          aria-label="Dimension unit"
                        >
                          {UNITS.map((u) => (
                            <option key={u} value={u}>
                              {u}
                            </option>
                          ))}
                        </select>
                      </div>
                    </Field>

                    <Field label="Kind of Shed" required error={errors.kindOfShed}>
                      <select
                        className="lp-consult-select"
                        value={form.kindOfShed}
                        onChange={(e) => setField("kindOfShed", e.target.value)}
                      >
                        <option value="">Select kind of shed</option>
                        {kinds.map((k) => (
                          <option key={k} value={k}>
                            {k}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <YesNo
                      label="Roof — PUF"
                      name="roofPuff"
                      required
                      value={form.roofPuff}
                      error={errors.roofPuff}
                      onChange={(v) => setField("roofPuff", v)}
                    />
                    <YesNo
                      label="Wall — PUF"
                      name="wallPuff"
                      value={form.wallPuff}
                      onChange={(v) => setField("wallPuff", v)}
                    />
                    <YesNo
                      label="Civil — Required"
                      name="civilRequired"
                      required
                      value={form.civilRequired}
                      error={errors.civilRequired}
                      onChange={(v) => setField("civilRequired", v)}
                    />
                    <YesNo
                      label="Design — Required"
                      name="designRequired"
                      required
                      value={form.designRequired}
                      error={errors.designRequired}
                      onChange={(v) => setField("designRequired", v)}
                    />
                    <YesNo
                      label="Subsidy"
                      name="subsidy"
                      value={form.subsidy}
                      onChange={(v) => setField("subsidy", v)}
                    />

                    <Field label="Soil Report" className="lp-consult-span-2">
                      <label className="lp-consult-upload">
                        <Upload className="h-4 w-4 shrink-0" />
                        <span>
                          {soilFile
                            ? soilFile.name
                            : "Choose a soil report file (PDF or image)"}
                        </span>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          className="sr-only"
                          onChange={(e) => setSoilFile(e.target.files?.[0] || null)}
                        />
                      </label>
                    </Field>
                  </div>

                  {submitError ? (
                    <p className="lp-consult-error-banner">{submitError}</p>
                  ) : null}

                  <div className="lp-consult-actions">
                    <button
                      type="button"
                      className="lp-consult-cancel"
                      onClick={() => onOpenChange(false)}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="lp-consult-submit"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        "Submit Consultation"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  required,
  error,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`lp-consult-field ${className}`.trim()}>
      <span className="lp-consult-label">
        {label}
        {required ? <span aria-hidden> *</span> : null}
      </span>
      {children}
      {error ? <span className="lp-consult-error">{error}</span> : null}
    </label>
  );
}

function YesNo({
  label,
  name,
  required,
  value,
  error,
  onChange,
}: {
  label: string;
  name: string;
  required?: boolean;
  value: string;
  error?: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset className="lp-consult-field">
      <legend className="lp-consult-label">
        {label}
        {required ? <span aria-hidden> *</span> : null}
      </legend>
      <div className="lp-consult-radios" role="radiogroup" aria-label={label}>
        {YES_NO.map((opt) => (
          <label key={opt} className="lp-consult-radio">
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              onChange={() => onChange(opt)}
            />
            <span className="lp-consult-radio-mark" aria-hidden />
            <span className="lp-consult-radio-text">{opt}</span>
          </label>
        ))}
      </div>
      {error ? <span className="lp-consult-error">{error}</span> : null}
    </fieldset>
  );
}
