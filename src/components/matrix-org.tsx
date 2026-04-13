"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Table, Badge, Modal, Button, TextInput, Group, Stack, Text, Title,
  SegmentedControl, ActionIcon, Tooltip, Paper, Box, Flex, Divider,
  Checkbox, Loader, Center, Container, SimpleGrid,
} from "@mantine/core";
import {
  IconPlus, IconTrash, IconArrowUp, IconArrowDown, IconArrowLeft, IconArrowRight,
  IconRefresh, IconDownload, IconFileDescription, IconChevronDown, IconChevronRight,
} from "@tabler/icons-react";
import "../app/globals.css";

/* ─── STAGES ─── */
const STAGES: Record<string, { label: string; color: string; mantine: string }> = {
  stabilize:  { label: "Stabilize",  color: "#f97316", mantine: "orange" },
  modernize:  { label: "Modernize",  color: "#8b5cf6", mantine: "violet" },
  productize: { label: "Productize", color: "#22c55e", mantine: "green" },
  all:        { label: "All Stages", color: "#94a3b8", mantine: "gray" },
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

const initData = {
  layers: [
    { id: "dataAnalytics", label: "Data & Analytics", sublabel: "Reporting · BI · Insights", lead: { name: "TBD", role: "Data & Analytics Lead" }, accent: "#3b82f6" },
    { id: "enterpriseSys", label: "Enterprise Systems", sublabel: "ERP · HRIS · Finance · Internal Tools", lead: { name: "TBD", role: "Enterprise Systems Lead" }, accent: "#8b5cf6" },
    { id: "coreInfra", label: "Core Infrastructure", sublabel: "Cloud · DevOps · Networking", lead: { name: "TBD", role: "Core Infrastructure Lead" }, accent: "#10b981" },
    { id: "security", label: "Security", sublabel: "AppSec · Compliance · Risk", lead: { name: "TBD", role: "Security Lead" }, accent: "#f59e0b" },
    { id: "helpDesk", label: "Help Desk", sublabel: "Support · Ticketing · Escalation", lead: { name: "TBD", role: "Help Desk Lead" }, accent: "#6b7280" },
    { id: "product", label: "Product", sublabel: "Outcomes · Roadmap · Research", lead: { name: "TBD", role: "Outcome Product Lead" }, accent: "#ec4899" },
    { id: "design", label: "Design", sublabel: "Experience Systems · Design System", lead: { name: "Matthew Slaughter", role: "Head of Design" }, accent: "#f97316" },
    { id: "platformEng", label: "Platform Solution Engineer", sublabel: "Forward Deployment · Config · Agents", lead: { name: "Casey", role: "Application Layer Lead" }, accent: "#0ea5e9" },
    { id: "appEng", label: "Application Layer Engineer", sublabel: "Platform Architecture · Unified Surface", lead: { name: "Casey", role: "Application Layer Lead" }, accent: "#6366f1" },
    { id: "services", label: "Shared Solutions", sublabel: "Agent Orchestration · Skills · Trust Fabric", lead: { name: "Brian Johnson", role: "Platform Services Lead" }, accent: "#22c55e" },
    { id: "infra", label: "Infrastructure & Data", sublabel: "Gloo Brain · Data · Auditability", lead: { name: "Daniel Wilson", role: "Head of AI Engineering" }, accent: "#a855f7" },
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
    { id: "exec1", name: "Justin", role: "IT & Operations Leader", accent: "#3b82f6", layers: ["dataAnalytics","enterpriseSys","coreInfra","security","helpDesk"] },
    { id: "exec2", name: "TBD", role: "Product Leader", accent: "#ec4899", layers: ["product"] },
    { id: "exec3", name: "Daniel", role: "Engineering Leader", accent: "#22c55e", layers: ["design","platformEng","appEng","services","infra"] },
  ],
};

const typeConfig: Record<string, { badge: string; mantine: string; label: string; headerClass: string }> = {
  church: { badge: "#3b82f6", mantine: "blue", label: "Church", headerClass: "product-header church" },
  "360":  { badge: "#eab308", mantine: "yellow", label: "360°", headerClass: "product-header type-360" },
  gloo:   { badge: "#22c55e", mantine: "green", label: "Gloo", headerClass: "product-header gloo" },
};

function uid() { return Math.random().toString(36).slice(2, 8); }

/* ── Inline editable text ── */
function ET({ value, onChange, style }: any) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (editing && ref.current) ref.current.focus(); }, [editing]);
  useEffect(() => { setDraft(value); }, [value]);
  const commit = () => { setEditing(false); if (draft.trim()) onChange(draft.trim()); else setDraft(value); };
  if (editing) return (
    <input ref={ref} value={draft} onChange={e => setDraft(e.target.value)} onBlur={commit}
      onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setDraft(value); setEditing(false); } }}
      style={{ background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 6, padding: "2px 8px", fontSize: "inherit", fontFamily: "inherit", color: "#1a1d23", outline: "none", width: "100%", ...style }} />
  );
  return (
    <span onClick={() => setEditing(true)} style={{ cursor: "text", borderBottom: "1px dashed #d1d5db", ...style }}>{value || "—"}</span>
  );
}

