"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  IconPlus, IconTrash, IconArrowUp, IconArrowDown, IconArrowLeft, IconArrowRight,
  IconRefresh, IconDownload, IconFileDescription, IconChevronDown, IconChevronRight,
} from "@tabler/icons-react";
import { Button } from "@/components/button";
import { IconButton } from "@/components/icon-button";
import { TabGroup, TabGroupItem } from "@/components/tab-group";
import { Avatar, AvatarFallback } from "@/components/avatar";
import { Checkbox } from "@/components/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Modal } from "@/components/modal";
import { cn } from "@/lib/utils";
import "../app/globals.css";

/* ─── STAGES ─── */
const STAGES: Record<string, { label: string; color: string }> = {
  stabilize:  { label: "Stabilize",  color: "hsl(38 100% 50%)" },
  modernize:  { label: "Modernize",  color: "hsl(178 91% 34%)" },
  productize: { label: "Productize", color: "hsl(160 100% 12%)" },
  all:        { label: "All Stages", color: "hsl(47 8% 81%)" },
};

/* ─── JOB DESCRIPTIONS ─── */
const JDS: Record<string, any> = {
  design: {
    title: "Experience Systems Designer", reports: "Matthew Slaughter",
    what: "Design in this organization is a systems function, not a production function. AI agents can generate UI at a speed no designer can match — that makes the designer's most important job harder, not obsolete.",
    responsibilities: ["Forward-deploy to build ministry context into the system.","Architect and evolve the Gloo design system.","Define experience frameworks for each platform surface.","Curate and govern AI-generated output.","Partner with engineering on system executability."],
    notThis: "A Figma production role. A screen handoff function. A reactive support role.",
    looking: ["6+ years in product design with design systems experience","Strong systems-thinking","Experience in platform environments","Genuine interest in ministry leaders","Willingness to go on-site","Comfort leveraging AI tools"],
    success: ["Every surface feels coherent and trustworthy","New engineers produce something that looks designed","Ministry leaders feel comfortable immediately","Every forward deployment refines the design system"],
    flourishing: "Design that respects their attention and gets out of their way is not just good UX. It is an act of service.",
  },
  appEng: {
    title: "Application Layer Engineer", reports: "Casey",
    what: "This is the layer customers touch. You build and maintain the unified surface that Ministry Chat and Polymer are becoming.",
    responsibilities: ["Build and evolve the unified customer-facing platform.","Own the platform architecture at the application layer.","Forward-deploy with an opinionated architecture.","Surface complexity as simplicity.","Own application-level performance, reliability, and security.","Close the loop."],
    notThis: "A feature factory. A custom app developer. Someone who stays in the codebase and never talks to a customer.",
    looking: ["5+ years in product engineering","Strong platform thinking","Experience building role-based interfaces at scale","Comfort going on-site with enterprise customers","Ability to work on top of an agentic platform","Judgment to know when a request should become a platform capability"],
    success: ["Platform is coherent regardless of customer","Time-to-value is weeks, not quarters","Every deployment produces platform capabilities","Custom one-off builds decrease over time","Engineers onboard and ship confidently within days"],
    flourishing: "When you build the platform well, every Platform Solution Engineer on top of it moves faster.",
  },
  platformEng: {
    title: "Platform Solution Engineer", reports: "Casey",
    what: "Platform Solution Engineers are the sharp end of forward deployment. You go on-site, embed with staff, feel the friction firsthand.",
    responsibilities: ["Forward-deploy as primary work mode.","Configure and deploy Ministry Chat for specific customers.","Build and deploy customer-facing agents.","Serve as the interface between customer need and platform capability.","Close the loop.","Train and support ministry staff."],
    notThis: "A developer who takes requirements at face value. Someone who builds custom apps instead of platform configurations.",
    looking: ["Background in ministry operations is a strong differentiator","3+ years in technical customer-facing work","Comfort going on-site","Technical fluency to configure and troubleshoot","Genuine passion for the mission","Strong communication"],
    success: ["Customers forget they're using AI","Time-to-value is days, not months","Agent deployments work the first time","Every deployment surfaces insights","Ministry staff spend less time behind screens"],
    flourishing: "You are the closest person on this team to the actual mission. Do not lose sight of that.",
  },
  services: {
    title: "Shared Solutions Engineer", reports: "Brian Johnson",
    what: "This is the intelligence and reusability layer — built once, used everywhere.",
    responsibilities: ["Build and evolve the agent orchestration layer.","Forward-deploy to identify shared workflow patterns.","Define and build skills as reusable infrastructure.","Build and maintain integrations.","Design and enforce the trust fabric.","Define workflow templates."],
    notThis: "An integration plumber. A prompt engineer. A feature developer building one-off solutions.",
    looking: ["7+ years in platform engineering or distributed systems","Deep experience designing reusable service layers","Familiarity with agentic orchestration frameworks","Strong opinions about state management","Multi-tenant integration infrastructure experience","Discipline to bring learnings back"],
    success: ["New integrations take days, not months","Skills versioned and deployed without regression","Agent workflows complete reliably","Trust fabric catches violations before incidents","Every deployment produces new skills or templates"],
    flourishing: "Every hour of manual work you automate is an hour a pastor spends with someone who needed them.",
  },
  infra: {
    title: "Infrastructure & Data Engineer", reports: "Daniel Wilson",
    what: "Everything runs on this layer. The goal: organizational context makes agents wise instead of generic.",
    responsibilities: ["Build and steward the Gloo Brain.","Forward-deploy to map data reality.","Design for independent data residency.","Build the auditability and traceability layer.","Own data normalization and the golden standard.","Design the continuous improvement loop."],
    notThis: "A data pipeline engineer. A DBA. A passive infrastructure maintainer.",
    looking: ["7+ years in data engineering or ML infrastructure","Deep experience with knowledge graph or RAG architectures","Strong opinions about data modeling","Multi-tenant data residency experience","Comfort building feedback loops","Willingness to go on-site"],
    success: ["Every new customer adds signal","Agents have context without manual curation","Data residency never blocks a deal","New orgs modeled within hours","System knows what it knows and gets better"],
    flourishing: "Build it like it matters, because it does.",
  },
  product: {
    title: "Outcome Product Lead", reports: "Josh / Leadership",
    what: "Execution is no longer the bottleneck. Product judgment is the rarest and most expensive resource in the system.",
    responsibilities: ["Forward-deploy as primary research method.","Define outcomes, not features.","Prioritize ruthlessly and say no decisively.","Design rapid experiments to validate assumptions.","Sequence the roadmap across layers."],
    notThis: "A backlog administrator. A requirements writer. A coordination layer.",
    looking: ["7+ years in product leadership","Demonstrated ability to define outcomes and resist scope creep","Strategic thinking across sprints and 18-month vision","Comfort with enterprise customers on-site","Deep comfort with faith-based tech market","Ability to say no with clarity"],
    success: ["Roadmap understood without kickoff meetings","Every feature traces to customer observation","Platform compounds from right sequence","Engineering time never wasted on invalidatable work"],
    flourishing: "Velocity is not inherently good. Product clarity honors the time of the humans on the other end.",
  },
};

