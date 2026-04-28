"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const ACCENT_OPTIONS = ["#4a9eff","#f97316","#3ecf8e","#c084fc","#f472b6","#facc15","#34d399","#60a5fa"];
const COLOR_OPTIONS  = ["#1a3a5c","#1a2a3a","#1a3d2e","#3a1a3a","#2a1a1a","#1a3a2a","#2a2a1a","#1a1a3a"];

/* ─── STAGE CONFIG ─── */
const STAGES = {
  stabilize:  { label: "Stabilize",  color: "#fb923c", bg: "#fb923c20", border: "#fb923c55" },
  modernize:  { label: "Modernize",  color: "#e879f9", bg: "#e879f920", border: "#e879f955" },
  productize: { label: "Productize", color: "#4ade80", bg: "#4ade8020", border: "#4ade8055" },
  all:        { label: "All Stages", color: "#94a3b8", bg: "rgba(255,255,255,0.04)", border: "#334155" },
};

const JDS = {
  design: {
    title: "Experience Systems Designer",
    reports: "Matthew Slaughter",
    what: "Design in this organization is a systems function, not a production function. AI agents can generate UI at a speed no designer can match — that does not make designers obsolete, it makes the designer's most important job harder. The question is no longer 'can we make this screen' but 'are we defining the right constraints for agents to make screens well.' Those constraints cannot be invented from the inside. They have to be discovered from the outside — by going into 360 customer orgs and understanding how ministry leaders actually work, think, and move through their day.",
    responsibilities: [
      "Forward-deploy to build ministry context into the system — watch how executive pastors, children's ministry directors, and communications directors actually move through their day; translate observations into design constraints, not anecdotal user stories.",
      "Architect and evolve the Gloo design system — not just tokens and components, but behavioral logic, interaction patterns, and constraints that define how information is presented to a role-configured user.",
      "Define experience frameworks for each platform surface — the Ministry Chat dashboard for a lead pastor and for a children's ministry director are different experiences even when they share infrastructure.",
      "Curate and govern AI-generated output — evaluate agent-generated interface variations for coherence and alignment with the design system.",
      "Partner with engineering on system executability — design tokens must translate to real components and behavioral logic must be expressible in code.",
    ],
    notThis: "A Figma production role. A screen handoff function. A reactive support role that responds to engineering requests. Someone who designs for ministry leaders without spending time with ministry leaders.",
    looking: [
      "6+ years in product design, with significant experience building and scaling design systems",
      "Strong systems-thinking — you design constraints, not just screens",
      "Experience working in a platform environment where your output is used by designers, engineers, and agents",
      "Genuine interest in the users we serve — ministry leaders, church staff, nonprofit operators",
      "Willingness to go on-site with 360 customers to observe and translate their working patterns into design constraints",
      "Comfort leveraging AI tools for rapid iteration while maintaining design quality standards",
    ],
    success: [
      "Every surface on the platform, regardless of who or what built it, feels coherent and trustworthy",
      "A new engineer or agent building within the design system produces something that looks designed",
      "Ministry leaders feel comfortable in the platform immediately — it does not feel like enterprise software",
      "Every forward deployment produces at least one concrete addition or refinement to the design system",
    ],
    flourishing: "The people using what you design are real people doing work they believe matters — caring for communities, developing leaders, running programs that change lives. Design that respects their attention, reduces their cognitive load, and gets out of their way is not just good UX. It is an act of service. Build it like you mean it.",
  },
  appEng: {
    title: "Application Layer Engineer",
    reports: "Casey",
    what: "This is the layer customers touch. You build and maintain the unified surface that Ministry Chat and Polymer are becoming. Your job is platform coherence — building for all customers simultaneously, not one at a time.",
    responsibilities: [
      "Build and evolve the unified customer-facing platform — Ministry Chat and Polymer converging into one coherent surface, white-labeled where needed.",
      "Own the platform architecture at the application layer — dashboards, interfaces, role-based configuration, and agent surfaces that scale across every customer deployment.",
      "Forward-deploy with an opinionated architecture — translate customer problems into platform solutions. When you find yourself tempted to build something custom for one customer, abstract it up.",
      "Surface complexity as simplicity — customers should not know about Convex or the trust fabric. They click a button and a thing happens.",
      "Own application-level performance, reliability, and security.",
      "Close the loop — every forward deployment produces learnings that must come back to the platform as shared capabilities.",
    ],
    notThis: "A feature factory. A custom app developer. Someone who stays in the codebase and never talks to a customer. Someone who builds one-off solutions without asking whether it belongs in the platform.",
    looking: [
      "5+ years in product engineering or full-stack development",
      "Strong platform thinking — you design for reuse, not for one use case",
      "Experience building role-based, configurable interfaces at scale",
      "Comfort going on-site with enterprise customers and working through problems in real time",
      "Ability to work on top of an agentic platform, not just build traditional software",
      "The judgment to know when a customer request should become a platform capability versus a configuration",
    ],
    success: [
      "The platform is coherent regardless of which customer is using it or who built a given surface",
      "Time-to-value for a new customer is weeks, not quarters",
      "Every forward deployment produces at least one platform capability that ships to all customers",
      "Custom one-off builds decrease over time as the platform gets smarter",
      "Engineers can onboard to the application layer and ship confidently within days, not months",
    ],
    flourishing: "This layer is the face of the mission. When you build the platform well, every Platform Solution Engineer on top of it can move faster and serve more effectively.",
  },
  platformEng: {
    title: "Platform Solution Engineer",
    reports: "Casey",
    what: "Platform Solution Engineers are the sharp end of the forward-deployment model. You go into a church or nonprofit, feel the friction firsthand, and come back with the configuration, agents, and workflows that solve it on the platform.",
    responsibilities: [
      "Forward-deploy as your primary work mode — go on-site, embed with staff, understand how work actually moves, and build platform solutions that solve it.",
      "Configure and deploy Ministry Chat for specific customers — their org chart, their communication voice, their Rock RMS configuration.",
      "Build and deploy customer-facing agents — expense automation, sermon content pipeline, Rock discovery and configuration, daily check-in workflows.",
      "Serve as the interface between customer need and platform capability — surface gaps back to product and engineering.",
      "Close the loop — every deployment produces patterns that belong on the platform.",
      "Train and support ministry staff on the platform — reduce the time between deployment and adoption.",
    ],
    notThis: "A developer who takes requirements at face value. Someone who builds custom apps instead of platform configurations. A consultant who delivers and disappears. Someone who doesn't actually care about the mission.",
    looking: [
      "Background in ministry or church operations is a strong differentiator",
      "3+ years in technical customer-facing work",
      "Comfort going on-site with church staff and working through problems in real time",
      "Enough technical fluency to configure, deploy, and troubleshoot on the platform",
      "Genuine passion for the mission",
      "Strong communication: you translate between ministry language and platform language fluently",
    ],
    success: [
      "Customers forget they're using AI because the experience is that natural",
      "Time-to-value for a new church deployment is days, not months",
      "Agent deployments work the first time, not after three rounds of debugging",
      "Every deployment surfaces at least one insight that improves the platform for the next church",
      "Ministry staff spend meaningfully less time behind screens and more time with people",
    ],
    flourishing: "You are the closest person on this team to the actual mission. The pastors and ministry directors using what you deploy are trying to change lives. Do not lose sight of that.",
  },
  services: {
    title: "Shared Solutions Engineer",
    reports: "Brian Johnson",
    what: "This is the intelligence and reusability layer. Skills are defined, agents are orchestrated, integrations are built, workflows are sequenced, and the trust fabric enforces what agents are and are not allowed to do. Built once, used everywhere.",
    responsibilities: [
      "Build and evolve the agent orchestration layer — Convex as the nerve center, orchestrating multi-step agentic workflows, maintaining state, managing the central registry of skills and tools.",
      "Forward-deploy to identify shared workflow patterns — bring them back and build as shared infrastructure.",
      "Define and build skills as reusable infrastructure — versioned, tested capabilities deployed immediately across all customers.",
      "Build and maintain integrations — Microsoft, Rock RMS, Planning Center, eSpace, Concur, Ramp.",
      "Design and enforce the trust fabric — pre-flight policy evaluation that answers 'is this allowed' before any agent takes action.",
      "Define workflow templates — expense automation, sermon content pipeline, daily check-in drip.",
    ],
    notThis: "An integration plumber who wires APIs together without thinking about reusability. A prompt engineer. A feature developer who builds one-off solutions for individual customers.",
    looking: [
      "7+ years in platform engineering, API infrastructure, or distributed systems",
      "Deep experience designing reusable service layers and SDK-style architectures",
      "Familiarity with agentic orchestration frameworks and their tradeoffs",
      "Strong opinions about state management in async, multi-step workflows",
      "Experience building multi-tenant integration infrastructure at scale",
      "The discipline to bring what you learn back to the platform, not build it as a one-off",
    ],
    success: [
      "A new church integration takes days, not months, because the shared infrastructure already exists",
      "Skills are versioned, tested, and deployed without regression",
      "Agent workflows complete reliably without human intervention",
      "The trust fabric catches governance violations before they become incidents",
      "Every forward deployment produces at least one new skill or workflow template",
    ],
    flourishing: "The workflows you build free ministry staff from administrative friction. Every hour of manual work you automate is an hour a pastor spends with someone who needed them.",
  },
  infra: {
    title: "Infrastructure & Data Engineer",
    reports: "Daniel Wilson",
    what: "Everything runs on this layer. The goal is an architecture where organizational context makes agents wise instead of generic — where a Ministry Chat agent at Church of the Resurrection actually understands their org chart, their Lava configuration, their campus hierarchy.",
    responsibilities: [
      "Build and steward the Gloo Brain — the context layer that transforms generic AI into ministry-intelligent AI.",
      "Forward-deploy to map data reality, not assumptions — sit with IT teams to understand actual data landscapes before designing infrastructure.",
      "Design for independent data residency — customers' data lives on their own infrastructure while still benefiting from everything above this layer.",
      "Build the auditability and traceability layer — every agent action and decision must be traceable.",
      "Own data normalization and the golden standard — canonical data models across all organization types.",
      "Design the continuous improvement loop — agent outputs become training signal.",
    ],
    notThis: "A data pipeline engineer who moves records from A to B. A DBA who manages schemas. A passive infrastructure maintainer. Someone who designs data architecture from a conference room without ever sitting with the customer.",
    looking: [
      "7+ years in data engineering, ML infrastructure, or platform engineering",
      "Deep experience with knowledge graph, vector store, or RAG architectures",
      "Strong opinions about data modeling at organizational scale",
      "Experience designing systems for multi-tenant data residency and sovereignty",
      "Comfort building feedback loops between operational systems and AI context",
      "Willingness to go on-site with 360 customers to assess data reality before designing solutions",
    ],
    success: [
      "Every new customer adds signal that makes the next customer's experience smarter",
      "Agents have the context they need without engineers manually curating it",
      "Data residency concerns never block a deal or a deployment",
      "A new org can have their configuration intelligently discovered and modeled within hours, not weeks",
      "The system knows what it knows, knows what it doesn't, and gets better over time",
    ],
    flourishing: "You will build systems that reduce the manual cognitive load on ministry leaders — freeing them to spend time with people instead of screens. Build it like it matters, because it does.",
  },
  product: {
    title: "Outcome Product Lead",
    reports: "Josh / Leadership",
    what: "Execution is no longer the bottleneck. In an agentic organization, agents can build faster than most teams can define what to build. That makes product judgment the rarest and most expensive resource in the system.",
    responsibilities: [
      "Forward-deploy as your primary research method — no roadmap item gets prioritized that you haven't seen a customer actually struggle with.",
      "Define outcomes, not features — translate what you observe into precise outcome statements.",
      "Prioritize ruthlessly and say no decisively — protect the roadmap from bloat, the team from distraction, and the platform from fragmentation.",
      "Design rapid experiments to validate assumptions before committing engineering capacity.",
      "Sequence the roadmap across layers — understand the dependencies between application, shared solutions, and infrastructure.",
    ],
    notThis: "A backlog administrator. A requirements writer who transcribes customer requests into tickets. A coordination layer between engineering and design. Someone who prioritizes based on what customers say they want.",
    looking: [
      "7+ years in product leadership, with some of that in platform or infrastructure products",
      "Demonstrated ability to define outcomes precisely and resist scope creep under pressure",
      "Strategic thinking that operates across a two-week sprint and an 18-month platform vision simultaneously",
      "Genuine comfort going on-site with enterprise customers",
      "Deep comfort with the ministry/faith-based technology market, or the humility and speed to develop it",
      "The ability to say no to people you respect, with clarity and without apology",
    ],
    success: [
      "The roadmap is understood by every engineer on the team without a kickoff meeting",
      "Every shipped feature traces back to something observed in a customer org",
      "The platform compounds because we built the right things in the right order",
      "Forward deployments produce specific, actionable roadmap intelligence",
      "Engineering time is never wasted on something that could have been invalidated in a two-day experiment",
    ],
    flourishing: "Velocity is not inherently good. Building the wrong thing faster is just a more expensive mistake. Product clarity is how we honor the time of the humans on the other end.",
  },
};