/* ── Person chip ── */
function PersonChip({ name, stage, onRename, onStageChange, onDelete, onJD, dimmed }: any) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (editing && ref.current) ref.current.focus(); }, [editing]);
  const commit = () => { setEditing(false); if (draft.trim() && draft.trim() !== name) onRename(draft.trim()); else setDraft(name); };
  const stageInfo = STAGES[stage] || STAGES.all;

  return (
    <div className="person-chip" style={{ opacity: dimmed ? 0.25 : 1 }}>
      <div className={`stage-dot ${stage}`} />
      {editing ? (
        <input ref={ref} value={draft} onChange={e => setDraft(e.target.value)} onBlur={commit}
          onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setDraft(name); setEditing(false); } }}
          style={{ background: "transparent", border: "none", fontSize: 12, color: "#1a1d23", outline: "none", width: Math.max(60, draft.length * 7), fontFamily: "inherit" }} />
      ) : (
        <span onClick={() => setEditing(true)} style={{ cursor: "text", fontSize: 12, color: "#374151", fontWeight: 500 }}>{name}</span>
      )}
      <div className="chip-actions">
        {onJD && (
          <Tooltip label="Job Description"><ActionIcon size={16} variant="transparent" color="gray" onClick={onJD}><IconFileDescription size={11} /></ActionIcon></Tooltip>
        )}
        <Tooltip label="Cycle stage"><ActionIcon size={16} variant="transparent" color="gray" onClick={() => {
          const order = ["stabilize","modernize","productize","all"];
          onStageChange(order[(order.indexOf(stage) + 1) % order.length]);
        }}><IconRefresh size={11} /></ActionIcon></Tooltip>
        <Tooltip label="Remove"><ActionIcon size={16} variant="transparent" color="red" onClick={onDelete}><IconTrash size={11} /></ActionIcon></Tooltip>
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
        <Text fz={11} fw={600} c="dimmed" tt="uppercase" lts={1} mb={2}>{layer.label}</Text>
        <Title order={3} mb={4}>{jd.title}</Title>
        <Text fz="sm" c="dimmed">Reports to {jd.reports}</Text>
      </div>
      <Text fz="sm" c="dark" lh={1.8} mb="lg">{jd.what}</Text>
      <Text fz={11} fw={700} c="dark" tt="uppercase" lts={1} mb="xs">Responsibilities</Text>
      {jd.responsibilities.map((r: string, i: number) => (
        <Group key={i} gap={8} mb={8} align="flex-start" wrap="nowrap">
          <span style={{ color: layer.accent, fontSize: 10, marginTop: 4 }}>●</span>
          <Text fz="sm" lh={1.6} c="dimmed">{r}</Text>
        </Group>
      ))}
      <Divider my="md" />
      <SimpleGrid cols={2} spacing="lg">
        <div>
          <Text fz={11} fw={700} tt="uppercase" lts={1} mb="xs">Looking For</Text>
          {jd.looking.map((l: string, i: number) => (
            <Group key={i} gap={6} mb={6} align="flex-start" wrap="nowrap">
              <span style={{ color: "#6366f1", fontSize: 8, marginTop: 5 }}>◆</span>
              <Text fz="xs" c="dimmed" lh={1.5}>{l}</Text>
            </Group>
          ))}
        </div>
        <div>
          <Text fz={11} fw={700} tt="uppercase" lts={1} mb="xs">Success Looks Like</Text>
          {jd.success.map((s: string, i: number) => (
            <Group key={i} gap={6} mb={6} align="flex-start" wrap="nowrap">
              <span style={{ color: "#22c55e", fontSize: 8, marginTop: 5 }}>◆</span>
              <Text fz="xs" c="dimmed" lh={1.5}>{s}</Text>
            </Group>
          ))}
        </div>
      </SimpleGrid>
      <div style={{ background: "#fef2f2", borderRadius: 12, padding: "14px 18px", marginTop: 16, border: "1px solid #fecaca" }}>
        <Text fz={10} fw={700} c="red" tt="uppercase" lts={1} mb={4}>Not This</Text>
        <Text fz="sm" c="dimmed" fs="italic">{jd.notThis}</Text>
      </div>
      <div style={{ background: "linear-gradient(135deg, #f0fdf4, #ecfdf5)", borderRadius: 12, padding: "14px 18px", marginTop: 12, border: "1px solid #bbf7d0" }}>
        <Text fz={10} fw={700} c="teal" tt="uppercase" lts={1} mb={4}>On Human Flourishing</Text>
        <Text fz="sm" c="dimmed">{jd.flourishing}</Text>
      </div>
    </div>
  );
}