const layerDescriptions: Record<string, any> = {
  design: { purpose: "Design is a systems function, not a production function.", activities: ["Forward-deploy into customer orgs","Translate observations into design constraints","Architect the Gloo design system","Define experience frameworks","Curate AI-generated output","Partner with engineering"], outputs: ["Gloo design system","Experience frameworks","Design constraints & tokens","Field research","AI output governance"], notThis: "A Figma production role. A screen handoff function.", flourishing: "Design that respects attention and gets out of the way is an act of service." },
  appEng: { purpose: "Application Layer Engineers own the unified platform surface.", activities: ["Build the unified customer-facing platform","Own platform architecture","Forward-deploy with opinionated architecture","Surface complexity as simplicity","Own performance & security","Close the loop"], outputs: ["Unified platform","Role-configured dashboards","Application architecture","White-labeled surfaces","Performance & reliability"], notThis: "A feature factory. A custom app developer.", flourishing: "When you build the platform well, every PSE moves faster." },
  platformEng: { purpose: "Platform Solution Engineers are the sharp end of forward deployment.", activities: ["Forward-deploy as primary work mode","Configure and deploy Ministry Chat","Build customer-facing agents","Interface between customer and platform","Close the loop","Train ministry staff"], outputs: ["Customer deployments","Configured agents","Onboarding & training","Deployment intelligence","Platform gap reports"], notThis: "A developer who takes requirements at face value.", flourishing: "You are closest to the actual mission." },
  services: { purpose: "The intelligence and reusability layer — built once, used everywhere.", activities: ["Build agent orchestration layer","Identify shared workflow patterns","Build skills as reusable infrastructure","Build and maintain integrations","Design the trust fabric","Define workflow templates"], outputs: ["Agent orchestration","Skills library","Integration registry","Trust fabric","Workflow templates","State management"], notThis: "An integration plumber. A prompt engineer.", flourishing: "Workflows you build free ministry staff from administrative friction." },
  infra: { purpose: "Everything runs on this layer. Context makes agents wise instead of generic.", activities: ["Build the Gloo Brain","Map data reality on-site","Design data residency","Build auditability layer","Own data normalization","Design continuous improvement loop"], outputs: ["Gloo Brain","Data residency architecture","Auditability systems","Data normalization","Feedback loop","Cost analytics"], notThis: "A data pipeline engineer. A DBA.", flourishing: "Build it like it matters, because it does." },
  product: { purpose: "Product judgment is the rarest and most expensive resource in the system.", activities: ["Forward-deploy as research method","Define outcomes, not features","Prioritize ruthlessly","Design rapid experiments","Sequence roadmap across layers"], outputs: ["Prioritized roadmap","Outcome statements","Experiment designs","Deployment intelligence","Dependency maps"], notThis: "A backlog administrator. A requirements writer.", flourishing: "Velocity is not inherently good. Product clarity honors the time of the humans on the other end." },
};

/* ─── PEOPLE REGISTRY TYPE ─── */
// Stored as org.people: Record<string, PersonMeta>
type PersonMeta = {
  designations?: string[];      // e.g. ["engineering_manager"]
  engineeringManager?: string;  // name of assigned EM
};

const initData = {
  people: {} as Record<string, PersonMeta>,
  layers: [
    { id: "dataAnalytics", label: "Data & Analytics", sublabel: "Reporting · BI · Insights", lead: { name: "TBD", role: "Data & Analytics Lead" }, accent: "hsl(222 97% 55%)" },
    { id: "enterpriseSys", label: "Enterprise Systems", sublabel: "ERP · HRIS · Finance · Internal Tools", lead: { name: "TBD", role: "Enterprise Systems Lead" }, accent: "hsl(250 100% 69%)" },
    { id: "coreInfra", label: "Core Infrastructure", sublabel: "Cloud · DevOps · Networking", lead: { name: "TBD", role: "Core Infrastructure Lead" }, accent: "hsl(168 100% 53%)" },
    { id: "security", label: "Security", sublabel: "AppSec · Compliance · Risk", lead: { name: "TBD", role: "Security Lead" }, accent: "hsl(38 100% 50%)" },
    { id: "helpDesk", label: "Help Desk", sublabel: "Support · Ticketing · Escalation", lead: { name: "TBD", role: "Help Desk Lead" }, accent: "hsl(47 8% 81%)" },
    { id: "product", label: "Product", sublabel: "Outcomes · Roadmap · Research", lead: { name: "TBD", role: "Outcome Product Lead" }, accent: "hsl(0 100% 75%)" },
    { id: "design", label: "Design", sublabel: "Experience Systems · Design System", lead: { name: "Matthew Slaughter", role: "Head of Design" }, accent: "hsl(178 91% 34%)" },
    { id: "platformEng", label: "Platform Solution Engineer", sublabel: "Forward Deployment · Config · Agents", lead: { name: "Casey", role: "Application Layer Lead" }, accent: "hsl(193 87% 40%)" },
    { id: "appEng", label: "Application Layer Engineer", sublabel: "Platform Architecture · Unified Surface", lead: { name: "Casey", role: "Application Layer Lead" }, accent: "hsl(188 100% 71%)" },
    { id: "services", label: "Shared Solutions", sublabel: "Agent Orchestration · Skills · Trust Fabric", lead: { name: "Brian Johnson", role: "Platform Services Lead" }, accent: "hsl(157 94% 31%)" },
    { id: "infra", label: "Infrastructure & Data", sublabel: "Gloo Brain · Data · Auditability", lead: { name: "Daniel Wilson", role: "Head of AI Engineering" }, accent: "hsl(191 100% 13%)" },
  ],
  products: [
    { id: "church", name: "Church", type: "church", productLead: "TBD", cells: { product: [{ name: "Outcome Product Lead", stage: "all" }], design: [{ name: "Experience Systems Designer", stage: "all" }], appEng: [{ name: "App Layer Eng 1", stage: "modernize" },{ name: "App Layer Eng 2", stage: "productize" }], platformEng: [{ name: "PSE 1", stage: "stabilize" },{ name: "PSE 2", stage: "stabilize" },{ name: "PSE 3", stage: "modernize" }], services: [{ name: "Shared Solutions Eng 1", stage: "modernize" },{ name: "Shared Solutions Eng 2", stage: "productize" }], infra: [{ name: "Infra Eng 1", stage: "stabilize" },{ name: "Infra Eng 2", stage: "modernize" },{ name: "Infra Eng 3", stage: "productize" }], dataAnalytics: [{ name: "Data Analyst 1", stage: "all" }], enterpriseSys: [{ name: "Enterprise Sys Eng 1", stage: "stabilize" }], coreInfra: [{ name: "Core Infra Eng 1", stage: "all" }], security: [{ name: "Security Eng 1", stage: "all" }], helpDesk: [{ name: "Help Desk 1", stage: "stabilize" }] }},
    { id: "ag", name: "AG", type: "360", productLead: "TBD", cells: { product: [{ name: "Outcome Product Lead", stage: "all" }], design: [{ name: "Experience Systems Designer", stage: "all" }], appEng: [{ name: "App Layer Eng 1", stage: "modernize" }], platformEng: [{ name: "PSE 4", stage: "stabilize" },{ name: "PSE 5", stage: "stabilize" }], services: [{ name: "Shared Solutions Eng 1", stage: "modernize" },{ name: "Shared Solutions Eng 2", stage: "modernize" }], infra: [{ name: "Infra Eng 1", stage: "modernize" }], dataAnalytics: [{ name: "Data Analyst 1", stage: "all" }], enterpriseSys: [{ name: "Enterprise Sys Eng 1", stage: "stabilize" }], coreInfra: [{ name: "Core Infra Eng 1", stage: "all" }], security: [{ name: "Security Eng 1", stage: "all" }], helpDesk: [{ name: "Help Desk 1", stage: "stabilize" }] }},
    { id: "eten", name: "ETEN", type: "360", productLead: "TBD", cells: { product: [{ name: "Outcome Product Lead", stage: "all" }], design: [{ name: "Experience Systems Designer", stage: "all" }], appEng: [{ name: "App Layer Eng 1", stage: "modernize" }], platformEng: [{ name: "PSE 6", stage: "stabilize" }], services: [{ name: "Shared Solutions Eng 1", stage: "stabilize" }], infra: [{ name: "Infra Eng 1", stage: "stabilize" }], dataAnalytics: [{ name: "Data Analyst 1", stage: "all" }], enterpriseSys: [{ name: "Enterprise Sys Eng 1", stage: "stabilize" }], coreInfra: [{ name: "Core Infra Eng 1", stage: "all" }], security: [{ name: "Security Eng 1", stage: "all" }], helpDesk: [{ name: "Help Desk 1", stage: "stabilize" }] }},
    { id: "iv", name: "IV", type: "360", productLead: "TBD", cells: { product: [{ name: "Outcome Product Lead", stage: "all" }], design: [{ name: "Experience Systems Designer", stage: "all" }], appEng: [{ name: "App Layer Eng 1", stage: "modernize" }], platformEng: [{ name: "PSE 7", stage: "modernize" },{ name: "PSE 8", stage: "modernize" }], services: [{ name: "Shared Solutions Eng 1", stage: "modernize" }], infra: [{ name: "Infra Eng 1", stage: "modernize" }], dataAnalytics: [{ name: "Data Analyst 1", stage: "all" }], enterpriseSys: [{ name: "Enterprise Sys Eng 1", stage: "stabilize" }], coreInfra: [{ name: "Core Infra Eng 1", stage: "all" }], security: [{ name: "Security Eng 1", stage: "all" }], helpDesk: [{ name: "Help Desk 1", stage: "stabilize" }] }},
    { id: "abs", name: "ABS", type: "360", productLead: "TBD", cells: { product: [{ name: "Outcome Product Lead", stage: "all" }], design: [{ name: "Experience Systems Designer", stage: "all" }], appEng: [{ name: "App Layer Eng 1", stage: "modernize" }], platformEng: [{ name: "PSE 9", stage: "modernize" }], services: [{ name: "Shared Solutions Eng 1", stage: "modernize" }], infra: [{ name: "Infra Eng 1", stage: "modernize" }], dataAnalytics: [{ name: "Data Analyst 1", stage: "all" }], enterpriseSys: [{ name: "Enterprise Sys Eng 1", stage: "stabilize" }], coreInfra: [{ name: "Core Infra Eng 1", stage: "all" }], security: [{ name: "Security Eng 1", stage: "all" }], helpDesk: [{ name: "Help Desk 1", stage: "stabilize" }] }},
  ],
  innovation: ["Matt Michel"],
  innovationLead: "Matt",
  executives: [
    { id: "exec1", name: "Justin", role: "IT & Operations Leader", accent: "hsl(222 97% 55%)", layers: ["dataAnalytics","enterpriseSys","coreInfra","security","helpDesk"] },
    { id: "exec2", name: "TBD", role: "Product Leader", accent: "hsl(0 100% 75%)", layers: ["product"] },
    { id: "exec3", name: "Daniel", role: "Engineering Leader", accent: "hsl(178 91% 34%)", layers: ["design","platformEng","appEng","services","infra"] },
  ],
};

