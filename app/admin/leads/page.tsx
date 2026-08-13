"use client";

import { useEffect, useState } from "react";
import { AdminShell, AdminCard } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Enquiry, LeadActivity } from "@/types";
import { Loader2, Mail, Phone, Trash2 } from "lucide-react";
import { toast } from "sonner";

const STAGES = ["new", "contacted", "qualified", "proposal", "won", "lost"] as const;
const PRIORITIES = ["low", "medium", "high"] as const;

export default function LeadsPage() {
  const [leads, setLeads] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [note, setNote] = useState("");
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");

  const load = () => {
    fetch("/api/admin/leads")
      .then((r) => r.json())
      .then(setLeads)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    fetch(`/api/admin/leads/${selectedId}/activities`)
      .then((r) => r.json())
      .then(setActivities);
  }, [selectedId]);

  const selected = leads.find((l) => l.id === selectedId);

  const filtered = leads.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      l.name.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      (l.company || "").toLowerCase().includes(q);
    const matchStage = stageFilter === "all" || (l.stage || "new") === stageFilter;
    return matchSearch && matchStage;
  });

  const updateLead = async (id: string, patch: Partial<Enquiry>) => {
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      toast.error("Update failed");
      return;
    }
    load();
    if (selectedId === id) {
      const updated = await res.json();
      setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)));
    }
  };

  const addNote = async () => {
    if (!selectedId || !note.trim()) return;
    const res = await fetch(`/api/admin/leads/${selectedId}/activities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activityType: "note", content: note }),
    });
    if (res.ok) {
      setNote("");
      const acts = await fetch(`/api/admin/leads/${selectedId}/activities`).then((r) => r.json());
      setActivities(acts);
      toast.success("Note added");
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
    if (selectedId === id) setSelectedId(null);
    load();
  };

  if (loading) {
    return (
      <AdminShell title="Leads & CRM">
        <Loader2 className="h-4 w-4 animate-spin" />
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Leads & CRM" description="Manage enquiries and follow-ups.">
      <div className="grid gap-4 lg:grid-cols-5">
        <AdminCard className="lg:col-span-2" title={`Leads (${filtered.length})`}>
          <div className="mb-3 flex gap-2">
            <Input
              className="h-8 text-xs"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="h-8 w-28 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All stages</SelectItem>
                {STAGES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="max-h-[520px] space-y-1 overflow-y-auto">
            {filtered.map((lead) => (
              <button
                key={lead.id}
                type="button"
                onClick={() => setSelectedId(lead.id)}
                className={`w-full rounded border px-2 py-2 text-left text-xs transition-colors ${
                  selectedId === lead.id
                    ? "border-indigo-300 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-950"
                    : "border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{lead.name}</span>
                  <Badge variant="outline" className="text-[10px] capitalize">
                    {lead.stage || "new"}
                  </Badge>
                </div>
                <p className="text-slate-500">{lead.email}</p>
              </button>
            ))}
          </div>
        </AdminCard>

        <AdminCard className="lg:col-span-3" title={selected ? selected.name : "Lead details"}>
          {!selected ? (
            <p className="text-xs text-slate-500">Select a lead to view details.</p>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Select
                  value={selected.stage || "new"}
                  onValueChange={(v) => updateLead(selected.id, { stage: v as Enquiry["stage"] })}
                >
                  <SelectTrigger className="h-8 w-32 text-xs">
                    <SelectValue placeholder="Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {STAGES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selected.priority || "medium"}
                  onValueChange={(v) => updateLead(selected.id, { priority: v as Enquiry["priority"] })}
                >
                  <SelectTrigger className="h-8 w-28 text-xs">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-8 text-xs"
                  onClick={() => deleteLead(selected.id)}
                >
                  <Trash2 className="mr-1 h-3 w-3" /> Delete
                </Button>
              </div>

              <div className="grid gap-2 text-xs md:grid-cols-2">
                <p className="flex items-center gap-1"><Mail className="h-3 w-3" /> {selected.email}</p>
                {selected.phone && <p className="flex items-center gap-1"><Phone className="h-3 w-3" /> {selected.phone}</p>}
                {selected.company && <p>Company: {selected.company}</p>}
                {selected.productName && <p>Product: {selected.productName}</p>}
              </div>
              {selected.message && (
                <p className="rounded bg-slate-50 p-2 text-xs dark:bg-slate-900">{selected.message}</p>
              )}

              <div className="space-y-2">
                <Label className="text-xs">Add note</Label>
                <Textarea className="min-h-[60px] text-xs" value={note} onChange={(e) => setNote(e.target.value)} />
                <Button size="sm" className="h-8 text-xs" onClick={addNote}>Add note</Button>
              </div>

              <div>
                <Label className="text-xs">Activity timeline</Label>
                <div className="mt-2 max-h-40 space-y-2 overflow-y-auto">
                  {activities.map((a) => (
                    <div key={a.id} className="rounded border border-slate-100 px-2 py-1 text-xs dark:border-slate-800">
                      <span className="font-medium capitalize">{a.activityType.replace("_", " ")}</span>
                      <span className="text-slate-400"> · {new Date(a.createdAt).toLocaleString()}</span>
                      <p>{a.content}</p>
                    </div>
                  ))}
                  {activities.length === 0 && (
                    <p className="text-xs text-slate-500">No activity yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </AdminCard>
      </div>
    </AdminShell>
  );
}
