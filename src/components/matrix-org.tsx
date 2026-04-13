"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Table, Badge, Card, Modal, Button, TextInput, Group, Stack, Text, Title,
  SegmentedControl, ActionIcon, Tooltip, Paper, Box, Flex, Divider, Chip as MChip,
  ThemeIcon, rem, Checkbox, Loader, Center, Container, SimpleGrid, Accordion,
  CloseButton,
} from "@mantine/core";
import {
  IconPlus, IconTrash, IconArrowUp, IconArrowDown, IconArrowLeft, IconArrowRight,
  IconEdit, IconRefresh, IconDownload, IconFileDescription, IconChevronDown, IconChevronRight,
  IconSettings, IconUsers,
} from "@tabler/icons-react";

/* ─── STAGE CONFIG ─── */
const STAGES: Record<string, { label: string; color: string; mantine: string }> = {
  stabilize:  { label: "Stabilize",  color: "#fd7e14", mantine: "orange" },
  modernize:  { label: "Modernize",  color: "#7950f2", mantine: "violet" },
  productize: { label: "Productize", color: "#40c057", mantine: "green" },
  all:        { label: "All Stages", color: "#868e96", mantine: "gray" },
};

const JDS: Record<string, any> = {
  design: {
    title: "Experience Systems Designer",
    reports: "Matthew Slaughter",
    what: "Design in this organization is a systems function, not a production function. AI agents can generate UI at a speed no designer can match — that does not make designers obsolete, it makes the designer's most important job harder.",
    responsibilities: [
      "Forward-deploy to build ministry context into the system.",
      "Architect and evolve the Gloo design system.",
      "Define experience frameworks for each platform surface.",
      "Curate and govern AI-generated output.",
      "Partner with engineering on system executability.",
    ],
    notThis: "A Figma production role. A screen handoff function. A reactive support role.",
    looking: ["6+ years in product design with design systems experience", "Strong systems-thinking", "Experience in platform environments", "Genuine interest in ministry leaders", "Willingness to go on-site with customers", "Comfort leveraging AI tools"],
    success: ["Every surface feels coherent and trustworthy", "New engineers produce something that looks designed", "Ministry leaders feel comfortable immediately", "Every forward deployment refines the design system"],
    flourishing: "Design that respects their attention and gets out of their way is not just good UX. It is an act of service.",
  },
  appEng: {
    title: "Application Layer Engineer",
    reports: "Casey",
    what: "This is the layer customers touch. You build and maintain the unified surface that Ministry Chat and Polymer are becoming.",
    responsibilities: ["Build and evolve the unified customer-facing platform.", "Own the platform architecture at the application layer.", "Forward-deploy with an opinionated architecture.", "Surface complexity as simplicity.", "Own application-level performance, reliability, and security.", "Close the loop."],
    notThis: "A feature factory. A custom app developer. Someone who stays in the codebase and never talks to a customer.",
    looking: ["5+ years in product engineering", "Strong platform thinking", "Experience building role-based interfaces at scale", "Comfort going on-site with enterprise customers", "Ability to work on top of an agentic platform", "Judgment to know when a request should become a platform capability"],
    success: ["Platform is coherent regardless of customer", "Time-to-value for new customers is weeks, not quarters", "Every deployment produces at least one platform capability", "Custom one-off builds decrease over time", "Engineers onboard and ship confidently within days"],
    flourishing: "When you build the platform well, every Platform Solution Engineer on top of it moves faster.",
  },
  platformEng: {
    title: "Platform Solution Engineer",
    reports: "Casey",
    what: "Platform Solution Engineers are the sharp end of forward deployment. You go on-site, embed with staff, feel the friction firsthand.",
    responsibilities: ["Forward-deploy as primary work mode.", "Configure and deploy Ministry Chat for specific customers.", "Build and deploy customer-facing agents.", "Serve as the interface between customer need and platform capability.", "Close the loop.", "Train and support ministry staff."],
    notThis: "A developer who takes requirements at face value. Someone who builds custom apps instead of platform configurations.",
    looking: ["Background in ministry operations is a strong differentiator", "3+ years in technical customer-facing work", "Comfort going on-site", "Technical fluency to configure and troubleshoot", "Genuine passion for the mission", "Strong communication"],
    success: ["Customers forget they're using AI", "Time-to-value is days, not months", "Agent deployments work the first time", "Every deployment surfaces insights", "Ministry staff spend less time behind screens"],
    flourishing: "You are the closest person on this team to the actual mission. Do not lose sight of that.",
  },
  services: {
    title: "Shared Solutions Engineer",
    reports: "Brian Johnson",
    what: "This is the intelligence and reusability layer — built once, used everywhere.",
    responsibilities: ["Build and evolve the agent orchestration layer.", "Forward-deploy to identify shared workflow patterns.", "Define and build skills as reusable infrastructure.", "Build and maintain integrations.", "Design and enforce the trust fabric.", "Define workflow templates."],
    notThis: "An integration plumber. A prompt engineer. A feature developer building one-off solutions.",
    looking: ["7+ years in platform engineering or distributed systems", "Deep experience designing reusable service layers", "Familiarity with agentic orchestration frameworks", "Strong opinions about state management", "Experience building multi-tenant integration infrastructure", "Discipline to bring learnings back to the platform"],
    success: ["New integrations take days, not months", "Skills are versioned and deployed without regression", "Agent workflows complete reliably", "Trust fabric catches violations before incidents", "Every deployment produces new skills or templates"],
    flourishing: "Every hour of manual work you automate is an hour a pastor spends with someone who needed them.",
  },
  infra: {
    title: "Infrastructure & Data Engineer",
    reports: "Daniel Wilson",
    what: "Everything runs on this layer. The goal: organizational context makes agents wise instead of generic.",
    responsibilities: ["Build and steward the Gloo Brain.", "Forward-deploy to map data reality.", "Design for independent data residency.", "Build the auditability and traceability layer.", "Own data normalization and the golden standard.", "Design the continuous improvement loop."],
    notThis: "A data pipeline engineer who moves records from A to B. A DBA. A passive infrastructure maintainer.",
    looking: ["7+ years in data engineering or ML infrastructure", "Deep experience with knowledge graph or RAG architectures", "Strong opinions about data modeling", "Experience designing multi-tenant data residency", "Comfort building feedback loops", "Willingness to go on-site"],
    success: ["Every new customer adds signal", "Agents have context without manual curation", "Data residency never blocks a deal", "New orgs modeled within hours, not weeks", "System knows what it knows and gets better"],
    flourishing: "Build it like it matters, because it does.",
  },
  product: {
    title: "Outcome Product Lead",
    reports: "Josh / Leadership",
    what: "Execution is no longer the bottleneck. Product judgment is the rarest and most expensive resource in the system.",
    responsibilities: ["Forward-deploy as primary research method.", "Define outcomes, not features.", "Prioritize ruthlessly and say no decisively.", "Design rapid experiments to validate assumptions.", "Sequence the roadmap across layers."],
    notThis: "A backlog administrator. A requirements writer. A coordination layer.",
    looking: ["7+ years in product leadership", "Demonstrated ability to define outcomes and resist scope creep", "Strategic thinking across sprints and 18-month vision", "Comfort going on-site with enterprise customers", "Deep comfort with faith-based technology market", "Ability to say no with clarity"],
    success: ["Roadmap understood without kickoff meetings", "Every shipped feature traces to customer observation", "Platform compounds because we built right things in right order", "Engineering time never wasted on invalidatable work"],
    flourishing: "Velocity is not inherently good. Product clarity is how we honor the time of the humans on the other end.",
  },
};