const typeConfig: Record<string, { badgeColor: string; label: string; headerClass: string; bgClass: string; textClass: string }> = {
  church: { badgeColor: "hsl(222 97% 55%)", label: "Church", headerClass: "product-header church", bgClass: "bg-[hsl(202_100%_90%)]", textClass: "text-[hsl(238_48%_22%)]" },
  "360":  { badgeColor: "hsl(38 100% 50%)", label: "360°",   headerClass: "product-header type-360", bgClass: "bg-[hsl(50_100%_94%)]", textClass: "text-[hsl(38_100%_50%)]" },
  gloo:   { badgeColor: "hsl(178 91% 34%)", label: "Gloo",   headerClass: "product-header gloo", bgClass: "bg-[hsl(169_82%_90%)]", textClass: "text-[hsl(191_100%_13%)]" },
};

function uid() { return Math.random().toString(36).slice(2, 8); }

/* ─── COLOR MIGRATION: hex → Gloo HSL tokens ─── */
const COLOR_MIGRATION: Record<string, string> = {
  "#3b82f6": "hsl(222 97% 55%)",
  "#8b5cf6": "hsl(250 100% 69%)",
  "#10b981": "hsl(168 100% 53%)",
  "#f59e0b": "hsl(38 100% 50%)",
  "#6b7280": "hsl(47 8% 81%)",
  "#ec4899": "hsl(0 100% 75%)",
  "#f97316": "hsl(178 91% 34%)",
  "#0ea5e9": "hsl(193 87% 40%)",
  "#6366f1": "hsl(178 91% 34%)",
  "#22c55e": "hsl(157 94% 31%)",
  "#a855f7": "hsl(191 100% 13%)",
};

function migrateColors(data: any): any {
  if (!data) return data;
  const migrate = (color: string) => COLOR_MIGRATION[color] || color;
  if (data.layers) {
    data.layers = data.layers.map((l: any) => ({ ...l, accent: migrate(l.accent) }));
  }
  if (data.executives) {
    data.executives = data.executives.map((e: any) => ({ ...e, accent: migrate(e.accent) }));
  }
  return data;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/* ── Inline editable text ── */
function ET({ value, onChange, style }: { value: string; onChange: (v: string) => void; style?: React.CSSProperties }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (editing && ref.current) ref.current.focus(); }, [editing]);
  useEffect(() => { setDraft(value); }, [value]);
  const commit = () => { setEditing(false); if (draft.trim()) onChange(draft.trim()); else setDraft(value); };
  if (editing) return (
    <input ref={ref} value={draft} onChange={e => setDraft(e.target.value)} onBlur={commit}
      onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setDraft(value); setEditing(false); } }}
      className="bg-gray-100 border border-gray-200 rounded px-2 py-0.5 text-inherit font-inherit text-gray-900 outline-none w-full"
      style={style} />
  );
  return (
    <span onClick={() => setEditing(true)} className="cursor-text border-b border-dashed border-gray-300" style={style}>{value || "—"}</span>
  );
}