const layerDescriptions = {
  design: {
    purpose: "Design in this organization is a systems function, not a production function. AI agents can generate UI faster than any designer — that makes the designer's job harder, not obsolete.",
    activities: ["Forward-deploy into 360 customer orgs","Translate field observations into design constraints","Architect and evolve the Gloo design system","Define experience frameworks for each platform surface","Curate and govern AI-generated output","Partner with application layer engineering"],
    outputs: ["Gloo design system","Role-based experience frameworks","Design constraints & tokens","Field research synthesis","AI output governance standards"],
    notThis: "A Figma production role. A screen handoff function. A reactive support role.",
    flourishing: "Design that respects their attention and gets out of their way is not just good UX. It is an act of service.",
  },
  appEng: {
    purpose: "Application Layer Engineers own the platform itself — the unified surface that Ministry Chat and Polymer are becoming.",
    activities: ["Build and evolve the unified customer-facing platform","Own platform architecture","Forward-deploy with an opinionated architecture","Surface complexity as simplicity","Own application-level performance, reliability, and security","Close the loop"],
    outputs: ["Unified Ministry Chat / Polymer platform","Role-configured dashboards","Application layer architecture","White-labeled 360° surfaces","Platform performance & reliability"],
    notThis: "A feature factory. A custom app developer. Someone who builds one-off solutions without asking whether it belongs on the platform.",
    flourishing: "When you build the platform well, every Platform Solution Engineer on top of it moves faster and serves more effectively.",
  },
  platformEng: {
    purpose: "Platform Solution Engineers are the sharp end of forward deployment. They go on-site, embed with staff, feel the friction firsthand, and configure the platform to solve it.",
    activities: ["Forward-deploy as primary work mode","Configure and deploy Ministry Chat for specific customers","Build and deploy customer-facing agents","Serve as the interface between customer need and platform capability","Close the loop","Train and support ministry staff"],
    outputs: ["Customer deployments","Configured agents","Onboarding & training","Forward-deployment intelligence","Platform gap reports"],
    notThis: "A developer who takes requirements at face value. Someone who builds custom apps instead of platform configurations.",
    flourishing: "You are the closest person on this team to the actual mission. Do not lose sight of that.",
  },
  services: {
    purpose: "The intelligence and reusability layer — built once, used everywhere.",
    activities: ["Build and evolve the agent orchestration layer","Forward-deploy to identify shared workflow patterns","Define and build skills as reusable infrastructure","Build and maintain integrations","Design and enforce the trust fabric","Define workflow templates"],
    outputs: ["Agent orchestration layer (Convex)","Skills library","Integration registry","Trust fabric / governance system","Workflow templates","State management ledger"],
    notThis: "An integration plumber. A prompt engineer. A feature developer building one-off solutions.",
    flourishing: "The workflows you build free ministry staff from administrative friction.",
  },
  infra: {
    purpose: "Everything runs on this layer. The goal is an architecture where organizational context makes agents wise instead of generic.",
    activities: ["Build and steward the Gloo Brain","Forward-deploy to map data reality","Design for independent data residency","Build the auditability and traceability layer","Own data normalization and the golden standard","Design the continuous improvement loop"],
    outputs: ["Gloo Brain (context layer)","Independent data residency architecture","Auditability & traceability systems","Data normalization standards","Continuous improvement feedback loop","Cost analytics"],
    notThis: "A data pipeline engineer who moves records from A to B. A DBA. A passive infrastructure maintainer.",
    flourishing: "Build it like it matters, because it does.",
  },
  product: {
    purpose: "Execution is no longer the bottleneck. Product judgment is the rarest and most expensive resource in the system.",
    activities: ["Forward-deploy as your primary research method","Define outcomes, not features","Prioritize ruthlessly and say no decisively","Design rapid experiments to validate assumptions","Sequence the roadmap across layers"],
    outputs: ["Prioritized roadmap","Outcome statements","Experiment designs","Forward-deployment intelligence","Layer dependency maps"],
    notThis: "A backlog administrator. A requirements writer. A coordination layer.",
    flourishing: "Velocity is not inherently good. Product clarity is how we honor the time of the humans on the other end.",
  },
};