const layerDescriptions: Record<string, any> = {
  design: {
    purpose: "Design is a systems function, not a production function.",
    activities: ["Forward-deploy into customer orgs","Translate observations into design constraints","Architect the Gloo design system","Define experience frameworks","Curate AI-generated output","Partner with engineering"],
    outputs: ["Gloo design system","Experience frameworks","Design constraints & tokens","Field research","AI output governance"],
    notThis: "A Figma production role. A screen handoff function.",
    flourishing: "Design that respects attention and gets out of the way is an act of service.",
  },
  appEng: {
    purpose: "Application Layer Engineers own the unified platform surface.",
    activities: ["Build the unified customer-facing platform","Own platform architecture","Forward-deploy with opinionated architecture","Surface complexity as simplicity","Own performance & security","Close the loop"],
    outputs: ["Unified platform","Role-configured dashboards","Application architecture","White-labeled surfaces","Performance & reliability"],
    notThis: "A feature factory. A custom app developer.",
    flourishing: "When you build the platform well, every PSE moves faster.",
  },
  platformEng: {
    purpose: "Platform Solution Engineers are the sharp end of forward deployment.",
    activities: ["Forward-deploy as primary work mode","Configure and deploy Ministry Chat","Build customer-facing agents","Interface between customer and platform","Close the loop","Train ministry staff"],
    outputs: ["Customer deployments","Configured agents","Onboarding & training","Deployment intelligence","Platform gap reports"],
    notThis: "A developer who takes requirements at face value.",
    flourishing: "You are closest to the actual mission. Do not lose sight of that.",
  },
  services: {
    purpose: "The intelligence and reusability layer — built once, used everywhere.",
    activities: ["Build agent orchestration layer","Identify shared workflow patterns","Build skills as reusable infrastructure","Build and maintain integrations","Design the trust fabric","Define workflow templates"],
    outputs: ["Agent orchestration","Skills library","Integration registry","Trust fabric","Workflow templates","State management"],
    notThis: "An integration plumber. A prompt engineer.",
    flourishing: "Workflows you build free ministry staff from administrative friction.",
  },
  infra: {
    purpose: "Everything runs on this layer. Context makes agents wise instead of generic.",
    activities: ["Build the Gloo Brain","Map data reality on-site","Design data residency","Build auditability layer","Own data normalization","Design continuous improvement loop"],
    outputs: ["Gloo Brain","Data residency architecture","Auditability systems","Data normalization","Feedback loop","Cost analytics"],
    notThis: "A data pipeline engineer. A DBA. A passive maintainer.",
    flourishing: "Build it like it matters, because it does.",
  },
  product: {
    purpose: "Product judgment is the rarest and most expensive resource in the system.",
    activities: ["Forward-deploy as research method","Define outcomes, not features","Prioritize ruthlessly","Design rapid experiments","Sequence roadmap across layers"],
    outputs: ["Prioritized roadmap","Outcome statements","Experiment designs","Deployment intelligence","Dependency maps"],
    notThis: "A backlog administrator. A requirements writer.",
    flourishing: "Velocity is not inherently good. Product clarity honors the time of the humans on the other end.",
  },
};