/* ── Person chip ── */
function PersonChip({ name, stage, onRename, onStageChange, onDelete, onJD, dimmed, isEM, emName, onEMClick }: any) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (editing && ref.current) ref.current.focus(); }, [editing]);
  const commit = () => { setEditing(false); if (draft.trim() && draft.trim() !== name) onRename(draft.trim()); else setDraft(name); };

  return (
    <div className="person-chip" style={{ opacity: dimmed ? 0.25 : 1 }}>
      <div className={`stage-dot ${stage}`} />
      <Avatar className="size-5 shrink-0">
        <AvatarFallback seed={name} className="text-[6px] font-bold">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-0">
        <div className="flex items-center gap-1">
          {editing ? (
            <input ref={ref} value={draft} onChange={e => setDraft(e.target.value)} onBlur={commit}
              onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setDraft(name); setEditing(false); } }}
              className="bg-transparent border-none text-xs text-gray-900 outline-none font-medium"
              style={{ width: Math.max(60, draft.length * 7) }} />
          ) : (
            <span onClick={() => setEditing(true)} className="cursor-text text-xs text-gray-700 font-medium">{name}</span>
          )}
          {isEM && (
            <span className="rounded px-1 py-px text-[8px] font-bold bg-indigo-100 text-indigo-700 leading-none whitespace-nowrap">EM</span>
          )}
        </div>
        {emName && (
          <span className="text-[9px] text-indigo-500 leading-tight">↳ EM: {emName}</span>
        )}
      </div>
      <div className="chip-actions">
        {onEMClick && (
          <button type="button" onClick={onEMClick} title="Engineering Manager" aria-label="Engineering Manager"
            className={cn("flex size-4 items-center justify-center rounded transition-colors", isEM ? "text-indigo-600 hover:text-indigo-800" : "text-gray-400 hover:text-indigo-600")}>
            <IconFileDescription size={11} />
          </button>
        )}
        {onJD && (
          <button type="button" onClick={onJD} title="Job Description" aria-label="Job Description"
            className="flex size-4 items-center justify-center rounded text-gray-400 hover:text-gray-600 transition-colors">
            <IconFileDescription size={11} />
          </button>
        )}
        <button type="button" title="Cycle stage" aria-label="Cycle stage"
          onClick={() => { const order = ["stabilize","modernize","productize","all"]; onStageChange(order[(order.indexOf(stage) + 1) % order.length]); }}
          className="flex size-4 items-center justify-center rounded text-gray-400 hover:text-gray-600 transition-colors">
          <IconRefresh size={11} />
        </button>
        <button type="button" onClick={onDelete} title="Remove" aria-label="Remove"
          className="flex size-4 items-center justify-center rounded text-gray-400 hover:text-red-500 transition-colors">
          <IconTrash size={11} />
        </button>
      </div>
    </div>
  );
}