const initData = {
  layers: [
    { id: "dataAnalytics", label: "Data & Analytics",           sublabel: "Reporting · BI · Insights · Data Products",                               lead: { name: "TBD",               role: "Data & Analytics Lead" },         color: "#1a2a3a", accent: "#60a5fa" },
    { id: "enterpriseSys", label: "Enterprise Systems",         sublabel: "ERP · HRIS · Finance Systems · Internal Tools",                           lead: { name: "TBD",               role: "Enterprise Systems Lead" },       color: "#1a1a2e", accent: "#a78bfa" },
    { id: "coreInfra",     label: "Core Infrastructure",        sublabel: "Cloud · DevOps · Networking · Platform Reliability",                      lead: { name: "TBD",               role: "Core Infrastructure Lead" },      color: "#0e1e1a", accent: "#34d399" },
    { id: "security",      label: "Security",                   sublabel: "AppSec · Compliance · Risk · Access Control",                              lead: { name: "TBD",               role: "Security Lead" },                 color: "#1e1000", accent: "#fb923c" },
    { id: "helpDesk",      label: "Help Desk",                  sublabel: "Support · Ticketing · Escalation · End User Services",                    lead: { name: "TBD",               role: "Help Desk Lead" },                color: "#101520", accent: "#94a3b8" },
    { id: "product",       label: "Product",                    sublabel: "Outcomes · Roadmap · Forward-Deployed Research",                         lead: { name: "TBD",               role: "Outcome Product Lead" },          color: "#2a1a3a", accent: "#f472b6" },
    { id: "design",        label: "Design",                     sublabel: "Experience Systems · Design System · Forward-Deployed Research",          lead: { name: "Matthew Slaughter", role: "Head of Design" },                color: "#1a2a3a", accent: "#f97316" },
    { id: "platformEng",   label: "Platform Solution Engineer", sublabel: "Forward Deployment · Customer Config · Agent Deployment · Adoption",      lead: { name: "Casey",             role: "Application Layer Lead" },        color: "#0f2a4a", accent: "#38bdf8" },
    { id: "appEng",        label: "Application Layer Engineer", sublabel: "Platform Architecture · Unified Surface · Role-Configured Interfaces",    lead: { name: "Casey",             role: "Application Layer Lead" },        color: "#1a3a5c", accent: "#4a9eff" },
    { id: "services",      label: "Shared Solutions",           sublabel: "Agent Orchestration · Skills · Integrations · Trust Fabric",              lead: { name: "Brian Johnson",     role: "Platform Services Lead" },        color: "#1a3d2e", accent: "#3ecf8e" },
    { id: "infra",         label: "Infrastructure & Data",      sublabel: "Gloo Brain · Data Normalization · Auditability · Continuous Improvement", lead: { name: "Daniel Wilson",     role: "Head of AI Engineering" },        color: "#3a1a3a", accent: "#c084fc" },
  ],
  products: [
    { id: "church", name: "Church", type: "church", productLead: "TBD", cells: {
        product:      [{ name: "Outcome Product Lead", stage: "all" }],
        design:       [{ name: "Experience Systems Designer", stage: "all" }],
        appEng:       [{ name: "App Layer Eng 1", stage: "modernize" },{ name: "App Layer Eng 2", stage: "productize" }],
        platformEng:  [{ name: "PSE 1", stage: "stabilize" },{ name: "PSE 2", stage: "stabilize" },{ name: "PSE 3", stage: "modernize" }],
        services:     [{ name: "Shared Solutions Eng 1", stage: "modernize" },{ name: "Shared Solutions Eng 2", stage: "productize" }],
        infra:        [{ name: "Infra Eng 1", stage: "stabilize" },{ name: "Infra Eng 2", stage: "modernize" },{ name: "Infra Eng 3", stage: "productize" }],
        dataAnalytics:   [{ name: "Data Analyst 1", stage: "all" }],
        enterpriseSys:   [{ name: "Enterprise Sys Eng 1", stage: "stabilize" }],
        coreInfra:       [{ name: "Core Infra Eng 1", stage: "all" }],
        security:        [{ name: "Security Eng 1", stage: "all" }],
        helpDesk:        [{ name: "Help Desk 1", stage: "stabilize" }],
      }
    },
    { id: "ag", name: "AG", type: "360", productLead: "TBD", cells: {
        product:      [{ name: "Outcome Product Lead", stage: "all" }],
        design:       [{ name: "Experience Systems Designer", stage: "all" }],
        appEng:       [{ name: "App Layer Eng 1", stage: "modernize" }],
        platformEng:  [{ name: "PSE 4", stage: "stabilize" },{ name: "PSE 5", stage: "stabilize" }],
        services:     [{ name: "Shared Solutions Eng 1", stage: "modernize" },{ name: "Shared Solutions Eng 2", stage: "modernize" }],
        infra:        [{ name: "Infra Eng 1", stage: "modernize" }],
        dataAnalytics:   [{ name: "Data Analyst 1", stage: "all" }],
        enterpriseSys:   [{ name: "Enterprise Sys Eng 1", stage: "stabilize" }],
        coreInfra:       [{ name: "Core Infra Eng 1", stage: "all" }],
        security:        [{ name: "Security Eng 1", stage: "all" }],
        helpDesk:        [{ name: "Help Desk 1", stage: "stabilize" }],
      }
    },
    { id: "eten", name: "ETEN", type: "360", productLead: "TBD", cells: {
        product:      [{ name: "Outcome Product Lead", stage: "all" }],
        design:       [{ name: "Experience Systems Designer", stage: "all" }],
        appEng:       [{ name: "App Layer Eng 1", stage: "modernize" }],
        platformEng:  [{ name: "PSE 6", stage: "stabilize" }],
        services:     [{ name: "Shared Solutions Eng 1", stage: "stabilize" }],
        infra:        [{ name: "Infra Eng 1", stage: "stabilize" }],
        dataAnalytics:   [{ name: "Data Analyst 1", stage: "all" }],
        enterpriseSys:   [{ name: "Enterprise Sys Eng 1", stage: "stabilize" }],
        coreInfra:       [{ name: "Core Infra Eng 1", stage: "all" }],
        security:        [{ name: "Security Eng 1", stage: "all" }],
        helpDesk:        [{ name: "Help Desk 1", stage: "stabilize" }],
      }
    },
    { id: "iv", name: "IV", type: "360", productLead: "TBD", cells: {
        product:      [{ name: "Outcome Product Lead", stage: "all" }],
        design:       [{ name: "Experience Systems Designer", stage: "all" }],
        appEng:       [{ name: "App Layer Eng 1", stage: "modernize" }],
        platformEng:  [{ name: "PSE 7", stage: "modernize" },{ name: "PSE 8", stage: "modernize" }],
        services:     [{ name: "Shared Solutions Eng 1", stage: "modernize" }],
        infra:        [{ name: "Infra Eng 1", stage: "modernize" }],
        dataAnalytics:   [{ name: "Data Analyst 1", stage: "all" }],
        enterpriseSys:   [{ name: "Enterprise Sys Eng 1", stage: "stabilize" }],
        coreInfra:       [{ name: "Core Infra Eng 1", stage: "all" }],
        security:        [{ name: "Security Eng 1", stage: "all" }],
        helpDesk:        [{ name: "Help Desk 1", stage: "stabilize" }],
      }
    },
    { id: "abs", name: "ABS", type: "360", productLead: "TBD", cells: {
        product:      [{ name: "Outcome Product Lead", stage: "all" }],
        design:       [{ name: "Experience Systems Designer", stage: "all" }],
        appEng:       [{ name: "App Layer Eng 1", stage: "modernize" }],
        platformEng:  [{ name: "PSE 9", stage: "modernize" }],
        services:     [{ name: "Shared Solutions Eng 1", stage: "modernize" }],
        infra:        [{ name: "Infra Eng 1", stage: "modernize" }],
        dataAnalytics:   [{ name: "Data Analyst 1", stage: "all" }],
        enterpriseSys:   [{ name: "Enterprise Sys Eng 1", stage: "stabilize" }],
        coreInfra:       [{ name: "Core Infra Eng 1", stage: "all" }],
        security:        [{ name: "Security Eng 1", stage: "all" }],
        helpDesk:        [{ name: "Help Desk 1", stage: "stabilize" }],
      }
    },
  ],
  innovation: ["Matt Michel"],
  innovationLead: "Matt",
  executives: [
    { id: "exec1", name: "Justin",  role: "IT & Operations Leader", color: "#1a2030", accent: "#60a5fa", layers: ["dataAnalytics","enterpriseSys","coreInfra","security","helpDesk"] },
    { id: "exec2", name: "TBD",     role: "Product Leader",         color: "#1a1a2a", accent: "#f472b6", layers: ["product"] },
    { id: "exec3", name: "Daniel",  role: "Engineering Leader",     color: "#0f1a10", accent: "#3ecf8e", layers: ["design","platformEng","appEng","services","infra"] },
  ],
};

const typeColors = {
  church: { bg: "#0c1c2e", badge: "#4a9eff", badgeText: "Church" },
  "360":  { bg: "#141200", badge: "#facc15", badgeText: "360°"   },
  gloo:   { bg: "#0e1a10", badge: "#3ecf8e", badgeText: "Gloo"   },
};

function uid() { return Math.random().toString(36).slice(2, 8); }

/* ── Stage badge ── */
function StageBadge({ stage, small }: any) {
  const s = STAGES[stage] || STAGES.all;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:"3px",
      background: s.bg, border:"1px solid "+ s.border,
      borderRadius:"4px", padding: small ? "1px 4px" : "2px 6px",
      fontSize: small ? "8px" : "9px", color: s.color,
      fontFamily:"Courier New, monospace", letterSpacing:"0.5px",
      whiteSpace:"nowrap", flexShrink:0,
    }}>
      {stage === "stabilize" ? "S" : stage === "modernize" ? "M" : stage === "productize" ? "P" : "ALL"}
    </span>
  );
}

function ET({ value, onChange, style }: any) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (editing && ref.current) ref.current.focus(); }, [editing]);
  useEffect(() => { setDraft(value); }, [value]);
  const commit = () => { setEditing(false); if (draft.trim()) onChange(draft.trim()); else setDraft(value); };
  if (editing) return (
    <input ref={ref} value={draft} onChange={e=>setDraft(e.target.value)} onBlur={commit}
      onKeyDown={e=>{ if(e.key==="Enter") commit(); if(e.key==="Escape"){setDraft(value);setEditing(false);} }}
      style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.3)", borderRadius:"4px", color:"#f1f5f9", padding:"2px 6px", fontSize:"inherit", fontFamily:"inherit", width:"100%", minWidth:"80px", outline:"none" }}
    />
  );
  return <span onClick={e=>{e.stopPropagation();setEditing(true);}} title="Click to edit" style={{ cursor:"text", borderBottom:"1px dashed rgba(255,255,255,0.25)", paddingBottom:"1px", ...style }}>{value||"—"}</span>;
}

/* ── Chip with stage ── */
function Chip({ name, stage, accent, onChange, onStageChange, onDelete, onJD, dimmed }: any) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(name);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (editing && ref.current) ref.current.focus(); }, [editing]);
  const commit = () => { setEditing(false); if(draft.trim()&&draft.trim()!==name) onChange(draft.trim()); else setDraft(name); };
  const initials = name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const stageInfo = STAGES[stage] || STAGES.all;
  return (
    <div style={{
        display:"inline-flex", alignItems:"center", gap:"4px",
        background: dimmed ? "rgba(255,255,255,0.03)" : stageInfo.bg,
        border:"1px solid "+ (dimmed ? "rgba(255,255,255,0.06)" : stageInfo.border),
        borderRadius:"6px", padding:"4px 8px 4px 9px", marginBottom:"5px", marginRight:"4px",
        position:"relative", opacity: dimmed ? 0.3 : 1, transition:"opacity 0.2s",
      }}
      onMouseEnter={e=>{ e.currentTarget.querySelectorAll<HTMLElement>(".chip-ctrl").forEach(b=>b.style.opacity="1"); }}
      onMouseLeave={e=>{ e.currentTarget.querySelectorAll<HTMLElement>(".chip-ctrl").forEach(b=>b.style.opacity="0"); }}
    >
      <div style={{ width:"18px", height:"18px", borderRadius:"50%", background:stageInfo.color+"30", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"8px", color:stageInfo.color, fontWeight:"700", flexShrink:0 }}>{initials}</div>
      {editing
        ? <input ref={ref} value={draft} onChange={e=>setDraft(e.target.value)} onBlur={commit}
            onKeyDown={e=>{if(e.key==="Enter")commit();if(e.key==="Escape"){setDraft(name);setEditing(false);}}}
            style={{ background:"transparent", border:"none", borderBottom:"1px solid "+stageInfo.color, color:"#f1f5f9", fontSize:"11px", fontFamily:"inherit", width:Math.max(60,draft.length*7)+"px", outline:"none", padding:"0" }} />
        : <span onClick={e=>{e.stopPropagation();setEditing(true);}} title="Click to rename"
            style={{ fontSize:"11px", color: dimmed ? "#475569" : "#f1f5f9", whiteSpace:"nowrap", cursor:"text", borderBottom:"1px dashed rgba(255,255,255,0.3)" }}>{name}</span>
      }
      {/* Stage cycle button */}
      <StageBadge stage={stage} small />
      {/* controls on hover */}
      {onJD && (
        <button className="chip-ctrl" onClick={e=>{e.stopPropagation();onJD();}}
          style={{ opacity:0, background:accent+"22", border:"1px solid "+accent+"44", borderRadius:"4px", color:accent, cursor:"pointer", fontSize:"8px", fontFamily:"Courier New, monospace", letterSpacing:"0.5px", padding:"1px 5px", lineHeight:"14px", transition:"opacity 0.15s, background 0.15s", whiteSpace:"nowrap" }}
          onMouseEnter={e=>{e.currentTarget.style.background=accent+"44";}}
          onMouseLeave={e=>{e.currentTarget.style.background=accent+"22";}}
          title="View job description">JD</button>
      )}
      <button className="chip-ctrl" onClick={e=>{e.stopPropagation(); const order=["stabilize","modernize","productize","all"]; const i=order.indexOf(stage); onStageChange(order[(i+1)%order.length]);}}
        style={{ opacity:0, background:"none", border:"none", color:"#94a3b8", cursor:"pointer", fontSize:"10px", padding:"0 1px", lineHeight:1, transition:"opacity 0.15s" }}
        title="Cycle stage (S→M→P→All)">⟳</button>
      <button className="chip-ctrl x" onClick={e=>{e.stopPropagation();onDelete();}}
        style={{ opacity:0, background:"none", border:"none", color:"#ef4444", cursor:"pointer", fontSize:"12px", padding:"0 0 0 1px", lineHeight:1, transition:"opacity 0.15s" }}>×</button>
    </div>
  );
}