const initData = {
  layers: [
    { id: "dataAnalytics", label: "Data & Analytics", sublabel: "Reporting · BI · Insights · Data Products", lead: { name: "TBD", role: "Data & Analytics Lead" }, color: "#1a2a3a", accent: "#4dabf7" },
    { id: "enterpriseSys", label: "Enterprise Systems", sublabel: "ERP · HRIS · Finance · Internal Tools", lead: { name: "TBD", role: "Enterprise Systems Lead" }, color: "#1a1a2e", accent: "#b197fc" },
    { id: "coreInfra", label: "Core Infrastructure", sublabel: "Cloud · DevOps · Networking · Reliability", lead: { name: "TBD", role: "Core Infrastructure Lead" }, color: "#0e1e1a", accent: "#63e6be" },
    { id: "security", label: "Security", sublabel: "AppSec · Compliance · Risk · Access", lead: { name: "TBD", role: "Security Lead" }, color: "#1e1000", accent: "#ffa94d" },
    { id: "helpDesk", label: "Help Desk", sublabel: "Support · Ticketing · Escalation", lead: { name: "TBD", role: "Help Desk Lead" }, color: "#101520", accent: "#adb5bd" },
    { id: "product", label: "Product", sublabel: "Outcomes · Roadmap · Research", lead: { name: "TBD", role: "Outcome Product Lead" }, color: "#2a1a3a", accent: "#f783ac" },
    { id: "design", label: "Design", sublabel: "Experience Systems · Design System · Research", lead: { name: "Matthew Slaughter", role: "Head of Design" }, color: "#1a2a3a", accent: "#ff922b" },
    { id: "platformEng", label: "Platform Solution Engineer", sublabel: "Forward Deployment · Config · Agent Deployment", lead: { name: "Casey", role: "Application Layer Lead" }, color: "#0f2a4a", accent: "#74c0fc" },
    { id: "appEng", label: "Application Layer Engineer", sublabel: "Platform Architecture · Unified Surface", lead: { name: "Casey", role: "Application Layer Lead" }, color: "#1a3a5c", accent: "#4dabf7" },
    { id: "services", label: "Shared Solutions", sublabel: "Agent Orchestration · Skills · Integrations · Trust Fabric", lead: { name: "Brian Johnson", role: "Platform Services Lead" }, color: "#1a3d2e", accent: "#51cf66" },
    { id: "infra", label: "Infrastructure & Data", sublabel: "Gloo Brain · Data Normalization · Auditability", lead: { name: "Daniel Wilson", role: "Head of AI Engineering" }, color: "#3a1a3a", accent: "#b197fc" },
  ],
  products: [
    { id: "church", name: "Church", type: "church", productLead: "TBD", cells: {
        product: [{ name: "Outcome Product Lead", stage: "all" }], design: [{ name: "Experience Systems Designer", stage: "all" }],
        appEng: [{ name: "App Layer Eng 1", stage: "modernize" }, { name: "App Layer Eng 2", stage: "productize" }],
        platformEng: [{ name: "PSE 1", stage: "stabilize" }, { name: "PSE 2", stage: "stabilize" }, { name: "PSE 3", stage: "modernize" }],
        services: [{ name: "Shared Solutions Eng 1", stage: "modernize" }, { name: "Shared Solutions Eng 2", stage: "productize" }],
        infra: [{ name: "Infra Eng 1", stage: "stabilize" }, { name: "Infra Eng 2", stage: "modernize" }, { name: "Infra Eng 3", stage: "productize" }],
        dataAnalytics: [{ name: "Data Analyst 1", stage: "all" }], enterpriseSys: [{ name: "Enterprise Sys Eng 1", stage: "stabilize" }],
        coreInfra: [{ name: "Core Infra Eng 1", stage: "all" }], security: [{ name: "Security Eng 1", stage: "all" }], helpDesk: [{ name: "Help Desk 1", stage: "stabilize" }],
      }},
    { id: "ag", name: "AG", type: "360", productLead: "TBD", cells: {
        product: [{ name: "Outcome Product Lead", stage: "all" }], design: [{ name: "Experience Systems Designer", stage: "all" }],
        appEng: [{ name: "App Layer Eng 1", stage: "modernize" }], platformEng: [{ name: "PSE 4", stage: "stabilize" }, { name: "PSE 5", stage: "stabilize" }],
        services: [{ name: "Shared Solutions Eng 1", stage: "modernize" }, { name: "Shared Solutions Eng 2", stage: "modernize" }],
        infra: [{ name: "Infra Eng 1", stage: "modernize" }], dataAnalytics: [{ name: "Data Analyst 1", stage: "all" }],
        enterpriseSys: [{ name: "Enterprise Sys Eng 1", stage: "stabilize" }], coreInfra: [{ name: "Core Infra Eng 1", stage: "all" }],
        security: [{ name: "Security Eng 1", stage: "all" }], helpDesk: [{ name: "Help Desk 1", stage: "stabilize" }],
      }},
    { id: "eten", name: "ETEN", type: "360", productLead: "TBD", cells: {
        product: [{ name: "Outcome Product Lead", stage: "all" }], design: [{ name: "Experience Systems Designer", stage: "all" }],
        appEng: [{ name: "App Layer Eng 1", stage: "modernize" }], platformEng: [{ name: "PSE 6", stage: "stabilize" }],
        services: [{ name: "Shared Solutions Eng 1", stage: "stabilize" }], infra: [{ name: "Infra Eng 1", stage: "stabilize" }],
        dataAnalytics: [{ name: "Data Analyst 1", stage: "all" }], enterpriseSys: [{ name: "Enterprise Sys Eng 1", stage: "stabilize" }],
        coreInfra: [{ name: "Core Infra Eng 1", stage: "all" }], security: [{ name: "Security Eng 1", stage: "all" }], helpDesk: [{ name: "Help Desk 1", stage: "stabilize" }],
      }},
    { id: "iv", name: "IV", type: "360", productLead: "TBD", cells: {
        product: [{ name: "Outcome Product Lead", stage: "all" }], design: [{ name: "Experience Systems Designer", stage: "all" }],
        appEng: [{ name: "App Layer Eng 1", stage: "modernize" }], platformEng: [{ name: "PSE 7", stage: "modernize" }, { name: "PSE 8", stage: "modernize" }],
        services: [{ name: "Shared Solutions Eng 1", stage: "modernize" }], infra: [{ name: "Infra Eng 1", stage: "modernize" }],
        dataAnalytics: [{ name: "Data Analyst 1", stage: "all" }], enterpriseSys: [{ name: "Enterprise Sys Eng 1", stage: "stabilize" }],
        coreInfra: [{ name: "Core Infra Eng 1", stage: "all" }], security: [{ name: "Security Eng 1", stage: "all" }], helpDesk: [{ name: "Help Desk 1", stage: "stabilize" }],
      }},
    { id: "abs", name: "ABS", type: "360", productLead: "TBD", cells: {
        product: [{ name: "Outcome Product Lead", stage: "all" }], design: [{ name: "Experience Systems Designer", stage: "all" }],
        appEng: [{ name: "App Layer Eng 1", stage: "modernize" }], platformEng: [{ name: "PSE 9", stage: "modernize" }],
        services: [{ name: "Shared Solutions Eng 1", stage: "modernize" }], infra: [{ name: "Infra Eng 1", stage: "modernize" }],
        dataAnalytics: [{ name: "Data Analyst 1", stage: "all" }], enterpriseSys: [{ name: "Enterprise Sys Eng 1", stage: "stabilize" }],
        coreInfra: [{ name: "Core Infra Eng 1", stage: "all" }], security: [{ name: "Security Eng 1", stage: "all" }], helpDesk: [{ name: "Help Desk 1", stage: "stabilize" }],
      }},
  ],
  innovation: ["Matt Michel"],
  innovationLead: "Matt",
  executives: [
    { id: "exec1", name: "Justin", role: "IT & Operations Leader", color: "#1a2030", accent: "#4dabf7", layers: ["dataAnalytics","enterpriseSys","coreInfra","security","helpDesk"] },
    { id: "exec2", name: "TBD", role: "Product Leader", color: "#1a1a2a", accent: "#f783ac", layers: ["product"] },
    { id: "exec3", name: "Daniel", role: "Engineering Leader", color: "#0f1a10", accent: "#51cf66", layers: ["design","platformEng","appEng","services","infra"] },
  ],
};