/* ── Layer View ── */
function LayerView({ layers }: any) {
  return (
    <Stack gap="lg">
      {layers.map((layer: any) => {
        const desc = layerDescriptions[layer.id];
        if (!desc) return null;
        return (
          <div key={layer.id} className="glass-card animate-in" style={{ padding: 24, overflow: "hidden" }}>
            <div style={{ borderLeft: `4px solid ${layer.accent}`, paddingLeft: 16, marginBottom: 16 }}>
              <Text fz="xl" fw={700} c="dark">{layer.label}</Text>
              <Text fz="xs" c="dimmed" ff="monospace">{layer.sublabel}</Text>
            </div>
            <Text fz="sm" c="dimmed" lh={1.7} mb="md">{desc.purpose}</Text>
            <SimpleGrid cols={2}>
              <div>
                <Text fz={11} fw={700} tt="uppercase" lts={1} mb="xs" c={layer.accent}>What Happens Here</Text>
                {desc.activities.map((a: string, i: number) => (
                  <Group key={i} gap={8} mb={6} wrap="nowrap"><span style={{ color: layer.accent, fontSize: 10, marginTop: 3 }}>▸</span><Text fz="sm" c="dimmed">{a}</Text></Group>
                ))}
              </div>
              <Stack gap="sm">
                <div>
                  <Text fz={11} fw={700} tt="uppercase" lts={1} mb="xs" c={layer.accent}>Key Outputs</Text>
                  <Flex wrap="wrap" gap={4}>{desc.outputs.map((o: string, i: number) => (
                    <Badge key={i} variant="light" color="indigo" size="sm" radius="sm">{o}</Badge>
                  ))}</Flex>
                </div>
                <div style={{ background: "#fef2f2", borderRadius: 10, padding: "10px 14px" }}>
                  <Text fz={10} fw={700} c="red" mb={2}>NOT THIS</Text>
                  <Text fz="xs" c="dimmed" fs="italic">{desc.notThis}</Text>
                </div>
                <div style={{ background: "linear-gradient(135deg, #f0fdf4, #ecfdf5)", borderRadius: 10, padding: "10px 14px" }}>
                  <Text fz={10} fw={700} c="teal" mb={2}>FLOURISHING</Text>
                  <Text fz="xs" c="dimmed">{desc.flourishing}</Text>
                </div>
              </Stack>
            </SimpleGrid>
          </div>
        );
      })}
    </Stack>
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

  const convexData = useQuery(api.orgData.get, { key: "default" });
  const saveToConvex = useMutation(api.orgData.save);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (loaded) return;
    if (convexData === undefined) return;
    if (convexData && convexData.data) { try { setOrg(JSON.parse(convexData.data)); } catch {} }
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
  const addExecutive = () => { const e = { id: uid(), name: "New Leader", role: "Role", accent: "#6366f1", layers: [] as string[] }; setOrg((o: any) => ({ ...o, executives: [...(o.executives || []), e] })); setAssignOpen(e); };
  const removeExecutive = (id: string) => setOrg((o: any) => ({ ...o, executives: (o.executives || []).filter((e: any) => e.id !== id) }));
  const updateExecName = (id: string, v: string) => setOrg((o: any) => ({ ...o, executives: (o.executives || []).map((e: any) => e.id === id ? { ...e, name: v } : e) }));
  const updateExecRole = (id: string, v: string) => setOrg((o: any) => ({ ...o, executives: (o.executives || []).map((e: any) => e.id === id ? { ...e, role: v } : e) }));
  const updateExecLayers = (id: string, ls: string[]) => setOrg((o: any) => ({ ...o, executives: (o.executives || []).map((e: any) => e.id === id ? { ...e, layers: ls } : e) }));
  const toggleCollapse = (id: string) => setCollapsedExecs(s => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });

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

  if (!loaded) return <Center h="100vh"><Loader color="indigo" type="dots" size="lg" /></Center>;

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fc", padding: "24px 32px" }}>
      {/* Modals */}
      <Modal opened={!!jdOpen} onClose={() => setJdOpen(null)} size="lg" padding="xl" radius="lg" overlayProps={{ backgroundOpacity: 0.3, blur: 4 }}>
        {jdOpen && <JDModalContent layerId={jdOpen.layerId} layer={jdOpen.layer} />}
      </Modal>
      <Modal opened={!!assignOpen} onClose={() => setAssignOpen(null)} title={<Text fw={600}>Assign rows → {assignOpen?.name}</Text>} radius="lg" overlayProps={{ backgroundOpacity: 0.3, blur: 4 }}>
        {assignOpen && <Stack gap="xs" mt="sm">{org.layers.map((layer: any) => {
          const checked = (assignOpen.layers || []).includes(layer.id);
          return <Checkbox key={layer.id} label={layer.label} checked={checked} color="indigo" radius="sm"
            onChange={() => { const ls = checked ? assignOpen.layers.filter((l: string) => l !== layer.id) : [...assignOpen.layers, layer.id]; updateExecLayers(assignOpen.id, ls); setAssignOpen({ ...assignOpen, layers: ls }); }} />;
        })}</Stack>}
      </Modal>
      <AddColumnModal opened={addColOpen} onClose={() => setAddColOpen(false)} onAdd={addProduct} />
      <AddRowModal opened={addRowOpen} onClose={() => setAddRowOpen(false)} onAdd={addLayer} />
      <AddRoleModal target={addRoleTarget} onClose={() => setAddRoleTarget(null)} onAdd={(n: string, s: string) => { if (addRoleTarget) addCellItem(addRoleTarget.prodId, addRoleTarget.layerId, n, s); setAddRoleTarget(null); }} />

      {/* ── Gradient Header ── */}
      <div className="gradient-header animate-in">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <Text fz={11} fw={500} style={{ opacity: 0.7 }} tt="uppercase" lts={3} mb={4}>Gloo — Platform & Product Team</Text>
            <Title order={1} style={{ color: "white", fontSize: 28, letterSpacing: -0.5 }}>Platform Matrix Org</Title>
            <Text fz="sm" style={{ opacity: 0.7 }} mt={4}>Q2 2026 · Draft pending Ben alignment</Text>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Badge variant="filled" color={saved ? "green" : saving ? "yellow" : "gray"} size="sm" radius="xl" style={{ background: saved ? "rgba(34,197,94,0.3)" : saving ? "rgba(234,179,8,0.3)" : "rgba(255,255,255,0.15)", color: "white" }}>
              {saved ? "✓ Saved" : saving ? "Saving..." : "Auto-save"}
            </Badge>
            <Button variant="white" size="compact-xs" radius="xl" leftSection={<IconDownload size={12} />} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "white" }}
              onClick={() => { navigator.clipboard.writeText(JSON.stringify(org, null, 2)).then(() => alert("Copied!")); }}>Export</Button>
            <Button variant="white" size="compact-xs" radius="xl" style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "rgba(255,255,255,0.7)" }}
              onClick={() => { if (window.confirm("Reset to defaults?")) setOrg(initData); }}>Reset</Button>
          </div>
        </div>
      </div>

      {/* ── View Toggle ── */}
      <Center mb="lg">
        <SegmentedControl value={view} onChange={setView} radius="xl" size="sm" color="indigo"
          data={[{ label: "👥  People Matrix", value: "people" }, { label: "⚙️  Layer Architecture", value: "layers" }]}
          styles={{ root: { background: "white", border: "1px solid #e8ecf1", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" } }} />
      </Center>

      {view === "layers" ? <LayerView layers={org.layers} /> : (<>
        {/* ── Stage Filter ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <Text fz={11} fw={600} c="dimmed" tt="uppercase" lts={1} mr={4}>Stage:</Text>
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
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span>ELT</span>
                    <button className="add-btn" onClick={addExecutive} title="Add executive" style={{ width: 22, height: 22, fontSize: 13 }}>+</button>
                  </div>
                </th>
                <th style={{ width: 220 }}>Layer / Lead</th>
                {org.products.map((p: any, pi: number) => {
                  const tc = typeConfig[p.type] || typeConfig.church;
                  return (
                    <th key={p.id} className={tc.headerClass} style={{ textAlign: "center", minWidth: 160 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 6 }}>
                        <ActionIcon size={16} variant="transparent" color="gray" disabled={pi === 0} onClick={() => moveProduct(p.id, -1)}><IconArrowLeft size={10} /></ActionIcon>
                        <Badge size="xs" variant="light" color={tc.mantine} radius="sm">{tc.label}</Badge>
                        <ActionIcon size={16} variant="transparent" color="gray" disabled={pi === org.products.length - 1} onClick={() => moveProduct(p.id, 1)}><IconArrowRight size={10} /></ActionIcon>
                        <ActionIcon size={16} variant="transparent" color="red" onClick={() => removeProduct(p.id)}><IconTrash size={10} /></ActionIcon>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1d23", textTransform: "none", letterSpacing: 0 }}>
                        <ET value={p.name} onChange={(v: string) => updateProductName(p.id, v)} style={{ fontWeight: 700, fontSize: 15 }} />
                      </div>
                      <div style={{ background: "white", borderRadius: 8, padding: "4px 10px", display: "inline-block", marginTop: 6, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: tc.badge }}><ET value={p.productLead} onChange={(v: string) => updateProductLead(p.id, v)} style={{ fontWeight: 600, color: tc.badge }} /></div>
                        <div style={{ fontSize: 9, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1 }}>Product Lead</div>
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
                          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                            {collapsedExecs.has(seg.exec.id) ? <IconChevronRight size={14} color="#6b7280" /> : <IconChevronDown size={14} color="#6b7280" />}
                            <span style={{ fontWeight: 700, fontSize: 13, color: seg.exec.accent }}>
                              <ET value={seg.exec.name} onChange={(v: string) => updateExecName(seg.exec.id, v)} style={{ fontWeight: 700, color: seg.exec.accent }} />
                            </span>
                          </div>
                          <div style={{ fontSize: 11, color: "#9ca3af", paddingLeft: 18 }}>
                            <ET value={seg.exec.role} onChange={(v: string) => updateExecRole(seg.exec.id, v)} style={{ fontSize: 11, color: "#9ca3af" }} />
                          </div>
                          <div style={{ display: "flex", gap: 4, paddingLeft: 18, marginTop: 8 }}>
                            <Button size="compact-xs" variant="light" color="indigo" radius="sm" onClick={(e: any) => { e.stopPropagation(); setAssignOpen(seg.exec); }}>Assign</Button>
                            <ActionIcon size={20} variant="light" color="red" radius="sm" onClick={(e: any) => { e.stopPropagation(); removeExecutive(seg.exec.id); }}><IconTrash size={11} /></ActionIcon>
                          </div>
                        </td>
                      ) : (
                        <td className="exec-cell" style={{ verticalAlign: "middle" }}>
                          <Text fz={10} c="dimmed" ta="center">—</Text>
                        </td>
                      )
                    )}

                    {isCollapsed ? (
                      <td colSpan={org.products.length + 2} style={{ background: "#fafbfd" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div className="layer-bar" style={{ background: layer.accent, height: 14, minHeight: 14 }} />
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280" }}>{layer.label}</span>
                          <span style={{ fontSize: 10, color: "#9ca3af", fontFamily: "monospace" }}>{layer.sublabel}</span>
                        </div>
                      </td>
                    ) : (
                      <>
                        <td>
                          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                            <div className="layer-bar" style={{ background: layer.accent }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1d23", marginBottom: 1 }}>{layer.label}</div>
                              <div style={{ fontSize: 10, color: "#9ca3af", fontFamily: "monospace", marginBottom: 8 }}>{layer.sublabel}</div>
                              <div style={{ background: "#f8f9fc", borderRadius: 8, padding: "5px 10px", marginBottom: 6 }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: layer.accent }}><ET value={layer.lead.name} onChange={(v: string) => updateLayerLead(layer.id, v)} style={{ fontWeight: 600, color: layer.accent }} /></div>
                                <div style={{ fontSize: 9, color: "#9ca3af" }}>{layer.lead.role}</div>
                              </div>
                              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                                {JDS[layer.id] && <Button size="compact-xs" variant="subtle" color="indigo" radius="sm" onClick={() => setJdOpen({ layerId: layer.id, layer })}>JD →</Button>}
                                <ActionIcon size={18} variant="subtle" color="gray" disabled={li === 0} onClick={() => moveLayer(layer.id, -1)}><IconArrowUp size={11} /></ActionIcon>
                                <ActionIcon size={18} variant="subtle" color="gray" disabled={li === org.layers.length - 1} onClick={() => moveLayer(layer.id, 1)}><IconArrowDown size={11} /></ActionIcon>
                                <ActionIcon size={18} variant="subtle" color="red" onClick={() => removeLayer(layer.id)}><IconTrash size={11} /></ActionIcon>
                              </div>
                            </div>
                          </div>
                        </td>

                        {org.products.map((prod: any) => {
                          const items = prod.cells[layer.id] || [];
                          return (
                            <td key={prod.id}>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                                {items.map((item: any, idx: number) => (
                                  <PersonChip key={idx} name={item.name} stage={item.stage}
                                    dimmed={stageFilter !== "all" && item.stage !== stageFilter && item.stage !== "all"}
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
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div className="layer-bar" style={{ background: "#8b5cf6" }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1d23" }}>Product / Platform Innovation</div>
                      <div style={{ fontSize: 10, color: "#8b5cf6", fontFamily: "monospace", marginBottom: 8 }}>Bleeding Edge R&D</div>
                      <div style={{ background: "#f8f9fc", borderRadius: 8, padding: "5px 10px" }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#8b5cf6" }}><ET value={org.innovationLead} onChange={(v: string) => setOrg((o: any) => ({ ...o, innovationLead: v }))} style={{ fontWeight: 600, color: "#8b5cf6" }} /></div>
                        <div style={{ fontSize: 9, color: "#9ca3af" }}>Innovation Lead</div>
                      </div>
                    </div>
                  </div>
                </td>
                <td colSpan={org.products.length}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {(org.innovation || []).map((name: string, idx: number) => (
                      <PersonChip key={idx} name={name} stage="all"
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
                  <Button variant="subtle" color="indigo" leftSection={<IconPlus size={14} />} onClick={() => setAddRowOpen(true)} radius="xl">Add Row</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 24, marginTop: 16, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Text fz={10} fw={700} c="dimmed" tt="uppercase">Columns:</Text>
            <Badge variant="light" color="blue" size="xs" radius="sm">Church</Badge>
            <Badge variant="light" color="yellow" size="xs" radius="sm">360°</Badge>
            <Badge variant="light" color="green" size="xs" radius="sm">Gloo</Badge>
          </div>
          <div style={{ width: 1, height: 16, background: "#e8ecf1" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Text fz={10} fw={700} c="dimmed" tt="uppercase">Stages:</Text>
            {(["stabilize","modernize","productize","all"] as const).map(s => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div className={`stage-dot ${s}`} />
                <Text fz={10} c="dimmed">{STAGES[s].label}</Text>
              </div>
            ))}
          </div>
          <div style={{ width: 1, height: 16, background: "#e8ecf1" }} />
          <Text fz={10} c="dimmed">Click names to edit · Hover chips for controls · + to add roles</Text>
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
    <Modal opened={opened} onClose={onClose} title={<Text fw={600}>Add Column</Text>} radius="lg" overlayProps={{ backgroundOpacity: 0.3, blur: 4 }}>
      <Stack>
        <TextInput label="Product Name" value={name} onChange={e => setName(e.currentTarget.value)} radius="md" />
        <div><Text fz="sm" fw={500} mb={4}>Type</Text><SegmentedControl value={type} onChange={setType} fullWidth radius="md" color="indigo" data={[{ label: "Church", value: "church" }, { label: "360°", value: "360" }, { label: "Gloo", value: "gloo" }]} /></div>
        <TextInput label="Product Lead" value={lead} onChange={e => setLead(e.currentTarget.value)} radius="md" />
        <Group justify="flex-end"><Button variant="default" onClick={onClose} radius="md">Cancel</Button><Button color="indigo" radius="md" onClick={() => { onAdd({ name: name.trim() || "New Product", type, productLead: lead.trim() || "TBD" }); setName("New Product"); setLead("TBD"); }}>Add</Button></Group>
      </Stack>
    </Modal>
  );
}

function AddRowModal({ opened, onClose, onAdd }: any) {
  const [label, setLabel] = useState("New Layer"); const [sublabel, setSublabel] = useState("Description");
  const [leadName, setLeadName] = useState("TBD"); const [leadRole, setLeadRole] = useState("Layer Lead");
  return (
    <Modal opened={opened} onClose={onClose} title={<Text fw={600}>Add Row</Text>} radius="lg" overlayProps={{ backgroundOpacity: 0.3, blur: 4 }}>
      <Stack>
        <TextInput label="Layer Name" value={label} onChange={e => setLabel(e.currentTarget.value)} radius="md" />
        <TextInput label="Description" value={sublabel} onChange={e => setSublabel(e.currentTarget.value)} radius="md" />
        <TextInput label="Lead Name" value={leadName} onChange={e => setLeadName(e.currentTarget.value)} radius="md" />
        <TextInput label="Lead Role" value={leadRole} onChange={e => setLeadRole(e.currentTarget.value)} radius="md" />
        <Group justify="flex-end"><Button variant="default" onClick={onClose} radius="md">Cancel</Button><Button color="indigo" radius="md" onClick={() => { onAdd({ label: label.trim() || "New Layer", sublabel: sublabel.trim(), lead: { name: leadName.trim() || "TBD", role: leadRole.trim() || "Layer Lead" }, accent: "#6366f1" }); }}>Add</Button></Group>
      </Stack>
    </Modal>
  );
}

function AddRoleModal({ target, onClose, onAdd }: any) {
  const [name, setName] = useState("New Member"); const [stage, setStage] = useState("stabilize");
  return (
    <Modal opened={!!target} onClose={onClose} title={<Text fw={600}>Add Role</Text>} radius="lg" overlayProps={{ backgroundOpacity: 0.3, blur: 4 }}>
      <Stack>
        <TextInput label="Name" value={name} onChange={e => setName(e.currentTarget.value)} radius="md" />
        <div><Text fz="sm" fw={500} mb={4}>Stage</Text><SegmentedControl value={stage} onChange={setStage} fullWidth radius="md" color="indigo" data={[{ label: "Stabilize", value: "stabilize" }, { label: "Modernize", value: "modernize" }, { label: "Productize", value: "productize" }, { label: "All", value: "all" }]} /></div>
        <Group justify="flex-end"><Button variant="default" onClick={onClose} radius="md">Cancel</Button><Button color="indigo" radius="md" onClick={() => { onAdd(name.trim() || "New Member", stage); setName("New Member"); setStage("stabilize"); }}>Add</Button></Group>
      </Stack>
    </Modal>
  );
}