/* ── JD Modal ── */
function JDModal({ layerId, layer, onClose }: any) {
  const jd = JDS[layerId];
  if (!jd) return null;
  const accent = layer.accent;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2000, padding:"20px" }}
      onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}
    >
      <div style={{ background:"#0b1320", border:"1px solid "+accent+"44", borderRadius:"16px", maxWidth:"760px", width:"100%", maxHeight:"85vh", overflow:"hidden", display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"20px 24px 16px", borderBottom:"1px solid "+accent+"22", display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"16px", flexShrink:0 }}>
          <div>
            <div style={{ fontSize:"9px", letterSpacing:"3px", color:accent, fontFamily:"Courier New, monospace", marginBottom:"4px", textTransform:"uppercase" }}>{layer.label}</div>
            <div style={{ fontSize:"20px", fontWeight:"700", color:"#f1f5f9", marginBottom:"4px" }}>{jd.title}</div>
            <div style={{ fontSize:"11px", color:"#64748b" }}>Reports to: <span style={{ color:"#94a3b8" }}>{jd.reports}</span></div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#475569", cursor:"pointer", fontSize:"20px", lineHeight:1, padding:"2px", flexShrink:0 }}>×</button>
        </div>
        <div style={{ overflowY:"auto", padding:"20px 24px", display:"flex", flexDirection:"column", gap:"20px" }}>
          <div>
            <div style={{ fontSize:"9px", letterSpacing:"3px", color:accent, fontFamily:"Courier New, monospace", marginBottom:"10px", textTransform:"uppercase" }}>What This Role Does</div>
            <p style={{ margin:0, fontSize:"12px", color:"#cbd5e1", lineHeight:"1.7" }}>{jd.what}</p>
          </div>
          <div>
            <div style={{ fontSize:"9px", letterSpacing:"3px", color:accent, fontFamily:"Courier New, monospace", marginBottom:"10px", textTransform:"uppercase" }}>What You'll Do</div>
            {jd.responsibilities.map((r,i)=>(
              <div key={i} style={{ display:"flex", gap:"10px", marginBottom:"10px" }}>
                <span style={{ color:accent, flexShrink:0, marginTop:"3px", fontSize:"10px" }}>▸</span>
                <span style={{ fontSize:"12px", color:"#cbd5e1", lineHeight:"1.6" }}>{r}</span>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:"16px", flexWrap:"wrap" }}>
            <div style={{ flex:"1 1 280px" }}>
              <div style={{ fontSize:"9px", letterSpacing:"3px", color:accent, fontFamily:"Courier New, monospace", marginBottom:"10px", textTransform:"uppercase" }}>What We're Looking For</div>
              {jd.looking.map((l,i)=>(
                <div key={i} style={{ display:"flex", gap:"8px", marginBottom:"7px" }}>
                  <span style={{ color:accent+"80", flexShrink:0, fontSize:"10px", marginTop:"3px" }}>◆</span>
                  <span style={{ fontSize:"11px", color:"#94a3b8", lineHeight:"1.5" }}>{l}</span>
                </div>
              ))}
            </div>
            <div style={{ flex:"1 1 280px" }}>
              <div style={{ fontSize:"9px", letterSpacing:"3px", color:accent, fontFamily:"Courier New, monospace", marginBottom:"10px", textTransform:"uppercase" }}>Success Looks Like</div>
              {jd.success.map((s,i)=>(
                <div key={i} style={{ display:"flex", gap:"8px", marginBottom:"7px" }}>
                  <span style={{ color:accent+"80", flexShrink:0, fontSize:"10px", marginTop:"3px" }}>◆</span>
                  <span style={{ fontSize:"11px", color:"#94a3b8", lineHeight:"1.5" }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background:"#1a0a0a", border:"1px solid #ef444433", borderRadius:"8px", padding:"12px 16px" }}>
            <div style={{ fontSize:"9px", letterSpacing:"3px", color:"#ef4444", fontFamily:"Courier New, monospace", marginBottom:"8px", textTransform:"uppercase" }}>What This Role Is Not</div>
            <p style={{ margin:0, fontSize:"11px", color:"#94a3b8", lineHeight:"1.6", fontStyle:"italic" }}>{jd.notThis}</p>
          </div>
          <div style={{ background:accent+"0a", border:"1px solid "+accent+"22", borderRadius:"8px", padding:"12px 16px" }}>
            <div style={{ fontSize:"9px", letterSpacing:"3px", color:accent, fontFamily:"Courier New, monospace", marginBottom:"8px", textTransform:"uppercase" }}>On Human Flourishing</div>
            <p style={{ margin:0, fontSize:"11px", color:"#94a3b8", lineHeight:"1.6" }}>{jd.flourishing}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Add role modal with stage picker ── */
function AddRoleModal({ accent, onAdd, onClose }: any) {
  const [name, setName] = useState("New Member");
  const [stage, setStage] = useState("stabilize");
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (ref.current) ref.current.focus(); }, []);
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1500 }}>
      <div style={{ background:"#0f1a24", border:"1px solid #1e293b", borderRadius:"14px", padding:"24px", minWidth:"260px" }}>
        <div style={{ fontSize:"13px", fontWeight:"700", color:"#e2e8f0", marginBottom:"16px" }}>Add Role</div>
        <label style={{ fontSize:"11px", color:"#94a3b8", display:"block", marginBottom:"4px" }}>Name</label>
        <input ref={ref} value={name} onChange={e=>setName(e.target.value)}
          onKeyDown={e=>{ if(e.key==="Enter") onAdd(name.trim()||"New Member", stage); }}
          style={{ width:"100%", background:"#0b1320", border:"1px solid #1e293b", borderRadius:"6px", color:"#f1f5f9", padding:"6px 10px", fontSize:"12px", marginBottom:"14px", outline:"none", boxSizing:"border-box" }} />
        <label style={{ fontSize:"11px", color:"#94a3b8", display:"block", marginBottom:"8px" }}>Stage Allocation</label>
        <div style={{ display:"flex", gap:"6px", marginBottom:"18px", flexWrap:"wrap" }}>
          {["stabilize","modernize","productize","all"].map(s=>{
            const st = STAGES[s];
            return (
              <button key={s} onClick={()=>setStage(s)}
                style={{ flex:"1 1 auto", padding:"6px 8px", borderRadius:"6px", border:"1px solid "+(stage===s ? st.border : "#1e293b"),
                  background: stage===s ? st.bg : "transparent", color: stage===s ? st.color : "#64748b",
                  cursor:"pointer", fontSize:"10px", fontFamily:"Courier New, monospace", letterSpacing:"0.5px" }}>
                {st.label}
              </button>
            );
          })}
        </div>
        <div style={{ display:"flex", gap:"8px" }}>
          <button onClick={onClose} style={{ flex:1, padding:"8px", borderRadius:"6px", border:"1px solid #1e293b", background:"transparent", color:"#64748b", cursor:"pointer", fontSize:"12px" }}>Cancel</button>
          <button onClick={()=>onAdd(name.trim()||"New Member", stage)}
            style={{ flex:1, padding:"8px", borderRadius:"6px", border:"none", background:accent||"#4a9eff", color:"#000", cursor:"pointer", fontSize:"12px", fontWeight:"700" }}>Add</button>
        </div>
      </div>
    </div>
  );
}

/* ── Add-column modal ── */
function AddColModal({ onAdd, onClose }: any) {
  const [name, setName] = useState("New Product");
  const [type, setType] = useState("church");
  const [lead, setLead] = useState("TBD");
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (ref.current) ref.current.focus(); }, []);
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}>
      <div style={{ background:"#0f1a24", border:"1px solid #1e293b", borderRadius:"14px", padding:"24px", minWidth:"280px" }}>
        <div style={{ fontSize:"13px", fontWeight:"700", color:"#e2e8f0", marginBottom:"16px" }}>Add Column</div>
        <label style={{ fontSize:"11px", color:"#94a3b8", display:"block", marginBottom:"4px" }}>Product Name</label>
        <input ref={ref} value={name} onChange={e=>setName(e.target.value)}
          style={{ width:"100%", background:"#0b1320", border:"1px solid #1e293b", borderRadius:"6px", color:"#f1f5f9", padding:"6px 10px", fontSize:"12px", marginBottom:"12px", outline:"none", boxSizing:"border-box" }} />
        <label style={{ fontSize:"11px", color:"#94a3b8", display:"block", marginBottom:"4px" }}>Type</label>
        <div style={{ display:"flex", gap:"8px", marginBottom:"12px" }}>
          {["church","360","gloo"].map(t=>(
            <button key={t} onClick={()=>setType(t)}
              style={{ flex:1, padding:"6px", borderRadius:"6px", border:"1px solid "+(type===t ? typeColors[t].badge : "#1e293b"), background:type===t ? typeColors[t].bg : "transparent", color:type===t ? typeColors[t].badge : "#64748b", cursor:"pointer", fontSize:"11px" }}>
              {t==="church"?"Church":t==="360"?"360°":"Gloo"}
            </button>
          ))}
        </div>
        <label style={{ fontSize:"11px", color:"#94a3b8", display:"block", marginBottom:"4px" }}>Product Lead</label>
        <input value={lead} onChange={e=>setLead(e.target.value)}
          style={{ width:"100%", background:"#0b1320", border:"1px solid #1e293b", borderRadius:"6px", color:"#f1f5f9", padding:"6px 10px", fontSize:"12px", marginBottom:"16px", outline:"none", boxSizing:"border-box" }} />
        <div style={{ display:"flex", gap:"8px" }}>
          <button onClick={onClose}  style={{ flex:1, padding:"8px", borderRadius:"6px", border:"1px solid #1e293b", background:"transparent", color:"#64748b", cursor:"pointer", fontSize:"12px" }}>Cancel</button>
          <button onClick={()=>onAdd({name:name.trim()||"New Product", type, productLead:lead.trim()||"TBD"})}
            style={{ flex:1, padding:"8px", borderRadius:"6px", border:"none", background:"#4a9eff", color:"#000", cursor:"pointer", fontSize:"12px", fontWeight:"700" }}>Add</button>
        </div>
      </div>
    </div>
  );
}