const typeColors: Record<string, { bg: string; badge: string; badgeText: string; mantine: string }> = {
  church: { bg: "#f0f5ff", badge: "#4dabf7", badgeText: "Church", mantine: "blue" },
  "360":  { bg: "#fffbe6", badge: "#fab005", badgeText: "360°", mantine: "yellow" },
  gloo:   { bg: "#f0fdf4", badge: "#51cf66", badgeText: "Gloo", mantine: "green" },
};

function uid() { return Math.random().toString(36).slice(2, 8); }

/* ── Inline editable text ── */
function ET({ value, onChange, fw, fz, c }: any) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (editing && ref.current) ref.current.focus(); }, [editing]);
  useEffect(() => { setDraft(value); }, [value]);
  const commit = () => { setEditing(false); if (draft.trim()) onChange(draft.trim()); else setDraft(value); };
  if (editing) return (
    <TextInput ref={ref} value={draft} onChange={e => setDraft(e.currentTarget.value)} onBlur={commit}
      onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setDraft(value); setEditing(false); } }}
      size="xs" variant="filled" styles={{ input: { fontWeight: fw || 400, fontSize: fz || 13, color: c } }} />
  );
  return (
    <Text component="span" fw={fw} fz={fz} c={c} onClick={() => setEditing(true)}
      style={{ cursor: "text", borderBottom: "1px dashed #dee2e6", paddingBottom: 1 }}>
      {value || "—"}
    </Text>
  );
}

/* ── Person chip with stage ── */
function PersonChip({ name, stage, onRename, onStageChange, onDelete, onJD, dimmed }: any) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (editing && ref.current) ref.current.focus(); }, [editing]);
  const commit = () => { setEditing(false); if (draft.trim() && draft.trim() !== name) onRename(draft.trim()); else setDraft(name); };
  const stageInfo = STAGES[stage] || STAGES.all;

  return (
    <Paper shadow="0" p="4px 8px" radius="sm" withBorder
      style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 4, marginRight: 4, opacity: dimmed ? 0.3 : 1, borderColor: stageInfo.color + "55" }}>
      <Badge size="xs" variant="light" color={stageInfo.mantine} style={{ flexShrink: 0 }}>
        {stage === "stabilize" ? "S" : stage === "modernize" ? "M" : stage === "productize" ? "P" : "ALL"}
      </Badge>
      {editing ? (
        <TextInput ref={ref} value={draft} onChange={e => setDraft(e.currentTarget.value)} onBlur={commit}
          onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setDraft(name); setEditing(false); } }}
          size="xs" variant="unstyled" styles={{ input: { fontSize: 12, padding: 0, height: 20, minHeight: 20 } }} />
      ) : (
        <Text fz={12} onClick={() => setEditing(true)} style={{ cursor: "text" }}>{name}</Text>
      )}
      <Group gap={2}>
        {onJD && (
          <Tooltip label="Job Description" position="top">
            <ActionIcon size="xs" variant="subtle" color="gray" onClick={onJD}><IconFileDescription size={12} /></ActionIcon>
          </Tooltip>
        )}
        <Tooltip label="Cycle Stage" position="top">
          <ActionIcon size="xs" variant="subtle" color="gray" onClick={() => {
            const order = ["stabilize", "modernize", "productize", "all"];
            const i = order.indexOf(stage);
            onStageChange(order[(i + 1) % order.length]);
          }}><IconRefresh size={12} /></ActionIcon>
        </Tooltip>
        <Tooltip label="Remove" position="top">
          <ActionIcon size="xs" variant="subtle" color="red" onClick={onDelete}><IconTrash size={12} /></ActionIcon>
        </Tooltip>
      </Group>
    </Paper>
  );
}

/* ── JD Modal ── */
function JDModalContent({ layerId, layer, onClose }: any) {
  const jd = JDS[layerId];
  if (!jd) return null;
  return (
    <Stack gap="md">
      <div>
        <Text fz="xs" c="dimmed" tt="uppercase" fw={600} lts={1}>{layer.label}</Text>
        <Title order={3}>{jd.title}</Title>
        <Text fz="sm" c="dimmed">Reports to: {jd.reports}</Text>
      </div>
      <Divider />
      <div>
        <Text fz="sm" fw={600} mb={4}>What This Role Does</Text>
        <Text fz="sm" c="dimmed" lh={1.7}>{jd.what}</Text>
      </div>
      <div>
        <Text fz="sm" fw={600} mb={8}>Responsibilities</Text>
        {jd.responsibilities.map((r: string, i: number) => (
          <Group key={i} gap={8} mb={6} align="flex-start" wrap="nowrap">
            <Text c="teal" fz="xs" mt={3}>▸</Text>
            <Text fz="sm" c="dimmed" lh={1.6}>{r}</Text>
          </Group>
        ))}
      </div>
      <SimpleGrid cols={2}>
        <div>
          <Text fz="sm" fw={600} mb={8}>What We're Looking For</Text>
          {jd.looking.map((l: string, i: number) => (
            <Group key={i} gap={6} mb={4} align="flex-start" wrap="nowrap">
              <Text c="teal" fz={10} mt={3}>◆</Text>
              <Text fz="xs" c="dimmed" lh={1.5}>{l}</Text>
            </Group>
          ))}
        </div>
        <div>
          <Text fz="sm" fw={600} mb={8}>Success Looks Like</Text>
          {jd.success.map((s: string, i: number) => (
            <Group key={i} gap={6} mb={4} align="flex-start" wrap="nowrap">
              <Text c="green" fz={10} mt={3}>◆</Text>
              <Text fz="xs" c="dimmed" lh={1.5}>{s}</Text>
            </Group>
          ))}
        </div>
      </SimpleGrid>
      <Paper p="sm" radius="sm" bg="red.0" withBorder style={{ borderColor: "var(--mantine-color-red-3)" }}>
        <Text fz="xs" fw={700} c="red" tt="uppercase" mb={4}>What This Role Is Not</Text>
        <Text fz="sm" c="dimmed" fs="italic">{jd.notThis}</Text>
      </Paper>
      <Paper p="sm" radius="sm" bg="teal.0" withBorder style={{ borderColor: "var(--mantine-color-teal-3)" }}>
        <Text fz="xs" fw={700} c="teal" tt="uppercase" mb={4}>On Human Flourishing</Text>
        <Text fz="sm" c="dimmed">{jd.flourishing}</Text>
      </Paper>
    </Stack>
  );
}