/* ── JD Modal Content ── */
function JDModalContent({ layerId, layer }: any) {
  const jd = JDS[layerId];
  if (!jd) return null;
  return (
    <div className="animate-in">
      <div style={{ borderLeft: `4px solid ${layer.accent}`, paddingLeft: 16, marginBottom: 20 }}>
        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-0.5">{layer.label}</p>
        <h3 className="text-xl font-bold text-gray-900 mb-1">{jd.title}</h3>
        <p className="text-sm text-gray-500">Reports to {jd.reports}</p>
      </div>
      <p className="text-sm text-gray-800 leading-relaxed mb-4">{jd.what}</p>
      <p className="text-[11px] font-bold text-gray-900 uppercase tracking-wide mb-2">Responsibilities</p>
      {jd.responsibilities.map((r: string, i: number) => (
        <div key={i} className="flex gap-2 mb-2 items-start">
          <span style={{ color: layer.accent, fontSize: 10, marginTop: 4 }}>●</span>
          <p className="text-sm leading-relaxed text-gray-500">{r}</p>
        </div>
      ))}
      <Separator className="my-4" />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide mb-2">Looking For</p>
          {jd.looking.map((l: string, i: number) => (
            <div key={i} className="flex gap-1.5 mb-1.5 items-start">
              <span style={{ color: "hsl(178 91% 34%)", fontSize: 8, marginTop: 5 }}>◆</span>
              <p className="text-xs text-gray-500 leading-relaxed">{l}</p>
            </div>
          ))}
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide mb-2">Success Looks Like</p>
          {jd.success.map((s: string, i: number) => (
            <div key={i} className="flex gap-1.5 mb-1.5 items-start">
              <span style={{ color: "hsl(157 94% 31%)", fontSize: 8, marginTop: 5 }}>◆</span>
              <p className="text-xs text-gray-500 leading-relaxed">{s}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl bg-[hsl(0_90%_94%)] border border-[hsl(0_90%_94%)] px-4 py-3 mt-4">
        <p className="text-[10px] font-bold text-red-600 uppercase tracking-wide mb-1">Not This</p>
        <p className="text-sm text-gray-500 italic">{jd.notThis}</p>
      </div>
      <div className="rounded-xl border border-[hsl(169_82%_90%)] px-4 py-3 mt-3" style={{ background: "linear-gradient(135deg, hsl(169 82% 90%), hsl(169 82% 90% / 0.5))" }}>
        <p className="text-[10px] font-bold text-teal-600 uppercase tracking-wide mb-1">On Human Flourishing</p>
        <p className="text-sm text-gray-500">{jd.flourishing}</p>
      </div>
    </div>
  );
}

/* ── Layer View ── */
function LayerView({ layers }: any) {
  return (
    <div className="flex flex-col gap-4">
      {layers.map((layer: any) => {
        const desc = layerDescriptions[layer.id];
        if (!desc) return null;
        return (
          <div key={layer.id} className="glass-card animate-in" style={{ padding: 24, overflow: "hidden" }}>
            <div style={{ borderLeft: `4px solid ${layer.accent}`, paddingLeft: 16, marginBottom: 16 }}>
              <p className="text-xl font-bold text-gray-900">{layer.label}</p>
              <p className="text-xs text-gray-400 font-mono">{layer.sublabel}</p>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">{desc.purpose}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide mb-2" style={{ color: layer.accent }}>What Happens Here</p>
                {desc.activities.map((a: string, i: number) => (
                  <div key={i} className="flex gap-2 mb-1.5 items-start">
                    <span style={{ color: layer.accent, fontSize: 10, marginTop: 3 }}>▸</span>
                    <p className="text-sm text-gray-500">{a}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide mb-2" style={{ color: layer.accent }}>Key Outputs</p>
                  <div className="flex flex-wrap gap-1">
                    {desc.outputs.map((o: string, i: number) => (
                      <span key={i} className="rounded px-2 py-0.5 text-xs font-medium bg-[hsl(169_82%_90%)] text-[hsl(191_100%_13%)]">{o}</span>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg bg-[hsl(0_90%_94%)] px-3 py-2">
                  <p className="text-[10px] font-bold text-red-600 mb-1">NOT THIS</p>
                  <p className="text-xs text-gray-500 italic">{desc.notThis}</p>
                </div>
                <div className="rounded-lg px-3 py-2" style={{ background: "linear-gradient(135deg, hsl(169 82% 90%), hsl(169 82% 90% / 0.5))" }}>
                  <p className="text-[10px] font-bold text-teal-600 mb-1">FLOURISHING</p>
                  <p className="text-xs text-gray-500">{desc.flourishing}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════ MAIN ═══════════════ */
export default function MatrixOrg() {
  const [org, setOrg] = useState<any>(initData);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stageFilter, setStageFilter] = useState("all");
  const [view, setView] = useState("people");
  const [jdOpen, setJdOpen] = useState<any>(null);
  const [assignOpen, setAssignOpen] = useState<any>(null);
  const [addColOpen, setAddColOpen] = useState(false);
  const [addRowOpen, setAddRowOpen] = useState(false);
  const [addRoleTarget, setAddRoleTarget] = useState<any>(null);
  const [collapsedExecs, setCollapsedExecs] = useState(new Set<string>());
  const [emModalPerson, setEmModalPerson] = useState<string | null>(null);

  const convexData = useQuery(api.orgData.get, { key: "default" });
  const saveToConvex = useMutation(api.orgData.save);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (loaded) return;
    if (convexData === undefined) return;
    if (convexData && convexData.data) { try { setOrg(migrateColors(JSON.parse(convexData.data))); } catch {} }
    setLoaded(true);
  }, [convexData, loaded]);

  useEffect(() => {
    if (!loaded) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      setSaving(true);
      saveToConvex({ key: "default", data: JSON.stringify(org) })
        .then(() => { setSaved(true); setSaving(false); setTimeout(() => setSaved(false), 2000); })
        .catch(() => setSaving(false));
    }, 800);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [org, loaded, saveToConvex]);

  const updateLayerLead = (id: string, v: string) => setOrg((o: any) => ({ ...o, layers: o.layers.map((l: any) => l.id === id ? { ...l, lead: { ...l.lead, name: v } } : l) }));
  const addLayer = (layer: any) => { setOrg((o: any) => ({ ...o, layers: [...o.layers, { ...layer, id: uid() }] })); setAddRowOpen(false); };
  const removeLayer = (id: string) => setOrg((o: any) => ({ ...o, layers: o.layers.filter((l: any) => l.id !== id) }));
  const moveLayer = (id: string, dir: number) => setOrg((o: any) => { const a = [...o.layers]; const i = a.findIndex((l: any) => l.id === id); const j = i + dir; if (j < 0 || j >= a.length) return o; [a[i], a[j]] = [a[j], a[i]]; return { ...o, layers: a }; });
  const updateProductName = (id: string, v: string) => setOrg((o: any) => ({ ...o, products: o.products.map((p: any) => p.id === id ? { ...p, name: v } : p) }));
  const updateProductLead = (id: string, v: string) => setOrg((o: any) => ({ ...o, products: o.products.map((p: any) => p.id === id ? { ...p, productLead: v } : p) }));
  const addProduct = ({ name, type, productLead }: any) => { const cells: any = {}; org.layers.forEach((l: any) => { cells[l.id] = []; }); setOrg((o: any) => ({ ...o, products: [...o.products, { id: uid(), name, type, productLead, cells }] })); setAddColOpen(false); };
  const removeProduct = (id: string) => setOrg((o: any) => ({ ...o, products: o.products.filter((p: any) => p.id !== id) }));
  const moveProduct = (id: string, dir: number) => setOrg((o: any) => { const a = [...o.products]; const i = a.findIndex((p: any) => p.id === id); const j = i + dir; if (j < 0 || j >= a.length) return o; [a[i], a[j]] = [a[j], a[i]]; return { ...o, products: a }; });
  const updateCellItem = (pId: string, lId: string, idx: number, field: string, val: string) => setOrg((o: any) => ({ ...o, products: o.products.map((p: any) => { if (p.id !== pId) return p; const n = [...(p.cells[lId] || [])]; n[idx] = { ...n[idx], [field]: val }; return { ...p, cells: { ...p.cells, [lId]: n } }; }) }));
  const deleteCellItem = (pId: string, lId: string, idx: number) => setOrg((o: any) => ({ ...o, products: o.products.map((p: any) => { if (p.id !== pId) return p; const n = [...(p.cells[lId] || [])]; n.splice(idx, 1); return { ...p, cells: { ...p.cells, [lId]: n } }; }) }));
  const addCellItem = (pId: string, lId: string, name: string, stage: string) => setOrg((o: any) => ({ ...o, products: o.products.map((p: any) => { if (p.id !== pId) return p; return { ...p, cells: { ...p.cells, [lId]: [...(p.cells[lId] || []), { name, stage }] } }; }) }));
  const addExecutive = () => { const e = { id: uid(), name: "New Leader", role: "Role", accent: "hsl(178 91% 34%)", layers: [] as string[] }; setOrg((o: any) => ({ ...o, executives: [...(o.executives || []), e] })); setAssignOpen(e); };
  const removeExecutive = (id: string) => setOrg((o: any) => ({ ...o, executives: (o.executives || []).filter((e: any) => e.id !== id) }));
  const updateExecName = (id: string, v: string) => setOrg((o: any) => ({ ...o, executives: (o.executives || []).map((e: any) => e.id === id ? { ...e, name: v } : e) }));
  const updateExecRole = (id: string, v: string) => setOrg((o: any) => ({ ...o, executives: (o.executives || []).map((e: any) => e.id === id ? { ...e, role: v } : e) }));
  const updateExecLayers = (id: string, ls: string[]) => setOrg((o: any) => ({ ...o, executives: (o.executives || []).map((e: any) => e.id === id ? { ...e, layers: ls } : e) }));
  const toggleCollapse = (id: string) => setCollapsedExecs(s => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  // ─── People Registry Helpers ───
  const getPeopleMeta = (name: string): PersonMeta => org.people?.[name] || {};
  const isEngineeringManager = (name: string) => (getPeopleMeta(name).designations || []).includes("engineering_manager");
  const getEM = (name: string) => getPeopleMeta(name).engineeringManager || null;

  const toggleEMDesignation = (name: string) => {
    setOrg((o: any) => {
      const people = { ...(o.people || {}) };
      const meta = { ...(people[name] || {}) };
      const desigs = [...(meta.designations || [])];
      const idx = desigs.indexOf("engineering_manager");
      if (idx >= 0) desigs.splice(idx, 1);
      else desigs.push("engineering_manager");
      meta.designations = desigs;
      people[name] = meta;
      // If removed as EM, clear anyone who had them assigned
      if (idx >= 0) {
        for (const [pName, pMeta] of Object.entries(people)) {
          if ((pMeta as PersonMeta).engineeringManager === name) {
            people[pName] = { ...(pMeta as PersonMeta), engineeringManager: undefined };
          }
        }
      }
      return { ...o, people };
    });
  };

  const setPersonEM = (personName: string, emName: string | undefined) => {
    setOrg((o: any) => {
      const people = { ...(o.people || {}) };
      const meta = { ...(people[personName] || {}) };
      meta.engineeringManager = emName;
      people[personName] = meta;
      return { ...o, people };
    });
  };

  // Collect all unique person names from the matrix
  const allPeopleNames = (() => {
    const names = new Set<string>();
    (org.products || []).forEach((p: any) => {
      Object.values(p.cells || {}).forEach((items: any) => {
        (items || []).forEach((item: any) => names.add(item.name));
      });
    });
    (org.innovation || []).forEach((name: string) => names.add(name));
    return Array.from(names).sort();
  })();

  // Get list of designated EMs
  const engineeringManagers = allPeopleNames.filter(isEngineeringManager);

  // Build exec coverage map
  const coverage: Record<string, string> = {};
  (org.executives || []).forEach((ex: any) => ex.layers.forEach((lId: string) => { coverage[lId] = ex.id; }));
  const execById: Record<string, any> = {};
  (org.executives || []).forEach((ex: any) => { execById[ex.id] = ex; });
  const segments: any[] = [];
  let si = 0;
  while (si < org.layers.length) {
    const eId = coverage[org.layers[si].id];
    if (!eId) { segments.push({ exec: null, rowSpan: 1 }); si++; }
    else { let span = 0, j = si; while (j < org.layers.length && coverage[org.layers[j].id] === eId) { span++; j++; } segments.push({ exec: execById[eId], rowSpan: span }); for (let k = 1; k < span; k++) segments.push(null); si = j; }
  }

  if (!loaded) return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <div key={i} className="size-2 rounded-full bg-[hsl(178_91%_34%)] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fc", padding: "24px 32px" }}>
      {/* Modals */}
      <Modal opened={!!jdOpen} onClose={() => setJdOpen(null)} size="lg">
        {jdOpen && <JDModalContent layerId={jdOpen.layerId} layer={jdOpen.layer} />}
      </Modal>
      <Modal
        opened={!!assignOpen}
        onClose={() => setAssignOpen(null)}
        title={`Assign rows → ${assignOpen?.name ?? ""}`}
        size="md"
      >
        {assignOpen && (
          <div className="flex flex-col gap-2 mt-1">
            {org.layers.map((layer: any) => {
              const checked = (assignOpen.layers || []).includes(layer.id);
              return (
                <label key={layer.id} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => {
                      const ls = checked
                        ? assignOpen.layers.filter((l: string) => l !== layer.id)
                        : [...assignOpen.layers, layer.id];
                      updateExecLayers(assignOpen.id, ls);
                      setAssignOpen({ ...assignOpen, layers: ls });
                    }}
                  />
                  <span className="text-sm text-gray-700">{layer.label}</span>
                </label>
              );
            })}
          </div>
        )}
      </Modal>
      {/* EM Management Modal */}
      <Modal opened={!!emModalPerson} onClose={() => setEmModalPerson(null)} title={`Engineering Manager — ${emModalPerson ?? ""}`} size="md">
        {emModalPerson && (() => {
          const personIsEM = isEngineeringManager(emModalPerson);
          const currentEM = getEM(emModalPerson);
          return (
            <div className="flex flex-col gap-5 mt-1">
              {/* Designation toggle */}
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Engineering Manager Designation</p>
                  <p className="text-xs text-gray-500 mt-0.5">Mark this person as an engineering manager</p>
                </div>
                <button
                  onClick={() => toggleEMDesignation(emModalPerson)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
                    personIsEM
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  )}
                >
                  {personIsEM ? "✓ Designated EM" : "Designate as EM"}
                </button>
              </div>

              <Separator />

              {/* Assign EM */}
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">Assigned Engineering Manager</p>
                <p className="text-xs text-gray-500 mb-3">Select from people designated as engineering managers</p>
                {engineeringManagers.length === 0 ? (
                  <div className="rounded-xl bg-yellow-50 border border-yellow-200 px-4 py-3">
                    <p className="text-xs text-yellow-700">No engineering managers designated yet. Designate someone as an EM first.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    {/* None option */}
                    <label className="flex items-center gap-2.5 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="em-select"
                        checked={!currentEM}
                        onChange={() => setPersonEM(emModalPerson, undefined)}
                        className="accent-indigo-600"
                      />
                      <span className="text-sm text-gray-500 italic">No manager assigned</span>
                    </label>
                    {engineeringManagers.filter(n => n !== emModalPerson).map(emName => (
                      <label key={emName} className="flex items-center gap-2.5 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="em-select"
                          checked={currentEM === emName}
                          onChange={() => setPersonEM(emModalPerson, emName)}
                          className="accent-indigo-600"
                        />
                        <Avatar className="size-5 shrink-0">
                          <AvatarFallback seed={emName} className="text-[6px] font-bold">
                            {getInitials(emName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-700 font-medium">{emName}</span>
                        <span className="rounded px-1.5 py-0.5 text-[9px] font-bold bg-indigo-100 text-indigo-700">EM</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </Modal>

      <AddColumnModal opened={addColOpen} onClose={() => setAddColOpen(false)} onAdd={addProduct} />
      <AddRowModal opened={addRowOpen} onClose={() => setAddRowOpen(false)} onAdd={addLayer} />
      <AddRoleModal target={addRoleTarget} onClose={() => setAddRoleTarget(null)} onAdd={(n: string, s: string) => { if (addRoleTarget) addCellItem(addRoleTarget.prodId, addRoleTarget.layerId, n, s); setAddRoleTarget(null); }} />

      {/* ── Gradient Header ── */}
      <div className="gradient-header animate-in">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[3px] mb-1" style={{ opacity: 0.7 }}>Gloo — Platform & Product Team</p>
            <h1 style={{ color: "white", fontSize: 28, letterSpacing: -0.5, margin: 0 }}>Platform Matrix Org</h1>
            <p className="text-sm mt-1" style={{ opacity: 0.7 }}>Q2 2026 · Draft pending Ben alignment</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn(
              "rounded-full px-3 py-1 text-xs font-medium text-white",
              saved ? "bg-green-500/30" : saving ? "bg-yellow-500/30" : "bg-white/15"
            )}>
              {saved ? "✓ Saved" : saving ? "Saving..." : "Auto-save"}
            </span>
            <button
              onClick={() => { navigator.clipboard.writeText(JSON.stringify(org, null, 2)).then(() => alert("Copied!")); }}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-white transition-colors"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <IconDownload size={12} />
              Export
            </button>
            <button
              onClick={() => { if (window.confirm("Reset to defaults?")) setOrg(initData); }}
              className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
              style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* ── View Toggle ── */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex rounded-full bg-white border border-gray-100 shadow-sm">
          <TabGroup value={view} onValueChange={setView} size="sm">
            <TabGroupItem value="people">👥 People Matrix</TabGroupItem>
            <TabGroupItem value="layers">⚙️ Layer Architecture</TabGroupItem>
          </TabGroup>
        </div>
      </div>

      {view === "layers" ? <LayerView layers={org.layers} /> : (<>
        {/* ── Stage Filter ── */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mr-1">Stage:</span>
          {(["all","stabilize","modernize","productize"] as const).map(s => (
            <button key={s} className={`filter-pill ${stageFilter === s ? "active" : ""}`}
              style={stageFilter === s ? { background: STAGES[s].color, borderColor: STAGES[s].color, color: "white", ["--accent" as any]: STAGES[s].color } : {}}
              onClick={() => setStageFilter(s)}>
              {s !== "all" && <div className={`stage-dot ${s}`} style={stageFilter === s ? { background: "white" } : {}} />}
              {STAGES[s].label}
            </button>
          ))}
        </div>

        {/* ── Matrix ── */}
        <div className="glass-card animate-in" style={{ overflow: "auto" }}>
          <table className="matrix-table">
            <thead>
              <tr>
                <th style={{ width: 140 }}>
                  <div className="flex items-center justify-between">
                    <span>ELT</span>
                    <button className="add-btn" onClick={addExecutive} title="Add executive" style={{ width: 22, height: 22, fontSize: 13 }}>+</button>
                  </div>
                </th>
                <th style={{ width: 220 }}>Layer / Lead</th>
                {org.products.map((p: any, pi: number) => {
                  const tc = typeConfig[p.type] || typeConfig.church;
                  return (
                    <th key={p.id} className={tc.headerClass} style={{ textAlign: "center", minWidth: 160 }}>
                      <div className="flex items-center justify-center gap-1 mb-1.5">
                        <IconButton
                          size="sm"
                          variant="ghost"
                          icon={<IconArrowLeft size={10} />}
                          aria-label="Move left"
                          disabled={pi === 0}
                          onClick={() => moveProduct(p.id, -1)}
                          className="size-5 min-h-0"
                        />
                        <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-semibold", tc.bgClass, tc.textClass)}>{tc.label}</span>
                        <IconButton
                          size="sm"
                          variant="ghost"
                          icon={<IconArrowRight size={10} />}
                          aria-label="Move right"
                          disabled={pi === org.products.length - 1}
                          onClick={() => moveProduct(p.id, 1)}
                          className="size-5 min-h-0"
                        />
                        <IconButton
                          size="sm"
                          variant="destructive"
                          icon={<IconTrash size={10} />}
                          aria-label="Remove product"
                          onClick={() => removeProduct(p.id)}
                          className="size-5 min-h-0"
                        />
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1d23", textTransform: "none", letterSpacing: 0 }}>
                        <ET value={p.name} onChange={(v: string) => updateProductName(p.id, v)} style={{ fontWeight: 700, fontSize: 15 }} />
                      </div>
                      <div className="inline-block mt-1.5 rounded-lg px-2.5 py-1 bg-white shadow-sm">
                        <div style={{ fontSize: 12, fontWeight: 600, color: tc.badgeColor }}>
                          <ET value={p.productLead} onChange={(v: string) => updateProductLead(p.id, v)} style={{ fontWeight: 600, color: tc.badgeColor }} />
                        </div>
                        <div className="text-[9px] text-gray-400 uppercase tracking-wide">Product Lead</div>
                      </div>
                    </th>
                  );
                })}
                <th style={{ width: 50 }}><button className="add-btn" onClick={() => setAddColOpen(true)} title="Add column">+</button></th>
              </tr>
            </thead>
            <tbody>
              {org.layers.map((layer: any, li: number) => {
                const seg = segments[li];
                const covExec = coverage[layer.id] ? execById[coverage[layer.id]] : null;
                const isCollapsed = covExec && collapsedExecs.has(covExec.id);

                return (
                  <tr key={layer.id}>
                    {seg !== null && (
                      seg?.exec ? (
                        <td rowSpan={seg.rowSpan} className="exec-cell" style={{ verticalAlign: "middle", cursor: "pointer" }}
                          onClick={() => toggleCollapse(seg.exec.id)}>
                          <div className="flex items-center gap-1 mb-1">
                            {collapsedExecs.has(seg.exec.id) ? <IconChevronRight size={14} color="#6b7280" /> : <IconChevronDown size={14} color="#6b7280" />}
                            <span style={{ fontWeight: 700, fontSize: 13, color: seg.exec.accent }}>
                              <ET value={seg.exec.name} onChange={(v: string) => updateExecName(seg.exec.id, v)} style={{ fontWeight: 700, color: seg.exec.accent }} />
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-400 pl-[18px]">
                            <ET value={seg.exec.role} onChange={(v: string) => updateExecRole(seg.exec.id, v)} style={{ fontSize: 11, color: "#9ca3af" }} />
                          </div>
                          <div className="flex gap-1 pl-[18px] mt-2">
                            <Button size="sm" variant="secondary" onClick={(e: any) => { e.stopPropagation(); setAssignOpen(seg.exec); }}>Assign</Button>
                            <IconButton
                              size="sm"
                              variant="destructive"
                              icon={<IconTrash size={11} />}
                              aria-label="Remove executive"
                              onClick={(e: any) => { e.stopPropagation(); removeExecutive(seg.exec.id); }}
                            />
                          </div>
                        </td>
                      ) : (
                        <td className="exec-cell" style={{ verticalAlign: "middle" }}>
                          <p className="text-[10px] text-gray-400 text-center">—</p>
                        </td>
                      )
                    )}

                    {isCollapsed ? (
                      <td colSpan={org.products.length + 2} style={{ background: "#fafbfd" }}>
                        <div className="flex items-center gap-2">
                          <div className="layer-bar" style={{ background: layer.accent, height: 14, minHeight: 14 }} />
                          <span className="text-xs font-semibold text-gray-500">{layer.label}</span>
                          <span className="text-[10px] text-gray-400 font-mono">{layer.sublabel}</span>
                        </div>
                      </td>
                    ) : (
                      <>
                        <td>
                          <div className="flex gap-2.5 items-start">
                            <div className="layer-bar" style={{ background: layer.accent }} />
                            <div className="flex-1">
                              <div className="text-[13px] font-bold text-gray-900 mb-0.5">{layer.label}</div>
                              <div className="text-[10px] text-gray-400 font-mono mb-2">{layer.sublabel}</div>
                              <div className="rounded-lg bg-gray-50 px-2.5 py-1.5 mb-1.5">
                                <div style={{ fontSize: 12, fontWeight: 600, color: layer.accent }}>
                                  <ET value={layer.lead.name} onChange={(v: string) => updateLayerLead(layer.id, v)} style={{ fontWeight: 600, color: layer.accent }} />
                                </div>
                                <div className="text-[9px] text-gray-400">{layer.lead.role}</div>
                              </div>
                              <div className="flex gap-1 items-center">
                                {JDS[layer.id] && (
                                  <Button size="sm" variant="ghost" onClick={() => setJdOpen({ layerId: layer.id, layer })}>JD →</Button>
                                )}
                                <IconButton size="sm" variant="ghost" icon={<IconArrowUp size={11} />} aria-label="Move up" disabled={li === 0} onClick={() => moveLayer(layer.id, -1)} />
                                <IconButton size="sm" variant="ghost" icon={<IconArrowDown size={11} />} aria-label="Move down" disabled={li === org.layers.length - 1} onClick={() => moveLayer(layer.id, 1)} />
                                <IconButton size="sm" variant="destructive" icon={<IconTrash size={11} />} aria-label="Remove layer" onClick={() => removeLayer(layer.id)} />
                              </div>
                            </div>
                          </div>
                        </td>

                        {org.products.map((prod: any) => {
                          const items = prod.cells[layer.id] || [];
                          return (
                            <td key={prod.id}>
                              <div className="flex flex-wrap gap-0.5">
                                {items.map((item: any, idx: number) => (
                                  <PersonChip key={idx} name={item.name} stage={item.stage}
                                    dimmed={stageFilter !== "all" && item.stage !== stageFilter && item.stage !== "all"}
                                    isEM={isEngineeringManager(item.name)}
                                    emName={getEM(item.name)}
                                    onEMClick={() => setEmModalPerson(item.name)}
                                    onRename={(v: string) => updateCellItem(prod.id, layer.id, idx, "name", v)}
                                    onStageChange={(v: string) => updateCellItem(prod.id, layer.id, idx, "stage", v)}
                                    onDelete={() => deleteCellItem(prod.id, layer.id, idx)}
                                    onJD={JDS[layer.id] ? () => setJdOpen({ layerId: layer.id, layer }) : undefined} />
                                ))}
                                <button className="add-btn" onClick={() => setAddRoleTarget({ prodId: prod.id, layerId: layer.id })} title="Add role">+</button>
                              </div>
                            </td>
                          );
                        })}
                        <td />
                      </>
                    )}
                  </tr>
                );
              })}

              {/* Innovation row */}
              <tr>
                <td className="exec-cell" />
                <td>
                  <div className="flex gap-2.5 items-start">
                    <div className="layer-bar" style={{ background: "hsl(250 100% 69%)" }} />
                    <div>
                      <div className="text-[13px] font-bold text-gray-900">Product / Platform Innovation</div>
                      <div className="text-[10px] font-mono mb-2" style={{ color: "hsl(250 100% 69%)" }}>Bleeding Edge R&D</div>
                      <div className="rounded-lg bg-gray-50 px-2.5 py-1.5">
                        <div style={{ fontSize: 12, fontWeight: 600, color: "hsl(250 100% 69%)" }}>
                          <ET value={org.innovationLead} onChange={(v: string) => setOrg((o: any) => ({ ...o, innovationLead: v }))} style={{ fontWeight: 600, color: "hsl(250 100% 69%)" }} />
                        </div>
                        <div className="text-[9px] text-gray-400">Innovation Lead</div>
                      </div>
                    </div>
                  </div>
                </td>
                <td colSpan={org.products.length}>
                  <div className="flex flex-wrap gap-1">
                    {(org.innovation || []).map((name: string, idx: number) => (
                      <PersonChip key={idx} name={name} stage="all"
                        isEM={isEngineeringManager(name)}
                        emName={getEM(name)}
                        onEMClick={() => setEmModalPerson(name)}
                        onRename={(v: string) => setOrg((o: any) => { const a = [...o.innovation]; a[idx] = v; return { ...o, innovation: a }; })}
                        onStageChange={() => {}}
                        onDelete={() => setOrg((o: any) => ({ ...o, innovation: o.innovation.filter((_: any, i: number) => i !== idx) }))} />
                    ))}
                    <button className="add-btn" onClick={() => setOrg((o: any) => ({ ...o, innovation: [...o.innovation, "New Member"] }))}>+</button>
                  </div>
                </td>
                <td />
              </tr>

              {/* Add row */}
              <tr>
                <td colSpan={org.products.length + 3} style={{ background: "transparent", border: "none" }}>
                  <Button variant="ghost" size="sm" leadingIcon={<IconPlus size={14} />} onClick={() => setAddRowOpen(true)}>Add Row</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex gap-6 mt-4 flex-wrap items-center">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Columns:</span>
            <span className="rounded px-1.5 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-700">Church</span>
            <span className="rounded px-1.5 py-0.5 text-[10px] font-semibold bg-yellow-100 text-yellow-700">360°</span>
            <span className="rounded px-1.5 py-0.5 text-[10px] font-semibold bg-[hsl(169_82%_90%)] text-[hsl(191_100%_13%)]">Gloo</span>
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Stages:</span>
            {(["stabilize","modernize","productize","all"] as const).map(s => (
              <div key={s} className="flex items-center gap-1">
                <div className={`stage-dot ${s}`} />
                <span className="text-[10px] text-gray-400">{STAGES[s].label}</span>
              </div>
            ))}
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <span className="text-[10px] text-gray-400">Click names to edit · Hover chips for controls · + to add roles</span>
        </div>
      </>)}
    </div>
  );
}

/* ── Modals ── */
function AddColumnModal({ opened, onClose, onAdd }: any) {
  const [name, setName] = useState("New Product");
  const [type, setType] = useState("church");
  const [lead, setLead] = useState("TBD");
  return (
    <Modal opened={opened} onClose={onClose} title="Add Column" size="md">
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <Input value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Type</p>
          <div className="inline-flex w-full rounded-full bg-gray-100 p-0.5">
            <TabGroup value={type} onValueChange={setType} size="sm" className="flex w-full">
              <TabGroupItem value="church" className="flex-1">Church</TabGroupItem>
              <TabGroupItem value="360" className="flex-1">360°</TabGroupItem>
              <TabGroupItem value="gloo" className="flex-1">Gloo</TabGroupItem>
            </TabGroup>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Lead</label>
          <Input value={lead} onChange={e => setLead(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={() => { onAdd({ name: name.trim() || "New Product", type, productLead: lead.trim() || "TBD" }); setName("New Product"); setLead("TBD"); }}>Add</Button>
        </div>
      </div>
    </Modal>
  );
}

function AddRowModal({ opened, onClose, onAdd }: any) {
  const [label, setLabel] = useState("New Layer");
  const [sublabel, setSublabel] = useState("Description");
  const [leadName, setLeadName] = useState("TBD");
  const [leadRole, setLeadRole] = useState("Layer Lead");
  return (
    <Modal opened={opened} onClose={onClose} title="Add Row" size="md">
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Layer Name</label>
          <Input value={label} onChange={e => setLabel(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <Input value={sublabel} onChange={e => setSublabel(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lead Name</label>
          <Input value={leadName} onChange={e => setLeadName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lead Role</label>
          <Input value={leadRole} onChange={e => setLeadRole(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={() => { onAdd({ label: label.trim() || "New Layer", sublabel: sublabel.trim(), lead: { name: leadName.trim() || "TBD", role: leadRole.trim() || "Layer Lead" }, accent: "hsl(178 91% 34%)" }); }}>Add</Button>
        </div>
      </div>
    </Modal>
  );
}

function AddRoleModal({ target, onClose, onAdd }: any) {
  const [name, setName] = useState("New Member");
  const [stage, setStage] = useState("stabilize");
  return (
    <Modal opened={!!target} onClose={onClose} title="Add Role" size="md">
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <Input value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Stage</p>
          <div className="inline-flex w-full rounded-full bg-gray-100 p-0.5">
            <TabGroup value={stage} onValueChange={setStage} size="sm" className="flex w-full">
              <TabGroupItem value="stabilize" className="flex-1">Stabilize</TabGroupItem>
              <TabGroupItem value="modernize" className="flex-1">Modernize</TabGroupItem>
              <TabGroupItem value="productize" className="flex-1">Productize</TabGroupItem>
              <TabGroupItem value="all" className="flex-1">All</TabGroupItem>
            </TabGroup>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={() => { onAdd(name.trim() || "New Member", stage); setName("New Member"); setStage("stabilize"); }}>Add</Button>
        </div>
      </div>
    </Modal>
  );
}