/* ── Add-row modal ── */
function AddRowModal({ onAdd, onClose }: any) {
  const [label,    setLabel]    = useState("New Layer");
  const [sublabel, setSublabel] = useState("Description");
  const [leadName, setLeadName] = useState("TBD");
  const [leadRole, setLeadRole] = useState("Layer Lead");
  const [accent,   setAccent]   = useState(ACCENT_OPTIONS[4]);
  const [color,    setColor]    = useState(COLOR_OPTIONS[4]);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (ref.current) ref.current.focus(); }, []);
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}>
      <div style={{ background:"#0f1a24", border:"1px solid #1e293b", borderRadius:"14px", padding:"24px", minWidth:"300px" }}>
        <div style={{ fontSize:"13px", fontWeight:"700", color:"#e2e8f0", marginBottom:"16px" }}>Add Row</div>
        {([["Layer Name",label,setLabel,ref],["Description",sublabel,setSublabel,null],["Lead Name",leadName,setLeadName,null],["Lead Role",leadRole,setLeadRole,null]] as any[]).map(([lbl,val,set,r]: any)=>(
          <div key={lbl}>
            <label style={{ fontSize:"11px", color:"#94a3b8", display:"block", marginBottom:"4px" }}>{lbl}</label>
            <input ref={r||undefined} value={val} onChange={e=>set(e.target.value)}
              style={{ width:"100%", background:"#0b1320", border:"1px solid #1e293b", borderRadius:"6px", color:"#f1f5f9", padding:"6px 10px", fontSize:"12px", marginBottom:"12px", outline:"none", boxSizing:"border-box" }} />
          </div>
        ))}
        <label style={{ fontSize:"11px", color:"#94a3b8", display:"block", marginBottom:"6px" }}>Accent Color</label>
        <div style={{ display:"flex", gap:"6px", marginBottom:"12px", flexWrap:"wrap" }}>
          {ACCENT_OPTIONS.map(c=>(<div key={c} onClick={()=>setAccent(c)} style={{ width:"22px", height:"22px", borderRadius:"50%", background:c, cursor:"pointer", border:accent===c?"2px solid white":"2px solid transparent" }} />))}
        </div>
        <label style={{ fontSize:"11px", color:"#94a3b8", display:"block", marginBottom:"6px" }}>Row Background</label>
        <div style={{ display:"flex", gap:"6px", marginBottom:"16px", flexWrap:"wrap" }}>
          {COLOR_OPTIONS.map(c=>(<div key={c} onClick={()=>setColor(c)} style={{ width:"22px", height:"22px", borderRadius:"4px", background:c, cursor:"pointer", border:color===c?"2px solid white":"2px solid transparent" }} />))}
        </div>
        <div style={{ display:"flex", gap:"8px" }}>
          <button onClick={onClose} style={{ flex:1, padding:"8px", borderRadius:"6px", border:"1px solid #1e293b", background:"transparent", color:"#64748b", cursor:"pointer", fontSize:"12px" }}>Cancel</button>
          <button onClick={()=>onAdd({ label:label.trim()||"New Layer", sublabel:sublabel.trim(), lead:{ name:leadName.trim()||"TBD", role:leadRole.trim()||"Layer Lead" }, accent, color })}
            style={{ flex:1, padding:"8px", borderRadius:"6px", border:"none", background:accent, color:"#000", cursor:"pointer", fontSize:"12px", fontWeight:"700" }}>Add</button>
        </div>
      </div>
    </div>
  );
}