/* ── Layer architecture view ── */
function LayerView({ layers }: any) {
  return (
    <Stack gap="lg">
      {layers.map((layer: any) => {
        const desc = layerDescriptions[layer.id];
        if (!desc) return null;
        return (
          <Card key={layer.id} withBorder radius="md" padding="lg">
            <Group mb="sm" gap="md" align="baseline">
              <Title order={4}>{layer.label}</Title>
              <Text fz="xs" c="dimmed" ff="monospace">{layer.sublabel}</Text>
            </Group>
            <Text fz="sm" c="dimmed" lh={1.7} mb="md">{desc.purpose}</Text>
            <SimpleGrid cols={2}>
              <div>
                <Text fz="xs" fw={700} c="teal" tt="uppercase" mb="xs">What Happens Here</Text>
                {desc.activities.map((a: string, i: number) => (
                  <Group key={i} gap={8} mb={6} align="flex-start" wrap="nowrap">
                    <Text c="teal" fz="xs" mt={2}>▸</Text>
                    <Text fz="sm" c="dimmed">{a}</Text>
                  </Group>
                ))}
              </div>
              <Stack gap="md">
                <div>
                  <Text fz="xs" fw={700} c="teal" tt="uppercase" mb="xs">Key Outputs</Text>
                  <Group gap={4}>
                    {desc.outputs.map((o: string, i: number) => (
                      <Badge key={i} variant="light" color="teal" size="sm">{o}</Badge>
                    ))}
                  </Group>
                </div>
                <Paper p="xs" radius="sm" bg="red.0">
                  <Text fz="xs" fw={700} c="red" mb={2}>NOT THIS</Text>
                  <Text fz="xs" c="dimmed" fs="italic">{desc.notThis}</Text>
                </Paper>
                <Paper p="xs" radius="sm" bg="teal.0">
                  <Text fz="xs" fw={700} c="teal" mb={2}>ON FLOURISHING</Text>
                  <Text fz="xs" c="dimmed">{desc.flourishing}</Text>
                </Paper>
              </Stack>
            </SimpleGrid>
          </Card>
        );
      })}
    </Stack>
  );
}

/* ═══════════════ MAIN COMPONENT ═══════════════ */
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

  // Convex persistence
  const convexData = useQuery(api.orgData.get, { key: "default" });
  const saveToConvex = useMutation(api.orgData.save);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (loaded) return;
    if (convexData === undefined) return;
    if (convexData && convexData.data) {
      try { setOrg(JSON.parse(convexData.data)); } catch {}
    }
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

  // ── Mutators ──
  const updateLayerLead = (id: string, v: string) => setOrg((o: any) => ({ ...o, layers: o.layers.map((l: any) => l.id === id ? { ...l, lead: { ...l.lead, name: v } } : l) }));
  const addLayer = (layer: any) => { const id = uid(); setOrg((o: any) => ({ ...o, layers: [...o.layers, { ...layer, id }] })); setAddRowOpen(false); };
  const removeLayer = (id: string) => setOrg((o: any) => ({ ...o, layers: o.layers.filter((l: any) => l.id !== id) }));
  const moveLayer = (id: string, dir: number) => setOrg((o: any) => { const arr = [...o.layers]; const i = arr.findIndex((l: any) => l.id === id); const j = i + dir; if (j < 0 || j >= arr.length) return o; [arr[i], arr[j]] = [arr[j], arr[i]]; return { ...o, layers: arr }; });
  const updateProductName = (id: string, v: string) => setOrg((o: any) => ({ ...o, products: o.products.map((p: any) => p.id === id ? { ...p, name: v } : p) }));
  const updateProductLead = (id: string, v: string) => setOrg((o: any) => ({ ...o, products: o.products.map((p: any) => p.id === id ? { ...p, productLead: v } : p) }));
  const addProduct = ({ name, type, productLead }: any) => { const id = uid(); const cells: any = {}; org.layers.forEach((l: any) => { cells[l.id] = []; }); setOrg((o: any) => ({ ...o, products: [...o.products, { id, name, type, productLead, cells }] })); setAddColOpen(false); };
  const removeProduct = (id: string) => setOrg((o: any) => ({ ...o, products: o.products.filter((p: any) => p.id !== id) }));
  const moveProduct = (id: string, dir: number) => setOrg((o: any) => { const arr = [...o.products]; const i = arr.findIndex((p: any) => p.id === id); const j = i + dir; if (j < 0 || j >= arr.length) return o; [arr[i], arr[j]] = [arr[j], arr[i]]; return { ...o, products: arr }; });
  const updateCellItem = (pId: string, lId: string, idx: number, field: string, val: string) => setOrg((o: any) => ({ ...o, products: o.products.map((p: any) => { if (p.id !== pId) return p; const n = [...(p.cells[lId] || [])]; n[idx] = { ...n[idx], [field]: val }; return { ...p, cells: { ...p.cells, [lId]: n } }; }) }));
  const deleteCellItem = (pId: string, lId: string, idx: number) => setOrg((o: any) => ({ ...o, products: o.products.map((p: any) => { if (p.id !== pId) return p; const n = [...(p.cells[lId] || [])]; n.splice(idx, 1); return { ...p, cells: { ...p.cells, [lId]: n } }; }) }));
  const addCellItem = (pId: string, lId: string, name: string, stage: string) => setOrg((o: any) => ({ ...o, products: o.products.map((p: any) => { if (p.id !== pId) return p; return { ...p, cells: { ...p.cells, [lId]: [...(p.cells[lId] || []), { name, stage }] } }; }) }));
  const addExecutive = () => { const e = { id: uid(), name: "New Leader", role: "Executive Role", color: "#1a2030", accent: "#4dabf7", layers: [] as string[] }; setOrg((o: any) => ({ ...o, executives: [...(o.executives || []), e] })); setAssignOpen(e); };
  const removeExecutive = (id: string) => setOrg((o: any) => ({ ...o, executives: (o.executives || []).filter((e: any) => e.id !== id) }));
  const updateExecName = (id: string, v: string) => setOrg((o: any) => ({ ...o, executives: (o.executives || []).map((e: any) => e.id === id ? { ...e, name: v } : e) }));
  const updateExecRole = (id: string, v: string) => setOrg((o: any) => ({ ...o, executives: (o.executives || []).map((e: any) => e.id === id ? { ...e, role: v } : e) }));
  const updateExecLayers = (id: string, ls: string[]) => setOrg((o: any) => ({ ...o, executives: (o.executives || []).map((e: any) => e.id === id ? { ...e, layers: ls } : e) }));
  const toggleCollapse = (id: string) => setCollapsedExecs(s => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  // Build exec coverage
  const coverage: Record<string, string> = {};
  (org.executives || []).forEach((ex: any) => ex.layers.forEach((lId: string) => { coverage[lId] = ex.id; }));
  const execById: Record<string, any> = {};
  (org.executives || []).forEach((ex: any) => { execById[ex.id] = ex; });

  // Build row segments for ELT column
  const segments: any[] = [];
  let si = 0;
  while (si < org.layers.length) {
    const lId = org.layers[si].id;
    const execId = coverage[lId];
    if (!execId) { segments.push({ exec: null, rowSpan: 1 }); si++; }
    else {
      let span = 0, j = si;
      while (j < org.layers.length && coverage[org.layers[j].id] === execId) { span++; j++; }
      segments.push({ exec: execById[execId], rowSpan: span });
      for (let k = 1; k < span; k++) segments.push(null);
      si = j;
    }
  }

  if (!loaded) {
    return <Center h="100vh"><Loader color="teal" /></Center>;
  }

  return (
    <Container size="xl" py="lg">
      {/* ── JD Modal ── */}
      <Modal opened={!!jdOpen} onClose={() => setJdOpen(null)} size="lg" title={null} padding="lg">
        {jdOpen && <JDModalContent layerId={jdOpen.layerId} layer={jdOpen.layer} onClose={() => setJdOpen(null)} />}
      </Modal>

      {/* ── Assign Rows Modal ── */}
      <Modal opened={!!assignOpen} onClose={() => setAssignOpen(null)} title={`Assign rows to ${assignOpen?.name || ""}`} size="sm">
        {assignOpen && (
          <Stack gap="xs">
            {org.layers.map((layer: any) => {
              const checked = (assignOpen.layers || []).includes(layer.id);
              return (
                <Checkbox key={layer.id} label={layer.label} checked={checked}
                  onChange={() => {
                    const ls = checked ? assignOpen.layers.filter((l: string) => l !== layer.id) : [...assignOpen.layers, layer.id];
                    updateExecLayers(assignOpen.id, ls);
                    setAssignOpen({ ...assignOpen, layers: ls });
                  }} />
              );
            })}
          </Stack>
        )}
      </Modal>

      {/* ── Add Column Modal ── */}
      <AddColumnModal opened={addColOpen} onClose={() => setAddColOpen(false)} onAdd={addProduct} />

      {/* ── Add Row Modal ── */}
      <AddRowModal opened={addRowOpen} onClose={() => setAddRowOpen(false)} onAdd={addLayer} />

      {/* ── Add Role Modal ── */}
      <AddRoleModal target={addRoleTarget} onClose={() => setAddRoleTarget(null)} onAdd={(name: string, stage: string) => { if (addRoleTarget) addCellItem(addRoleTarget.prodId, addRoleTarget.layerId, name, stage); setAddRoleTarget(null); }} />

      {/* ── Header ── */}
      <Stack align="center" mb="lg" gap={4}>
        <Text fz="xs" c="dimmed" tt="uppercase" lts={3} ff="monospace">Gloo — Platform and Product Team</Text>
        <Title order={2}>Platform Matrix Org</Title>
        <Text fz="sm" c="dimmed">Q2 2026 · Draft pending Ben alignment</Text>
        <Group gap="sm" mt="xs">
          <Badge variant="light" color={saved ? "green" : saving ? "yellow" : "gray"} size="sm">
            {saved ? "✓ Saved to cloud" : saving ? "Saving..." : "Auto-saving"}
          </Badge>
          <Button variant="subtle" size="xs" leftSection={<IconDownload size={14} />}
            onClick={() => { navigator.clipboard.writeText(JSON.stringify(org, null, 2)).then(() => alert("Copied!")); }}>
            Export
          </Button>
          <Button variant="subtle" size="xs" color="red" onClick={() => { if (window.confirm("Reset to defaults?")) setOrg(initData); }}>Reset</Button>
        </Group>
      </Stack>

      {/* ── View toggle ── */}
      <Center mb="md">
        <SegmentedControl value={view} onChange={setView} data={[
          { label: "👥 People", value: "people" },
          { label: "⚙️ How Layers Work", value: "layers" },
        ]} />
      </Center>

      {view === "layers" ? <LayerView layers={org.layers} /> : (
        <>
          {/* ── Stage filter ── */}
          <Group mb="md" gap="xs">
            <Text fz="xs" c="dimmed" fw={600} tt="uppercase" ff="monospace">Filter:</Text>
            {["all", "stabilize", "modernize", "productize"].map(s => {
              const st = STAGES[s];
              return (
                <Button key={s} size="xs" variant={stageFilter === s ? "filled" : "light"} color={st.mantine}
                  onClick={() => setStageFilter(s)}>
                  {st.label}
                </Button>
              );
            })}
          </Group>

          {/* ── Matrix Table ── */}
          <Paper withBorder radius="md" style={{ overflow: "auto" }}>
            <Table striped highlightOnHover withTableBorder withColumnBorders style={{ minWidth: 900 }}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th style={{ width: 140, verticalAlign: "middle" }}>
                    <Stack gap={4} align="flex-start">
                      <Text fz="xs" fw={700} c="dimmed" tt="uppercase">ELT</Text>
                      <Button size="compact-xs" variant="subtle" leftSection={<IconPlus size={12} />} onClick={addExecutive}>Add</Button>
                    </Stack>
                  </Table.Th>
                  <Table.Th style={{ width: 210 }}>
                    <Text fz="xs" fw={700} c="dimmed" tt="uppercase">Layer / Lead</Text>
                  </Table.Th>
                  {org.products.map((p: any, pi: number) => {
                    const tc = typeColors[p.type] || typeColors.church;
                    return (
                      <Table.Th key={p.id} style={{ textAlign: "center", minWidth: 160, background: tc.bg, position: "relative" }}>
                        <Group justify="center" gap={2} mb={4}>
                          <ActionIcon size="xs" variant="subtle" disabled={pi === 0} onClick={() => moveProduct(p.id, -1)}><IconArrowLeft size={12} /></ActionIcon>
                          <Badge color={tc.mantine} variant="light" size="xs">{tc.badgeText}</Badge>
                          <ActionIcon size="xs" variant="subtle" disabled={pi === org.products.length - 1} onClick={() => moveProduct(p.id, 1)}><IconArrowRight size={12} /></ActionIcon>
                          <ActionIcon size="xs" variant="subtle" color="red" onClick={() => removeProduct(p.id)}><IconTrash size={12} /></ActionIcon>
                        </Group>
                        <Text fw={700} fz="md"><ET value={p.name} onChange={(v: string) => updateProductName(p.id, v)} fw={700} fz={14} /></Text>
                        <Paper p={4} radius="sm" bg="gray.0" mt={4} style={{ display: "inline-block" }}>
                          <Text fz="xs" fw={600} c={tc.mantine}><ET value={p.productLead} onChange={(v: string) => updateProductLead(p.id, v)} fw={600} fz={12} c={tc.badge} /></Text>
                          <Text fz={10} c="dimmed">Product Lead</Text>
                        </Paper>
                      </Table.Th>
                    );
                  })}
                  <Table.Th style={{ width: 60, verticalAlign: "middle" }}>
                    <Button size="compact-xs" variant="subtle" onClick={() => setAddColOpen(true)}>+ Col</Button>
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {org.layers.map((layer: any, li: number) => {
                  const seg = segments[li];
                  const coveredByExec = coverage[layer.id] ? execById[coverage[layer.id]] : null;
                  const isCollapsed = coveredByExec && collapsedExecs.has(coveredByExec.id);

                  return (
                    <Table.Tr key={layer.id}>
                      {/* ELT column */}
                      {seg !== null && (
                        seg && seg.exec ? (
                          <Table.Td rowSpan={seg.rowSpan} style={{ verticalAlign: "middle", cursor: "pointer", background: "#fafbfc" }}
                            onClick={() => toggleCollapse(seg.exec.id)}>
                            <Group gap={4} mb={4}>
                              {collapsedExecs.has(seg.exec.id) ? <IconChevronRight size={14} /> : <IconChevronDown size={14} />}
                              <Text fz="sm" fw={700}><ET value={seg.exec.name} onChange={(v: string) => updateExecName(seg.exec.id, v)} fw={700} fz={13} /></Text>
                            </Group>
                            <Text fz="xs" c="dimmed"><ET value={seg.exec.role} onChange={(v: string) => updateExecRole(seg.exec.id, v)} fz={11} c="dimmed" /></Text>
                            <Group gap={4} mt={6}>
                              <Button size="compact-xs" variant="subtle" onClick={(e: any) => { e.stopPropagation(); setAssignOpen(seg.exec); }}>Assign</Button>
                              <ActionIcon size="xs" variant="subtle" color="red" onClick={(e: any) => { e.stopPropagation(); removeExecutive(seg.exec.id); }}><IconTrash size={12} /></ActionIcon>
                            </Group>
                          </Table.Td>
                        ) : (
                          <Table.Td style={{ verticalAlign: "middle", background: "#fafbfc" }}>
                            <Text fz={10} c="dimmed" ta="center">—</Text>
                          </Table.Td>
                        )
                      )}

                      {isCollapsed ? (
                        <Table.Td colSpan={org.products.length + 2}>
                          <Group gap={8}>
                            <Box w={3} h={14} bg={layer.accent} style={{ borderRadius: 2 }} />
                            <Text fz="xs" fw={600} c="dimmed">{layer.label}</Text>
                            <Text fz={10} c="dimmed" ff="monospace">{layer.sublabel}</Text>
                          </Group>
                        </Table.Td>
                      ) : (
                        <>
                          {/* Layer info */}
                          <Table.Td style={{ verticalAlign: "top" }}>
                            <Group gap={8} wrap="nowrap" align="flex-start">
                              <Box w={3} mih={40} bg={layer.accent} style={{ borderRadius: 2, flexShrink: 0 }} />
                              <div style={{ flex: 1 }}>
                                <Text fz="sm" fw={700}>{layer.label}</Text>
                                <Text fz={10} c="dimmed" ff="monospace" mb={6}>{layer.sublabel}</Text>
                                <Paper p={4} radius="sm" bg="gray.0">
                                  <ET value={layer.lead.name} onChange={(v: string) => updateLayerLead(layer.id, v)} fw={600} fz={12} />
                                  <Text fz={10} c="dimmed">{layer.lead.role}</Text>
                                </Paper>
                                {JDS[layer.id] && (
                                  <Button size="compact-xs" variant="subtle" mt={6} onClick={() => setJdOpen({ layerId: layer.id, layer })}>
                                    View JD →
                                  </Button>
                                )}
                                <Group gap={4} mt={4}>
                                  <ActionIcon size="xs" variant="subtle" disabled={li === 0} onClick={() => moveLayer(layer.id, -1)}><IconArrowUp size={12} /></ActionIcon>
                                  <ActionIcon size="xs" variant="subtle" disabled={li === org.layers.length - 1} onClick={() => moveLayer(layer.id, 1)}><IconArrowDown size={12} /></ActionIcon>
                                  <ActionIcon size="xs" variant="subtle" color="red" onClick={() => removeLayer(layer.id)}><IconTrash size={12} /></ActionIcon>
                                </Group>
                              </div>
                            </Group>
                          </Table.Td>

                          {/* Product cells */}
                          {org.products.map((prod: any) => {
                            const items = prod.cells[layer.id] || [];
                            const tc = typeColors[prod.type] || typeColors.church;
                            const hasJD = !!JDS[layer.id];
                            return (
                              <Table.Td key={prod.id} style={{ verticalAlign: "top", background: tc.bg }}>
                                <Flex wrap="wrap" gap={2}>
                                  {items.map((item: any, idx: number) => {
                                    const dimmed = stageFilter !== "all" && item.stage !== stageFilter && item.stage !== "all";
                                    return (
                                      <PersonChip key={idx} name={item.name} stage={item.stage} dimmed={dimmed}
                                        onRename={(v: string) => updateCellItem(prod.id, layer.id, idx, "name", v)}
                                        onStageChange={(v: string) => updateCellItem(prod.id, layer.id, idx, "stage", v)}
                                        onDelete={() => deleteCellItem(prod.id, layer.id, idx)}
                                        onJD={hasJD ? () => setJdOpen({ layerId: layer.id, layer }) : undefined} />
                                    );
                                  })}
                                  <Tooltip label="Add role">
                                    <ActionIcon size="sm" variant="light" color="gray" onClick={() => setAddRoleTarget({ prodId: prod.id, layerId: layer.id })}>
                                      <IconPlus size={14} />
                                    </ActionIcon>
                                  </Tooltip>
                                </Flex>
                              </Table.Td>
                            );
                          })}
                          <Table.Td />
                        </>
                      )}
                    </Table.Tr>
                  );
                })}

                {/* Innovation row */}
                <Table.Tr>
                  <Table.Td style={{ background: "#fafbfc" }} />
                  <Table.Td style={{ verticalAlign: "top" }}>
                    <Group gap={8} wrap="nowrap" align="flex-start">
                      <Box w={3} mih={40} bg="#7c3aed" style={{ borderRadius: 2, flexShrink: 0 }} />
                      <div>
                        <Text fz="sm" fw={700}>Product / Platform Innovation</Text>
                        <Text fz={10} c="dimmed" ff="monospace" mb={6}>Bleeding Edge R&D</Text>
                        <Paper p={4} radius="sm" bg="gray.0">
                          <ET value={org.innovationLead} onChange={(v: string) => setOrg((o: any) => ({ ...o, innovationLead: v }))} fw={600} fz={12} />
                          <Text fz={10} c="dimmed">Innovation Lead</Text>
                        </Paper>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td colSpan={org.products.length} style={{ verticalAlign: "top" }}>
                    <Flex wrap="wrap" gap={4}>
                      {(org.innovation || []).map((name: string, idx: number) => (
                        <PersonChip key={idx} name={name} stage="all"
                          onRename={(v: string) => setOrg((o: any) => { const a = [...o.innovation]; a[idx] = v; return { ...o, innovation: a }; })}
                          onStageChange={() => {}}
                          onDelete={() => setOrg((o: any) => ({ ...o, innovation: o.innovation.filter((_: any, i: number) => i !== idx) }))} />
                      ))}
                      <ActionIcon size="sm" variant="light" color="grape" onClick={() => setOrg((o: any) => ({ ...o, innovation: [...o.innovation, "New Member"] }))}>
                        <IconPlus size={14} />
                      </ActionIcon>
                    </Flex>
                  </Table.Td>
                  <Table.Td />
                </Table.Tr>

                {/* Add row button */}
                <Table.Tr>
                  <Table.Td colSpan={org.products.length + 3}>
                    <Button variant="subtle" leftSection={<IconPlus size={14} />} onClick={() => setAddRowOpen(true)}>Add Row</Button>
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Paper>

          {/* ── Legend ── */}
          <Group mt="md" gap="lg">
            <Group gap={4}>
              <Text fz="xs" fw={700} c="dimmed">COLUMNS:</Text>
              <Badge variant="light" color="blue" size="xs">Church</Badge>
              <Badge variant="light" color="yellow" size="xs">360°</Badge>
              <Badge variant="light" color="green" size="xs">Gloo</Badge>
            </Group>
            <Divider orientation="vertical" />
            <Group gap={4}>
              <Text fz="xs" fw={700} c="dimmed">STAGES:</Text>
              {["stabilize", "modernize", "productize", "all"].map(s => (
                <Badge key={s} variant="light" color={STAGES[s].mantine} size="xs">{STAGES[s].label}</Badge>
              ))}
            </Group>
          </Group>
        </>
      )}
    </Container>
  );
}