/* ── Assign Rows Modal ── */
function AssignRowsModal({ exec, layers, onSave, onClose }: any) {
  const [selected, setSelected] = useState(new Set(exec.layers));
  const toggle = (id) => setSelected(s => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:3000, padding:"20px" }}
      onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div style={{ background:"#0f1a24", border:"1px solid "+exec.accent+"44", borderRadius:"14px", padding:"24px", minWidth:"300px", maxWidth:"420px", width:"100%" }}>
        <div style={{ fontSize:"9px", letterSpacing:"3px", color:exec.accent, fontFamily:"Courier New, monospace", marginBottom:"6px", textTransform:"uppercase" }}>Assign Rows</div>
        <div style={{ fontSize:"14px", fontWeight:"700", color:"#f1f5f9", marginBottom:"16px" }}>{exec.name}</div>
        <div style={{ display:"flex", flexDirection:"column", gap:"6px", maxHeight:"360px", overflowY:"auto", marginBottom:"16px" }}>
          {layers.map(layer => (
            <div key={layer.id} onClick={()=>toggle(layer.id)}
              style={{ display:"flex", alignItems:"center", gap:"10px", padding:"8px 12px", borderRadius:"8px", cursor:"pointer",
                background: selected.has(layer.id) ? layer.accent+"15" : "#0b1320",
                border: "1px solid " + (selected.has(layer.id) ? layer.accent+"44" : "#1e293b"), transition:"all 0.15s" }}>
              <div style={{ width:"14px", height:"14px", borderRadius:"3px", border:"1px solid "+(selected.has(layer.id)?layer.accent:"#334155"),
                background:selected.has(layer.id)?layer.accent:"transparent", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                {selected.has(layer.id) && <span style={{ color:"#000", fontSize:"9px", lineHeight:1, fontWeight:"700" }}>✓</span>}
              </div>
              <div style={{ width:"3px", height:"16px", background:layer.accent, borderRadius:"2px", flexShrink:0 }} />
              <span style={{ fontSize:"12px", color:"#e2e8f0" }}>{layer.label}</span>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", gap:"8px" }}>
          <button onClick={onClose} style={{ flex:1, padding:"8px", borderRadius:"6px", border:"1px solid #1e293b", background:"transparent", color:"#64748b", cursor:"pointer", fontSize:"12px" }}>Cancel</button>
          <button onClick={()=>{ onSave([...selected]); onClose(); }}
            style={{ flex:1, padding:"8px", borderRadius:"6px", border:"none", background:exec.accent, color:"#000", cursor:"pointer", fontSize:"12px", fontWeight:"700" }}>Save</button>
        </div>
      </div>
    </div>
  );
}

/* ── Layer architecture view ── */
function LayerView({ layers }: any) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
      {layers.map(layer => {
        const desc = layerDescriptions[layer.id];
        if (!desc) return null;
        return (
          <div key={layer.id} style={{ borderRadius:"12px", border:"1px solid "+layer.accent+"33", background:layer.color+"44", overflow:"hidden" }}>
            <div style={{ display:"flex", borderBottom:"1px solid "+layer.accent+"22" }}>
              <div style={{ width:"4px", background:layer.accent, flexShrink:0 }} />
              <div style={{ padding:"16px 20px", flex:1 }}>
                <div style={{ display:"flex", alignItems:"baseline", gap:"12px", flexWrap:"wrap", marginBottom:"8px" }}>
                  <span style={{ fontSize:"16px", fontWeight:"700", color:"#f1f5f9" }}>{layer.label}</span>
                  <span style={{ fontSize:"9px", color:layer.accent, fontFamily:"Courier New, monospace", letterSpacing:"2px" }}>{layer.sublabel}</span>
                </div>
                <p style={{ margin:0, fontSize:"12px", color:"#cbd5e1", lineHeight:"1.7", maxWidth:"780px" }}>{desc.purpose}</p>
              </div>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap" }}>
              <div style={{ flex:"1 1 340px", padding:"16px 20px", borderRight:"1px solid "+layer.accent+"15", borderBottom:"1px solid "+layer.accent+"15" }}>
                <div style={{ fontSize:"9px", letterSpacing:"3px", color:layer.accent, fontFamily:"Courier New, monospace", marginBottom:"12px", textTransform:"uppercase" }}>What Happens Here</div>
                {desc.activities.map((a,i)=>(
                  <div key={i} style={{ display:"flex", gap:"8px", marginBottom:"9px" }}>
                    <span style={{ color:layer.accent, flexShrink:0, marginTop:"3px", fontSize:"9px" }}>▸</span>
                    <span style={{ fontSize:"12px", color:"#cbd5e1", lineHeight:"1.55" }}>{a}</span>
                  </div>
                ))}
              </div>
              <div style={{ flex:"0 1 260px", display:"flex", flexDirection:"column" }}>
                <div style={{ padding:"16px 20px", borderBottom:"1px solid "+layer.accent+"15" }}>
                  <div style={{ fontSize:"9px", letterSpacing:"3px", color:layer.accent, fontFamily:"Courier New, monospace", marginBottom:"10px", textTransform:"uppercase" }}>Key Outputs</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:"5px" }}>
                    {desc.outputs.map((o,i)=>(
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:"6px", background:layer.accent+"12", border:"1px solid "+layer.accent+"25", borderRadius:"6px", padding:"5px 10px" }}>
                        <div style={{ width:"5px", height:"5px", borderRadius:"50%", background:layer.accent, flexShrink:0 }} />
                        <span style={{ fontSize:"11px", color:"#e2e8f0" }}>{o}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ padding:"14px 20px", borderBottom:"1px solid "+layer.accent+"15" }}>
                  <div style={{ fontSize:"9px", letterSpacing:"3px", color:"#ef4444", fontFamily:"Courier New, monospace", marginBottom:"8px", textTransform:"uppercase" }}>What This Is Not</div>
                  <p style={{ margin:0, fontSize:"11px", color:"#94a3b8", lineHeight:"1.6", fontStyle:"italic" }}>{desc.notThis}</p>
                </div>
                <div style={{ padding:"14px 20px", background:layer.accent+"08" }}>
                  <div style={{ fontSize:"9px", letterSpacing:"3px", color:layer.accent, fontFamily:"Courier New, monospace", marginBottom:"8px", textTransform:"uppercase" }}>On Human Flourishing</div>
                  <p style={{ margin:0, fontSize:"11px", color:"#94a3b8", lineHeight:"1.6" }}>{desc.flourishing}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function MatrixOrg() {
  const [org,       setOrg]       = useState<any>(initData);
  const [saved,     setSaved]     = useState(false);
  const [loaded,    setLoaded]    = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [stageFilter, setStageFilter] = useState("all");
  const [addRoleTarget, setAddRoleTarget] = useState<any>(null);

  // Convex persistence
  const convexData = useQuery(api.orgData.get, { key: "default" });
  const saveToConvex = useMutation(api.orgData.save);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load from Convex on first data
  useEffect(() => {
    if (loaded) return;
    if (convexData === undefined) return;
    if (convexData && convexData.data) {
      try { setOrg(JSON.parse(convexData.data)); } catch {}
    }
    setLoaded(true);
  }, [convexData, loaded]);

  // Debounced auto-save to Convex
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

  const [showAddCol, setShowAddCol] = useState(false);
  const [showAddRow, setShowAddRow] = useState(false);
  const [view,       setView]       = useState("people");
  const [jdOpen,     setJdOpen]     = useState<any>(null);
  const [collapsedExecs, setCollapsedExecs] = useState(new Set());
  const toggleCollapse = (id) => setCollapsedExecs(s => { const n = new Set(s); if(n.has(id)) n.delete(id); else n.add(id); return n; });
  const [assignOpen, setAssignOpen] = useState<any>(null);

  const updateLayerLead   = (id,v) => setOrg(o=>({...o,layers:o.layers.map(l=>l.id===id?{...l,lead:{...l.lead,name:v}}:l)}));
  const updateLayerLabel  = (id,v) => setOrg(o=>({...o,layers:o.layers.map(l=>l.id===id?{...l,label:v}:l)}));
  const updateLayerSublabel = (id,v) => setOrg(o=>({...o,layers:o.layers.map(l=>l.id===id?{...l,sublabel:v}:l)}));
  const addLayer          = (layer) => { const id=uid(); setOrg(o=>({...o,layers:[...o.layers,{...layer,id}]})); setShowAddRow(false); };
  const removeLayer       = (id)    => setOrg(o=>({...o,layers:o.layers.filter(l=>l.id!==id)}));
  const moveLayer         = (id,dir)=> setOrg(o=>{ const arr=[...o.layers]; const i=arr.findIndex(l=>l.id===id); const j=i+dir; if(j<0||j>=arr.length)return o; [arr[i],arr[j]]=[arr[j],arr[i]]; return{...o,layers:arr}; });

  const updateProductName = (id,v) => setOrg(o=>({...o,products:o.products.map(p=>p.id===id?{...p,name:v}:p)}));
  const updateProductLead = (id,v) => setOrg(o=>({...o,products:o.products.map(p=>p.id===id?{...p,productLead:v}:p)}));
  const addProduct        = ({name,type,productLead}) => { const id=uid(); const cells={}; org.layers.forEach(l=>{cells[l.id]=[];}); setOrg(o=>({...o,products:[...o.products,{id,name,type,productLead,cells}]})); setShowAddCol(false); };
  const removeProduct     = (id)   => setOrg(o=>({...o,products:o.products.filter(p=>p.id!==id)}));
  const moveProduct       = (id,dir)=> setOrg(o=>{ const arr=[...o.products]; const i=arr.findIndex(p=>p.id===id); const j=i+dir; if(j<0||j>=arr.length)return o; [arr[i],arr[j]]=[arr[j],arr[i]]; return{...o,products:arr}; });

  const updateCellItem    = (pId,lId,idx,field,val) => setOrg(o=>({...o,products:o.products.map(p=>{if(p.id!==pId)return p;const n=[...(p.cells[lId]||[])];n[idx]={...n[idx],[field]:val};return{...p,cells:{...p.cells,[lId]:n}};})}));
  const deleteCellItem    = (pId,lId,idx)            => setOrg(o=>({...o,products:o.products.map(p=>{if(p.id!==pId)return p;const n=[...(p.cells[lId]||[])];n.splice(idx,1);return{...p,cells:{...p.cells,[lId]:n}};})}));
  const addCellItem       = (pId,lId,name,stage)     => setOrg(o=>({...o,products:o.products.map(p=>{if(p.id!==pId)return p;return{...p,cells:{...p.cells,[lId]:[...(p.cells[lId]||[]),{name,stage}]}};})}));

  const updateInnovation     = (idx,v) => setOrg(o=>{const a=[...o.innovation];a[idx]=v;return{...o,innovation:a};});
  const updateInnovationLead = (v)     => setOrg(o=>({...o,innovationLead:v}));

  const addExecutive = () => {
    const newExec = { id:uid(), name:"New Leader", role:"Executive Role", color:"#1a2030", accent:"#60a5fa", layers:[] };
    setOrg(o=>({...o, executives:[...(o.executives||[]), newExec]}));
    setAssignOpen(newExec);
  };
  const removeExecutive  = (id)    => setOrg(o=>({...o, executives:(o.executives||[]).filter(e=>e.id!==id)}));
  const updateExecName   = (id,v)  => setOrg(o=>({...o, executives:(o.executives||[]).map(e=>e.id===id?{...e,name:v}:e)}));
  const updateExecRole   = (id,v)  => setOrg(o=>({...o, executives:(o.executives||[]).map(e=>e.id===id?{...e,role:v}:e)}));
  const updateExecLayers = (id,ls) => setOrg(o=>({...o, executives:(o.executives||[]).map(e=>e.id===id?{...e,layers:ls}:e)}));

  const btnStyle = (accent="#4a9eff") => ({
    display:"inline-flex", alignItems:"center", gap:"5px",
    background:"transparent", border:"1px dashed "+accent+"55", borderRadius:"7px",
    color:accent+"99", cursor:"pointer", fontSize:"11px", padding:"5px 12px",
    fontFamily:"Courier New, monospace", letterSpacing:"1px", transition:"all 0.15s",
  });

  return (
    <div style={{ fontFamily:"Georgia, Times New Roman, serif", background:"#070d14", minHeight:"100vh", color:"#e2e8f0", padding:"28px 20px" }}>

      {!loaded && (
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh" }}>
          <div style={{ fontSize:"12px", color:"#475569", fontFamily:"Courier New, monospace", letterSpacing:"2px" }}>Loading...</div>
        </div>
      )}

      {loaded && (<>
      {showAddCol && <AddColModal onAdd={addProduct} onClose={()=>setShowAddCol(false)} />}
      {showAddRow && <AddRowModal onAdd={addLayer}   onClose={()=>setShowAddRow(false)} />}
      {jdOpen     && <JDModal layerId={jdOpen.layerId} layer={jdOpen.layer} onClose={()=>setJdOpen(null)} />}
      {assignOpen && <AssignRowsModal exec={assignOpen} layers={org.layers} onSave={v=>updateExecLayers(assignOpen.id,v)} onClose={()=>setAssignOpen(null)} />}
      {addRoleTarget && (
        <AddRoleModal
          accent={addRoleTarget.accent}
          onAdd={(name, stage) => { addCellItem(addRoleTarget.prodId, addRoleTarget.layerId, name, stage); setAddRoleTarget(null); }}
          onClose={() => setAddRoleTarget(null)}
        />
      )}

      {/* hint bar */}
      <div style={{ textAlign:"center", marginBottom:"6px", display:"flex", alignItems:"center", justifyContent:"center", gap:"16px", flexWrap:"wrap" }}>
        <span style={{ fontSize:"10px", color:"#475569", fontFamily:"Courier New, monospace" }}>
          ✎ Click any name to rename · hover chips for controls · ⟳ cycles stage · + to add a role
        </span>
        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          <span style={{ fontSize:"10px", fontFamily:"Courier New, monospace", color: saved ? "#3ecf8e" : saving ? "#facc15" : "#334155", transition:"color 0.3s" }}>
            {saved ? "✓ saved to cloud" : saving ? "saving..." : "auto-saving"}
          </span>
          <button onClick={() => { navigator.clipboard.writeText(JSON.stringify(org, null, 2)).then(()=>alert("Copied!")); }}
            style={{ fontSize:"9px", fontFamily:"Courier New, monospace", color:"#3ecf8e", background:"none", border:"1px solid #3ecf8e44", borderRadius:"4px", padding:"2px 8px", cursor:"pointer", letterSpacing:"1px" }}>EXPORT</button>
          <button onClick={() => { if (window.confirm("Reset to defaults?")) { setOrg(initData); } }}
            style={{ fontSize:"9px", fontFamily:"Courier New, monospace", color:"#475569", background:"none", border:"1px solid #1e293b", borderRadius:"4px", padding:"2px 8px", cursor:"pointer", letterSpacing:"1px" }}
            onMouseEnter={e=>e.currentTarget.style.color="#ef4444"}
            onMouseLeave={e=>e.currentTarget.style.color="#475569"}>RESET</button>
          <a href="/roster" style={{ padding:"5px 14px", borderRadius:"16px", fontSize:"11px", fontWeight:"500", color:"rgba(255,255,255,0.7)", background:"rgba(255,255,255,0.1)", textDecoration:"none", border:"1px solid rgba(255,255,255,0.06)", transition:"all 0.15s", display:"inline-flex", alignItems:"center", gap:"6px" }}>
            👤 Roster
          </a>
        </div>
      </div>

      {/* view toggle */}
      <div style={{ display:"flex", justifyContent:"center", marginBottom:"20px" }}>
        <div style={{ display:"flex", background:"#0b1320", border:"1px solid #1e293b", borderRadius:"8px", padding:"3px", gap:"3px" }}>
          {[["people","👥  People"],["layers","⚙️  How Layers Work"]].map(([v,label])=>(
            <button key={v} onClick={()=>setView(v)}
              style={{ padding:"6px 18px", borderRadius:"6px", border:"none", cursor:"pointer", fontSize:"11px", fontFamily:"Courier New, monospace", letterSpacing:"1px", transition:"all 0.15s",
                background:view===v?"#1e3a5f":"transparent", color:view===v?"#4a9eff":"#475569", fontWeight:view===v?"700":"400" }}>{label}</button>
          ))}
        </div>
      </div>

      {/* header */}
      <div style={{ textAlign:"center", marginBottom:"20px" }}>
        <div style={{ fontSize:"10px", letterSpacing:"4px", color:"#475569", textTransform:"uppercase", marginBottom:"7px", fontFamily:"Courier New, monospace" }}>Gloo - Platform and Product Team</div>
        <h1 style={{ fontSize:"26px", fontWeight:"700", margin:"0 0 3px", color:"#e2e8f0" }}>Platform Matrix Org</h1>
        <p style={{ fontSize:"12px", color:"#475569", margin:0 }}>Q2 2026 - Draft pending Ben alignment</p>
      </div>

      {view === "layers" ? <LayerView layers={org.layers} /> : (<>

      {/* ── Stage filter bar ── */}
      <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"16px", flexWrap:"wrap" }}>
        <span style={{ fontSize:"10px", color:"#475569", fontFamily:"Courier New, monospace", letterSpacing:"2px", marginRight:"4px" }}>FILTER BY STAGE:</span>
        {["all","stabilize","modernize","productize"].map(s => {
          const st = STAGES[s];
          const active = stageFilter === s;
          return (
            <button key={s} onClick={()=>setStageFilter(s)}
              style={{ display:"inline-flex", alignItems:"center", gap:"6px", padding:"5px 12px", borderRadius:"6px", cursor:"pointer",
                border:"1px solid "+(active ? st.border : "#1e293b"),
                background: active ? st.bg : "transparent",
                color: active ? st.color : "#475569",
                fontSize:"11px", fontFamily:"Courier New, monospace", letterSpacing:"0.5px", transition:"all 0.15s" }}>
              {s !== "all" && <span style={{ width:"8px", height:"8px", borderRadius:"50%", background: active ? st.color : "#334155", display:"inline-block", flexShrink:0 }} />}
              {st.label}
            </button>
          );
        })}
        {stageFilter !== "all" && (
          <span style={{ fontSize:"10px", color:"#475569", fontFamily:"Courier New, monospace", marginLeft:"8px" }}>
            Dimmed chips are allocated to a different stage
          </span>
        )}
      </div>

      {/* matrix */}
      <div style={{ overflowX:"auto", borderRadius:"14px", border:"1px solid #1e293b", background:"#0b1320" }}>
        <table style={{ borderCollapse:"collapse", width:"100%", minWidth:"860px" }}>
          <thead>
            <tr>
              <th style={{ width:"140px", padding:"10px 12px", textAlign:"left", fontSize:"9px", letterSpacing:"3px", color:"#334155", fontFamily:"Courier New, monospace", fontWeight:"400", borderBottom:"1px solid #1e293b", borderRight:"1px solid #1e293b", verticalAlign:"middle" }}>
                <div style={{ marginBottom:"8px" }}>ELT</div>
                <button onClick={addExecutive}
                  style={{ background:"none", border:"1px dashed #334155", borderRadius:"5px", color:"#475569", cursor:"pointer", fontSize:"9px", fontFamily:"Courier New, monospace", padding:"3px 7px", letterSpacing:"1px", transition:"all 0.15s" }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="#e2e8f0";e.currentTarget.style.color="#e2e8f0";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="#334155";e.currentTarget.style.color="#475569";}}>+ ADD</button>
              </th>
              <th style={{ width:"210px", padding:"14px 16px", textAlign:"left", fontSize:"9px", letterSpacing:"3px", color:"#334155", fontFamily:"Courier New, monospace", fontWeight:"400", borderBottom:"1px solid #1e293b", borderRight:"1px solid #1e293b" }}>
                LAYER / PRODUCT
              </th>
              {org.products.map((p,pi)=>{
                const tc=typeColors[p.type]||typeColors.church;
                const isFirst=pi===0, isLast=pi===org.products.length-1;
                return (
                  <th key={p.id} style={{ padding:"14px 12px", textAlign:"center", borderBottom:"1px solid #1e293b", borderRight:"1px solid #1e293b", background:tc.bg, minWidth:"155px", position:"relative" }}
                    onMouseEnter={e=>e.currentTarget.querySelectorAll<HTMLElement>(".col-ctrl").forEach(b=>b.style.opacity="1")}
                    onMouseLeave={e=>e.currentTarget.querySelectorAll<HTMLElement>(".col-ctrl").forEach(b=>b.style.opacity="0")}
                  >
                    <button className="col-ctrl" onClick={()=>moveProduct(p.id,-1)} disabled={isFirst}
                      style={{ opacity:0, position:"absolute", top:"50%", left:"4px", transform:"translateY(-50%)", background:"none", border:"none", color:isFirst?"#1e293b":"#64748b", cursor:isFirst?"default":"pointer", fontSize:"14px", lineHeight:1, transition:"opacity 0.15s", padding:"2px" }}>◀</button>
                    <button className="col-ctrl" onClick={()=>moveProduct(p.id,1)} disabled={isLast}
                      style={{ opacity:0, position:"absolute", top:"50%", right:"20px", transform:"translateY(-50%)", background:"none", border:"none", color:isLast?"#1e293b":"#64748b", cursor:isLast?"default":"pointer", fontSize:"14px", lineHeight:1, transition:"opacity 0.15s", padding:"2px" }}>▶</button>
                    <button className="col-ctrl" onClick={()=>removeProduct(p.id)}
                      style={{ opacity:0, position:"absolute", top:"6px", right:"4px", background:"none", border:"none", color:"#ef4444", cursor:"pointer", fontSize:"13px", lineHeight:1, transition:"opacity 0.15s", padding:"2px" }}>×</button>
                    <div style={{ display:"inline-block", fontSize:"9px", fontFamily:"Courier New, monospace", letterSpacing:"2px", background:tc.badge+"20", color:tc.badge, border:"1px solid "+tc.badge+"40", padding:"2px 6px", borderRadius:"4px", marginBottom:"5px" }}>{tc.badgeText}</div>
                    <div style={{ fontSize:"14px", fontWeight:"700", color:"#f1f5f9", marginBottom:"8px" }}>
                      <ET value={p.name} onChange={v=>updateProductName(p.id,v)} style={{ fontWeight:"700", fontSize:"14px", color:"#f1f5f9" }} />
                    </div>
                    <div style={{ padding:"6px 10px", background:"#080e14", border:"1px solid "+tc.badge+"33", borderRadius:"8px", display:"inline-block" }}>
                      <div style={{ fontSize:"11px", fontWeight:"700", color:tc.badge }}>
                        <ET value={p.productLead} onChange={v=>updateProductLead(p.id,v)} style={{ fontWeight:"700", color:tc.badge }} />
                      </div>
                      <div style={{ fontSize:"9px", color:"#94a3b8" }}>Product Lead</div>
                    </div>
                  </th>
                );
              })}
              <th style={{ padding:"14px 12px", borderBottom:"1px solid #1e293b", background:"transparent", verticalAlign:"middle" }}>
                <button onClick={()=>setShowAddCol(true)} style={btnStyle("#4a9eff")}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="#4a9eff";e.currentTarget.style.color="#4a9eff";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="#4a9eff55";e.currentTarget.style.color="#4a9eff99";}}>+ Col</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const coverage = {};
              (org.executives||[]).forEach(ex => ex.layers.forEach(lId => { coverage[lId] = ex.id; }));
              const execById = {};
              (org.executives||[]).forEach(ex => { execById[ex.id] = ex; });
              const segments: any[] = [];
              let i = 0;
              while (i < org.layers.length) {
                const lId = org.layers[i].id;
                const execId = coverage[lId];
                if (!execId) { segments.push({ exec: null, rowSpan: 1 }); i++; }
                else {
                  let span = 0, j = i;
                  while (j < org.layers.length && coverage[org.layers[j].id] === execId) { span++; j++; }
                  segments.push({ exec: execById[execId], rowSpan: span });
                  for (let k = 1; k < span; k++) segments.push(null);
                  i = j;
                }
              }
              return org.layers.map((layer,li) => {
                const seg = segments[li];
                const coveredByExec = coverage[layer.id] ? execById[coverage[layer.id]] : null;
                const isCollapsed = coveredByExec && collapsedExecs.has(coveredByExec.id);
                return (
                  <tr key={layer.id} style={{ verticalAlign:"top" }}>
                    {seg !== null && (
                      seg && seg.exec ? (
                        <td rowSpan={seg.rowSpan} style={{ padding:"10px", borderRight:"1px solid #1e293b", borderBottom:"1px solid #1e293b", background:seg.exec.color, verticalAlign:"middle", position:"relative", minWidth:"140px", cursor:"pointer" }}
                          onClick={()=>toggleCollapse(seg.exec.id)}
                          onMouseEnter={e=>e.currentTarget.querySelectorAll<HTMLElement>(".ex-ctrl").forEach(b=>b.style.opacity="1")}
                          onMouseLeave={e=>e.currentTarget.querySelectorAll<HTMLElement>(".ex-ctrl").forEach(b=>b.style.opacity="0")}
                        >
                          <button className="ex-ctrl" onClick={e=>{e.stopPropagation();removeExecutive(seg.exec.id);}}
                            style={{ opacity:0, position:"absolute", top:"5px", right:"5px", background:"none", border:"none", color:"#ef4444", cursor:"pointer", fontSize:"12px", lineHeight:1, transition:"opacity 0.15s", padding:"2px" }}>×</button>
                          <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"8px" }}>
                            <div style={{ width:"3px", height:"32px", background:seg.exec.accent, borderRadius:"2px", flexShrink:0 }} />
                            <span style={{ fontSize:"14px", color:seg.exec.accent, lineHeight:1, userSelect:"none" }}>{collapsedExecs.has(seg.exec.id) ? "▶" : "▼"}</span>
                          </div>
                          <div style={{ fontSize:"11px", fontWeight:"700", color:seg.exec.accent, marginBottom:"3px" }}>
                            <ET value={seg.exec.name} onChange={v=>updateExecName(seg.exec.id,v)} style={{ fontWeight:"700", color:seg.exec.accent }} />
                          </div>
                          <div style={{ fontSize:"9px", color:"#94a3b8", marginBottom:"10px" }}>
                            <ET value={seg.exec.role} onChange={v=>updateExecRole(seg.exec.id,v)} style={{ color:"#94a3b8", fontSize:"9px" }} />
                          </div>
                          {!collapsedExecs.has(seg.exec.id) && (
                            <button className="ex-ctrl" onClick={e=>{e.stopPropagation();setAssignOpen(seg.exec);}}
                              style={{ opacity:0, background:"none", border:"1px solid "+seg.exec.accent+"44", borderRadius:"4px", color:seg.exec.accent+"99", cursor:"pointer", fontSize:"8px", fontFamily:"Courier New, monospace", padding:"2px 6px", letterSpacing:"1px", transition:"all 0.15s" }}>ASSIGN ROWS</button>
                          )}
                        </td>
                      ) : (
                        <td style={{ padding:"12px 10px", borderRight:"1px solid #1e293b", borderBottom:"1px solid #1e293b", background:"#08080f", verticalAlign:"middle" }}>
                          {!isCollapsed && <div style={{ fontSize:"8px", color:"#1e293b", fontFamily:"Courier New, monospace", textAlign:"center" }}>unassigned</div>}
                        </td>
                      )
                    )}

                    {isCollapsed ? (
                      <td colSpan={org.products.length + 2} style={{ padding:"5px 14px", borderBottom:"1px solid #1e293b", background:layer.color+"33", verticalAlign:"middle" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                          <div style={{ width:"3px", height:"14px", background:layer.accent, borderRadius:"2px", flexShrink:0 }} />
                          <span style={{ fontSize:"10px", fontWeight:"600", color:"#64748b" }}>{layer.label}</span>
                          <span style={{ fontSize:"9px", color:layer.accent+"60", fontFamily:"Courier New, monospace" }}>{layer.sublabel}</span>
                        </div>
                      </td>
                    ) : (
                      <>
                        <td style={{ padding:"16px", borderRight:"1px solid #1e293b", borderBottom:"1px solid #1e293b", background:layer.color+"55", verticalAlign:"top", position:"relative" }}
                          onMouseEnter={e=>e.currentTarget.querySelectorAll<HTMLElement>(".row-ctrl").forEach(b=>b.style.opacity="1")}
                          onMouseLeave={e=>e.currentTarget.querySelectorAll<HTMLElement>(".row-ctrl").forEach(b=>b.style.opacity="0")}
                        >
                          <button className="row-ctrl" onClick={()=>moveLayer(layer.id,-1)} disabled={li===0}
                            style={{ opacity:0, position:"absolute", top:"4px", right:"38px", background:"none", border:"none", color:li===0?"#1e293b":"#64748b", cursor:li===0?"default":"pointer", fontSize:"13px", lineHeight:1, transition:"opacity 0.15s", padding:"2px" }}>▲</button>
                          <button className="row-ctrl" onClick={()=>moveLayer(layer.id,1)} disabled={li===org.layers.length-1}
                            style={{ opacity:0, position:"absolute", top:"4px", right:"22px", background:"none", border:"none", color:li===org.layers.length-1?"#1e293b":"#64748b", cursor:li===org.layers.length-1?"default":"pointer", fontSize:"13px", lineHeight:1, transition:"opacity 0.15s", padding:"2px" }}>▼</button>
                          <button className="row-ctrl" onClick={()=>removeLayer(layer.id)}
                            style={{ opacity:0, position:"absolute", top:"6px", right:"6px", background:"none", border:"none", color:"#ef4444", cursor:"pointer", fontSize:"13px", lineHeight:1, transition:"opacity 0.15s", padding:"2px" }}>×</button>
                          <div style={{ display:"flex", gap:"10px" }}>
                            <div style={{ width:"3px", minHeight:"50px", background:layer.accent, borderRadius:"2px", flexShrink:0 }} />
                            <div style={{ flex:1 }}>
                              <div style={{ fontSize:"12px", fontWeight:"700", color:"#f1f5f9", lineHeight:"1.3" }}><ET value={layer.label} onChange={v=>updateLayerLabel(layer.id,v)} style={{ fontSize:"12px", fontWeight:"700", color:"#f1f5f9" }} /></div>
                              <div style={{ fontSize:"9px", color:layer.accent, fontFamily:"Courier New, monospace", marginTop:"2px", marginBottom:"8px" }}><ET value={layer.sublabel} onChange={v=>updateLayerSublabel(layer.id,v)} style={{ fontSize:"9px", color:layer.accent, fontFamily:"Courier New, monospace" }} /></div>
                              <div style={{ padding:"7px 10px", background:"#080e14", border:"1px solid "+layer.accent+"33", borderRadius:"8px" }}>
                                <ET value={layer.lead.name} onChange={v=>updateLayerLead(layer.id,v)} style={{ fontSize:"11px", fontWeight:"700", color:layer.accent }} />
                                <div style={{ fontSize:"9px", color:"#94a3b8" }}>{layer.lead.role}</div>
                              </div>
                              {JDS[layer.id] && (
                                <button onClick={()=>setJdOpen({layerId:layer.id, layer})}
                                  style={{ marginTop:"8px", background:"none", border:"1px solid "+layer.accent+"40", borderRadius:"5px", color:layer.accent+"99", cursor:"pointer", fontSize:"9px", fontFamily:"Courier New, monospace", padding:"3px 8px", letterSpacing:"1px", transition:"all 0.15s" }}
                                  onMouseEnter={e=>{e.currentTarget.style.borderColor=layer.accent;e.currentTarget.style.color=layer.accent;}}
                                  onMouseLeave={e=>{e.currentTarget.style.borderColor=layer.accent+"40";e.currentTarget.style.color=layer.accent+"99";}}>VIEW JD →</button>
                              )}
                            </div>
                          </div>
                        </td>

                        {org.products.map(prod => {
                          const items = prod.cells[layer.id] || [];
                          const tc = typeColors[prod.type] || typeColors.church;
                          const hasJD = !!JDS[layer.id];
                          return (
                            <td key={prod.id} style={{ padding:"12px 10px", borderRight:"1px solid #1e293b", borderBottom:"1px solid #1e293b", background:tc.bg, verticalAlign:"top" }}>
                              <div style={{ display:"flex", flexWrap:"wrap" }} onClick={e=>e.stopPropagation()}>
                                {items.map((item, idx) => {
                                  const dimmed = stageFilter !== "all" && item.stage !== stageFilter && item.stage !== "all";
                                  return (
                                    <Chip key={idx}
                                      name={item.name} stage={item.stage} accent={layer.accent} dimmed={dimmed}
                                      onChange={v=>updateCellItem(prod.id,layer.id,idx,"name",v)}
                                      onStageChange={v=>updateCellItem(prod.id,layer.id,idx,"stage",v)}
                                      onDelete={()=>deleteCellItem(prod.id,layer.id,idx)}
                                      onJD={hasJD ? ()=>setJdOpen({layerId:layer.id,layer}) : undefined}
                                    />
                                  );
                                })}
                                <button
                                  onClick={e=>{e.stopPropagation(); setAddRoleTarget({prodId:prod.id, layerId:layer.id, accent:layer.accent});}}
                                  title="Add role"
                                  style={{ background:"none", border:"1px dashed "+layer.accent+"40", borderRadius:"6px", color:layer.accent+"80", cursor:"pointer", fontSize:"14px", width:"26px", height:"26px", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"5px", transition:"all 0.15s", padding:0 }}
                                  onMouseEnter={e=>{e.currentTarget.style.borderColor=layer.accent;e.currentTarget.style.color=layer.accent;}}
                                  onMouseLeave={e=>{e.currentTarget.style.borderColor=layer.accent+"40";e.currentTarget.style.color=layer.accent+"80";}}>+</button>
                              </div>
                            </td>
                          );
                        })}
                        <td style={{ borderBottom:"1px solid #1e293b", background:"transparent" }} />
                      </>
                    )}
                  </tr>
                );
              });
            })()}

            {/* add row */}
            <tr>
              <td colSpan={org.products.length + 3} style={{ padding:"12px 16px", background:"transparent" }}>
                <button onClick={()=>setShowAddRow(true)} style={btnStyle("#3ecf8e")}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="#3ecf8e";e.currentTarget.style.color="#3ecf8e";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="#3ecf8e55";e.currentTarget.style.color="#3ecf8e99";}}>+ Add Row</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── legend ── */}
      <div style={{ marginTop:"16px", display:"flex", gap:"20px", flexWrap:"wrap", fontSize:"10px", color:"#64748b", fontFamily:"Courier New, monospace" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"6px", fontWeight:"700", color:"#94a3b8", marginRight:"4px" }}>COLUMN TYPE:</div>
        <div style={{ display:"flex", alignItems:"center", gap:"5px" }}><div style={{ width:"9px", height:"9px", borderRadius:"2px", background:"#4a9eff33", border:"1px solid #4a9eff55" }} />Church</div>
        <div style={{ display:"flex", alignItems:"center", gap:"5px" }}><div style={{ width:"9px", height:"9px", borderRadius:"2px", background:"#facc1522", border:"1px solid #facc1544" }} />360° Clients</div>
        <div style={{ display:"flex", alignItems:"center", gap:"5px" }}><div style={{ width:"9px", height:"9px", borderRadius:"2px", background:"#0e1a10", border:"1px solid #3ecf8e55" }} />Gloo</div>
        <div style={{ width:"1px", background:"#1e293b", margin:"0 4px" }} />
        <div style={{ display:"flex", alignItems:"center", gap:"6px", fontWeight:"700", color:"#94a3b8", marginRight:"4px" }}>STAGE ALLOCATION:</div>
        {["stabilize","modernize","productize","all"].map(s => {
          const st = STAGES[s];
          return (
            <div key={s} style={{ display:"flex", alignItems:"center", gap:"5px" }}>
              <div style={{ width:"9px", height:"9px", borderRadius:"50%", background:st.color }} />
              <StageBadge stage={s} small />
              <span style={{ color: st.color }}>{st.label}</span>
            </div>
          );
        })}
        <div style={{ color:"#334155", marginLeft:"8px" }}>Hover chip → ⟳ cycles stage · + opens stage picker</div>
      </div>
      </>)}
      </>)}
    </div>
  );
}