/* ── Add Column Modal ── */
function AddColumnModal({ opened, onClose, onAdd }: any) {
  const [name, setName] = useState("New Product");
  const [type, setType] = useState("church");
  const [lead, setLead] = useState("TBD");
  return (
    <Modal opened={opened} onClose={onClose} title="Add Column">
      <Stack>
        <TextInput label="Product Name" value={name} onChange={e => setName(e.currentTarget.value)} />
        <div>
          <Text fz="sm" fw={500} mb={4}>Type</Text>
          <SegmentedControl value={type} onChange={setType} data={[
            { label: "Church", value: "church" }, { label: "360°", value: "360" }, { label: "Gloo", value: "gloo" },
          ]} fullWidth />
        </div>
        <TextInput label="Product Lead" value={lead} onChange={e => setLead(e.currentTarget.value)} />
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { onAdd({ name: name.trim() || "New Product", type, productLead: lead.trim() || "TBD" }); setName("New Product"); setLead("TBD"); }}>Add</Button>
        </Group>
      </Stack>
    </Modal>
  );
}

/* ── Add Row Modal ── */
function AddRowModal({ opened, onClose, onAdd }: any) {
  const [label, setLabel] = useState("New Layer");
  const [sublabel, setSublabel] = useState("Description");
  const [leadName, setLeadName] = useState("TBD");
  const [leadRole, setLeadRole] = useState("Layer Lead");
  return (
    <Modal opened={opened} onClose={onClose} title="Add Row">
      <Stack>
        <TextInput label="Layer Name" value={label} onChange={e => setLabel(e.currentTarget.value)} />
        <TextInput label="Description" value={sublabel} onChange={e => setSublabel(e.currentTarget.value)} />
        <TextInput label="Lead Name" value={leadName} onChange={e => setLeadName(e.currentTarget.value)} />
        <TextInput label="Lead Role" value={leadRole} onChange={e => setLeadRole(e.currentTarget.value)} />
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { onAdd({ label: label.trim() || "New Layer", sublabel: sublabel.trim(), lead: { name: leadName.trim() || "TBD", role: leadRole.trim() || "Layer Lead" }, accent: "#4dabf7", color: "#1a2a3a" }); }}>Add</Button>
        </Group>
      </Stack>
    </Modal>
  );
}

/* ── Add Role Modal ── */
function AddRoleModal({ target, onClose, onAdd }: any) {
  const [name, setName] = useState("New Member");
  const [stage, setStage] = useState("stabilize");
  return (
    <Modal opened={!!target} onClose={onClose} title="Add Role">
      <Stack>
        <TextInput label="Name" value={name} onChange={e => setName(e.currentTarget.value)} />
        <div>
          <Text fz="sm" fw={500} mb={4}>Stage</Text>
          <SegmentedControl value={stage} onChange={setStage} fullWidth data={[
            { label: "Stabilize", value: "stabilize" }, { label: "Modernize", value: "modernize" },
            { label: "Productize", value: "productize" }, { label: "All", value: "all" },
          ]} />
        </div>
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { onAdd(name.trim() || "New Member", stage); setName("New Member"); setStage("stabilize"); }}>Add</Button>
        </Group>
      </Stack>
    </Modal>
  );
}
