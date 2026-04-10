import { useState, useRef, useEffect } from "react";

const ACCENT_OPTIONS = ["#4a9eff","#f97316","#3ecf8e","#c084fc","#f472b6","#facc15","#34d399","#60a5fa"];
const COLOR_OPTIONS  = ["#1a3a5c","#1a2a3a","#1a3d2e","#3a1a3a","#2a1a1a","#1a3a2a","#2a2a1a","#1a1a3a"];

/* ─────────────────────────────────────────────
   JOB DESCRIPTIONS  (keyed by layer id)
───────────────────────────────────────────── */
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
    reports: "Application Layer Lead (TBD)",
    what: "This is the layer customers touch — and Application Layer Engineers are responsible for the platform itself. You build and maintain the unified surface that Ministry Chat and Polymer are becoming: the dashboards, interfaces, role-based configurations, and agent surfaces that make all the intelligence of the layers below actually usable. Your job is platform coherence. You are not building for one customer; you are making sure the platform can serve all of them. Forward deployment is how you learn what the platform needs to be — you go in, see the problems firsthand, and come back and build the right abstractions.",
    responsibilities: [
      "Build and evolve the unified customer-facing platform — Ministry Chat and Polymer converging into one coherent surface, white-labeled where needed.",
      "Own the platform architecture at the application layer — dashboards, interfaces, role-based configuration, and agent surfaces that scale across every customer deployment.",
      "Forward-deploy with an opinionated architecture — translate customer problems into platform solutions. When you find yourself tempted to build something custom for one customer, abstract it up.",
      "Surface complexity as simplicity — customers should not know about Convex or the trust fabric. They click a button and a thing happens.",
      "Own application-level performance, reliability, and security — the platform must be trustworthy before it can be useful.",
      "Close the loop — every forward deployment produces learnings that must come back to the platform as shared capabilities, not per-customer workarounds.",
    ],
    notThis: "A feature factory. A custom app developer (custom apps are a last resort, not a default). Someone who stays in the codebase and never talks to a customer. Someone who builds one-off solutions without asking whether it belongs in the platform.",
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
      "Custom one-off builds decrease over time as the platform gets smarter about what customers actually need",
      "Engineers can onboard to the application layer and ship confidently within days, not months",
    ],
    flourishing: "This layer is the face of the mission. The people using what you build are trying to make disciples, serve communities, and run organizations that care about human beings. When you build the platform well, every Platform Solution Engineer on top of it can move faster and serve more effectively. Build with that leverage in mind.",
  },
  platformEng: {
    title: "Platform Solution Engineer",
    reports: "Application Layer Lead (TBD)",
    what: "Platform Solution Engineers are the sharp end of the forward-deployment model. You are not a developer sitting in a codebase waiting for requirements — you are the person who goes into a church or nonprofit, feels the friction firsthand, and comes back with the configuration, agents, and workflows that solve it on the platform. The Platform Solution Engineer role is a differentiator. You need to understand how a church actually operates — staff structures, service workflows, pastoral communication rhythms, CHMS data — and translate that understanding into platform deployments that feel like they were built specifically for that org. Because they were. On top of shared infrastructure that serves every org like it.",
    responsibilities: [
      "Forward-deploy as your primary work mode — go on-site, embed with staff, understand how work actually moves, and build platform solutions that solve it. You are not taking orders; you are translating pain into products.",
      "Configure and deploy Ministry Chat for specific customers — their org chart, their communication voice, their Rock RMS configuration — per-customer configuration on shared infrastructure.",
      "Build and deploy customer-facing agents — expense automation, sermon content pipeline, Rock discovery and configuration, daily check-in workflows. You build them, deploy them, own them.",
      "Serve as the interface between customer need and platform capability — know what the platform can do today, know what it should be able to do next, and surface that intelligence back to the product and engineering teams.",
      "Close the loop — every deployment produces patterns that belong on the platform. Bring them back. A workflow you build for Church of the Resurrection belongs in shared solutions, not sitting in their configuration alone.",
      "Train and support ministry staff on the platform — reduce the time between deployment and adoption.",
    ],
    notThis: "A developer who takes requirements at face value. Someone who builds custom apps instead of platform configurations. A consultant who delivers and disappears. Someone who doesn't actually care about the mission of the organizations they serve.",
    looking: [
      "Background in ministry or church operations is a strong differentiator — you have been in the room when a church IT team is deciding whether to trust a new platform",
      "3+ years in technical customer-facing work — real configuration and deployment, not just demos",
      "Comfort going on-site with church staff and working through problems in real time",
      "Enough technical fluency to configure, deploy, and troubleshoot on the platform — you don't need to build the platform, but you need to be able to make it do things",
      "Genuine passion for the mission — churches, nonprofits, and the people they serve",
      "Strong communication: you translate between ministry language and platform language fluently in both directions",
    ],
    success: [
      "Customers forget they're using AI because the experience is that natural",
      "Time-to-value for a new church deployment is days, not months",
      "Agent deployments work the first time, not after three rounds of debugging",
      "Every deployment surfaces at least one insight that improves the platform for the next church",
      "Ministry staff spend meaningfully less time behind screens and more time with people",
      "Churches feel like the platform was built for them — because it was configured specifically for them, on infrastructure built for all of them",
    ],
    flourishing: "You are the closest person on this team to the actual mission. The pastors and ministry directors using what you deploy are trying to change lives. Your job is to make sure the platform gets out of their way and amplifies what they're already doing. Do not lose sight of that. It is why this role exists.",
  },
  services: {
    title: "Shared Solutions Engineer",
    reports: "Brian Johnson",
    what: "This is the intelligence and reusability layer. It is where skills are defined, agents are orchestrated, integrations are built, workflows are sequenced, and the trust fabric enforces what agents are and are not allowed to do. If the infrastructure layer is the brain, this layer is the nervous system. It is built once and used everywhere — the Microsoft integration built for Church of the Resurrection is the same integration that serves North Point. This is where leverage compounds fastest. But you can only build the right reusable infrastructure if you have seen the problem with your own eyes first.",
    responsibilities: [
      "Build and evolve the agent orchestration layer — Convex as the nerve center, orchestrating multi-step agentic workflows, maintaining state, managing the central registry of skills and tools.",
      "Forward-deploy to identify shared workflow patterns — what you observe does not become a bespoke solution for one customer. You bring it back and build it as shared infrastructure: a skill, a workflow template, an integration.",
      "Define and build skills as reusable infrastructure — versioned, tested capabilities deployed immediately across all customers. Rock RMS queries, expense-to-budget matching, pastoral voice generation.",
      "Build and maintain integrations — Microsoft, Rock RMS, Planning Center, eSpace, Concur, Ramp. Every integration built once, available to every customer.",
      "Design and enforce the trust fabric — pre-flight policy evaluation that answers 'is this allowed' before any agent takes action.",
      "Define workflow templates — expense automation, sermon content pipeline, daily check-in drip. Reusable, configurable, deployable without rebuilding the logic from scratch.",
    ],
    notThis: "An integration plumber who wires APIs together without thinking about reusability. A prompt engineer. A feature developer who builds one-off solutions for individual customers. Someone who waits for customer requirements to be handed to them instead of going to find them.",
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
      "Every forward deployment produces at least one new skill or workflow template that ships to all customers",
    ],
    flourishing: "The workflows you build free ministry staff from administrative friction that has nothing to do with why they went into ministry. Every hour of manual work you automate is an hour a pastor spends with someone who needed them. Design with that in mind.",
  },
  infra: {
    title: "Infrastructure & Data Engineer",
    reports: "Daniel Wilson",
    what: "Everything runs on this layer. Every agent, every workflow, every customer-facing surface draws from what gets built here. This is not backend engineering in the traditional sense. This is the foundation of an intelligent system. The goal is not just data storage and retrieval — it is an architecture where organizational context makes agents wise instead of generic. Where a Ministry Chat agent at Church of the Resurrection actually understands their org chart, their Lava configuration, their campus hierarchy, their staff relationships — and where that understanding improves automatically over time.",
    responsibilities: [
      "Build and steward the Gloo Brain — the context layer that transforms generic AI into ministry-intelligent AI. Architect how knowledge enters (org charts, config files, CRM exports, Rock RMS schema), how it's indexed and retrieved, and how agent outputs feed back in to compound over time.",
      "Forward-deploy to map data reality, not assumptions — sit with IT teams to understand actual data landscapes before designing infrastructure. What you learn does not become a workaround; it becomes input to the brain architecture.",
      "Design for independent data residency — customers' data lives on their own infrastructure while still benefiting from everything above this layer. Independent residency. Compounding intelligence. Both at once.",
      "Build the auditability and traceability layer — every agent action and decision must be traceable without making the platform slow.",
      "Own data normalization and the golden standard — canonical data models across organizations from 200-person nonprofits to global networks with thousands of subsidiaries.",
      "Design the continuous improvement loop — agent outputs become training signal; every forward deployment makes the system smarter for the next customer.",
    ],
    notThis: "A data pipeline engineer who moves records from A to B. A DBA who manages schemas. A passive infrastructure maintainer who keeps the lights on. Someone who designs data architecture from a conference room without ever sitting with the customer.",
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
    flourishing: "You will build systems that reduce the manual cognitive load on ministry leaders — freeing them to spend time with people instead of screens. The infrastructure you build is the foundation of that mission. Build it like it matters, because it does.",
  },
  product: {
    title: "Outcome Product Lead",
    reports: "Josh / Leadership",
    what: "Execution is no longer the bottleneck. In an agentic organization, agents can build faster than most teams can define what to build. That makes product judgment the rarest and most expensive resource in the system. Product exists to ensure we are building the right things — not everything customers ask for, not everything engineers find interesting, not everything that could theoretically be done. The right things. For the right customers. In the right order. And you cannot know what the right things are from a conference room. You find out by going in.",
    responsibilities: [
      "Forward-deploy as your primary research method — no roadmap item gets prioritized that you haven't seen a customer actually struggle with. Every quarter embedded inside 360 customer orgs.",
      "Define outcomes, not features — translate what you observe into precise outcome statements. Not 'build a Rock integration' — 'enable a Platform Solution Engineer to configure a church's full group hierarchy in under four hours using an agent-driven discovery workflow.'",
      "Prioritize ruthlessly and say no decisively — more requests will come in than can ever be built. Protect the roadmap from bloat, the team from distraction, and the platform from fragmentation.",
      "Design rapid experiments to validate assumptions — before committing engineering capacity, design the smallest possible experiment. Compress the feedback loop from months to days.",
      "Sequence the roadmap across layers — understand the dependencies between application, shared solutions, and infrastructure well enough to sequence work correctly. Wrong sequencing wastes everything. Right sequencing compounds everything.",
    ],
    notThis: "A backlog administrator. A requirements writer who transcribes customer requests into tickets. A coordination layer between engineering and design. Someone who prioritizes based on what customers say they want rather than what you've seen them actually struggle with.",
    looking: [
      "7+ years in product leadership, with some of that in platform or infrastructure products",
      "Demonstrated ability to define outcomes precisely and resist scope creep under pressure",
      "Strategic thinking that operates across a two-week sprint and an 18-month platform vision simultaneously",
      "Genuine comfort going on-site with enterprise customers and working through problems in real time",
      "Deep comfort with the ministry/faith-based technology market, or the humility and speed to develop it",
      "The ability to say no to people you respect, with clarity and without apology",
    ],
    success: [
      "The roadmap is understood by every engineer on the team without a kickoff meeting",
      "Every shipped feature traces back to something observed in a customer org, not just something requested",
      "The platform compounds because we built the right things in the right order",
      "Forward deployments produce specific, actionable roadmap intelligence — not just impressions",
      "Engineering time is never wasted on something that could have been invalidated in a two-day experiment",
    ],
    flourishing: "Velocity is not inherently good. Building the wrong thing faster is just a more expensive mistake. Your job is to ensure that what gets built actually serves the humans on the other end — the staff member who just wants to know if the room is booked, the pastor who wants to prep for Sunday without losing a Saturday. Product clarity is how we honor their time.",
  },
};

/* ─────────────────────────────────────────────
   LAYER DESCRIPTIONS  (for "How Layers Work" view)
───────────────────────────────────────────── */
const layerDescriptions = {
  design: {
    purpose: "Design in this organization is a systems function, not a production function. AI agents can generate UI faster than any designer — that makes the designer's job harder, not obsolete. The question is no longer 'can we make this screen' but 'are we defining the right constraints for agents to make screens well.' Those constraints must be discovered in the field, not invented from the inside.",
    activities: ["Forward-deploy into 360 customer orgs — watch how ministry leaders actually work, think, and move through their day","Translate field observations into design constraints: how a children's ministry director thinks in families not individuals — these become system rules","Architect and evolve the Gloo design system — behavioral logic, interaction patterns, and constraints robust enough that agent-generated UI feels designed, not assembled","Define experience frameworks for each platform surface — role-configured experiences for lead pastors, children's ministry directors, IT directors on the same platform","Curate and govern AI-generated output — evaluate agent-generated interfaces for coherence and alignment with the design system","Partner with application layer engineering to ensure design constraints are executable in code"],
    outputs: ["Gloo design system","Role-based experience frameworks","Design constraints & tokens","Field research synthesis","AI output governance standards"],
    notThis: "A Figma production role. A screen handoff function. A reactive support role. Someone who designs for ministry leaders without spending time with ministry leaders.",
    flourishing: "The people using what you design are real people doing work they believe matters. Design that respects their attention and gets out of their way is not just good UX. It is an act of service.",
  },
  appEng: {
    purpose: "Application Layer Engineers own the platform itself — the unified surface that Ministry Chat and Polymer are becoming. They build for all customers simultaneously, using any one customer's forward deployment as the discovery mechanism for what the platform needs to be.",
    activities: ["Build and evolve the unified customer-facing platform — Ministry Chat and Polymer converging into one coherent surface","Own platform architecture: dashboards, interfaces, role-based configuration, and agent surfaces that scale across every deployment","Forward-deploy with an opinionated architecture — translate customer problems into platform solutions, abstract up before building custom","Surface complexity as simplicity — customers should not know what's powering it; they click a button and a thing happens","Own application-level performance, reliability, and security","Close the loop — every deployment produces platform learnings, not per-customer workarounds"],
    outputs: ["Unified Ministry Chat / Polymer platform","Role-configured dashboards","Application layer architecture","White-labeled 360° surfaces","Platform performance & reliability"],
    notThis: "A feature factory. A custom app developer. Someone who builds one-off solutions without asking whether it belongs on the platform.",
    flourishing: "When you build the platform well, every Platform Solution Engineer on top of it moves faster and serves more effectively. Your leverage is in the infrastructure you make invisible.",
  },
  platformEng: {
    purpose: "Platform Solution Engineers are the sharp end of forward deployment. They go on-site, embed with staff, feel the friction firsthand, and configure the platform to solve it. They speak both ministry language and platform language — and they translate fluently in both directions.",
    activities: ["Forward-deploy as primary work mode — go on-site, embed with staff, understand how work actually moves, and build platform solutions that solve it","Configure and deploy Ministry Chat for specific customers — org chart, communication voice, Rock RMS configuration — per-customer config on shared infrastructure","Build and deploy customer-facing agents — expense automation, sermon content pipeline, Rock discovery, daily check-in workflows","Serve as the interface between customer need and platform capability — surface gaps back to product and engineering","Close the loop — every deployment surfaces patterns that belong on the platform, not sitting in one customer's configuration","Train and support ministry staff on the platform — reduce time from deployment to adoption"],
    outputs: ["Customer deployments","Configured agents","Onboarding & training","Forward-deployment intelligence","Platform gap reports"],
    notThis: "A developer who takes requirements at face value. Someone who builds custom apps instead of platform configurations. A consultant who delivers and disappears. Someone who doesn't care about the mission.",
    flourishing: "You are the closest person on this team to the actual mission. Do not lose sight of that. It is why this role exists.",
  },
  services: {
    purpose: "The intelligence and reusability layer — built once, used everywhere. Skills are defined, agents are orchestrated, integrations are built, workflows are sequenced, and the trust fabric enforces what agents are and are not allowed to do. The Microsoft integration built for one church is the same one that serves every church.",
    activities: ["Build and evolve the agent orchestration layer — Convex as the nerve center, maintaining state across multi-step agentic workflows","Forward-deploy to identify shared workflow patterns, then build them into the platform as skills and templates","Define and build skills as reusable infrastructure: versioned, tested capabilities deployed everywhere immediately","Build and maintain integrations: Microsoft, Rock RMS, Planning Center, eSpace, Concur, Ramp","Design and enforce the trust fabric — pre-flight policy evaluation before any agent takes action","Define workflow templates: expense automation, sermon content pipeline, daily check-in drip"],
    outputs: ["Agent orchestration layer (Convex)","Skills library","Integration registry","Trust fabric / governance system","Workflow templates","State management ledger"],
    notThis: "An integration plumber. A prompt engineer. A feature developer building one-off solutions. Someone who waits for requirements to be handed to them.",
    flourishing: "The workflows you build free ministry staff from administrative friction. Every hour of manual work you automate is an hour a pastor spends with someone who needed them.",
  },
  infra: {
    purpose: "Everything runs on this layer. The goal is an architecture where organizational context makes agents wise instead of generic — where a Ministry Chat agent at Church of the Resurrection understands their org chart, their Lava configuration, their campus hierarchy, and where that understanding improves automatically over time.",
    activities: ["Build and steward the Gloo Brain — the context layer that transforms generic AI into ministry-intelligent AI","Forward-deploy to map data reality, not assumptions — sit with IT teams before designing infrastructure","Design for independent data residency — customers' data on their own infrastructure while still benefiting from everything above","Build the auditability and traceability layer — every agent action must be traceable without making the platform slow","Own data normalization and the golden standard — canonical data models across all organization types","Design the continuous improvement loop — agent outputs become training signal"],
    outputs: ["Gloo Brain (context layer)","Independent data residency architecture","Auditability & traceability systems","Data normalization standards","Continuous improvement feedback loop","Cost analytics"],
    notThis: "A data pipeline engineer who moves records from A to B. A DBA. A passive infrastructure maintainer who never sits with the customer.",
    flourishing: "You will build systems that reduce the manual cognitive load on ministry leaders — freeing them to spend time with people instead of screens. Build it like it matters, because it does.",
  },
  product: {
    purpose: "Execution is no longer the bottleneck. In an agentic organization, agents can build faster than most teams can define what to build. That makes product judgment the rarest and most expensive resource in the system. Product exists to ensure we are building the right things, for the right customers, in the right order.",
    activities: ["Forward-deploy as your primary research method — no roadmap item gets prioritized that you haven't seen a customer actually struggle with","Define outcomes, not features — precise outcome statements that engineering and design can execute against without ambiguity","Prioritize ruthlessly and say no decisively — protect the roadmap from bloat, the team from distraction, the platform from fragmentation","Design rapid experiments to validate assumptions before committing engineering capacity","Sequence the roadmap across layers — understand dependencies between application, shared solutions, and infrastructure"],
    outputs: ["Prioritized roadmap","Outcome statements","Experiment designs","Forward-deployment intelligence","Layer dependency maps"],
    notThis: "A backlog administrator. A requirements writer. A coordination layer. Someone who prioritizes based on what customers say rather than what you've seen them struggle with.",
    flourishing: "Velocity is not inherently good. Building the wrong thing faster is just a more expensive mistake. Product clarity is how we honor the time of the humans on the other end.",
  },
};

/* ─────────────────────────────────────────────
   INITIAL DATA
───────────────────────────────────────────── */
const initData = {
  layers: [
    { id: "product",          label: "Product",                    sublabel: "Outcomes · Roadmap · Forward-Deployed Research",                          lead: { name: "TBD",               role: "Outcome Product Lead" },           color: "#2a1a3a", accent: "#f472b6" },
    { id: "dataAnalytics",    label: "Data & Analytics",           sublabel: "Reporting · BI · Insights · Data Products",                                lead: { name: "TBD",               role: "Data & Analytics Lead" },          color: "#1a2a3a", accent: "#60a5fa" },
    { id: "enterpriseSys",    label: "Enterprise Systems",         sublabel: "ERP · HRIS · Finance Systems · Internal Tools",                            lead: { name: "TBD",               role: "Enterprise Systems Lead" },        color: "#1a1a2e", accent: "#a78bfa" },
    { id: "coreInfra",        label: "Core Infrastructure",        sublabel: "Cloud · DevOps · Networking · Platform Reliability",                       lead: { name: "TBD",               role: "Core Infrastructure Lead" },       color: "#0e1e1a", accent: "#34d399" },
    { id: "security",         label: "Security",                   sublabel: "AppSec · Compliance · Risk · Access Control",                               lead: { name: "TBD",               role: "Security Lead" },                  color: "#1e1000", accent: "#fb923c" },
    { id: "helpDesk",         label: "Help Desk",                  sublabel: "Support · Ticketing · Escalation · End User Services",                     lead: { name: "TBD",               role: "Help Desk Lead" },                 color: "#101520", accent: "#94a3b8" },
    { id: "design",           label: "Design",                     sublabel: "Experience Systems · Design System · Forward-Deployed Research",           lead: { name: "Matthew Slaughter", role: "Head of Design" },                 color: "#1a2a3a", accent: "#f97316" },
    { id: "appEng",           label: "Application Layer Engineer", sublabel: "Platform Architecture · Unified Surface · Role-Configured Interfaces",     lead: { name: "Darren",            role: "Application Layer Lead" },         color: "#1a3a5c", accent: "#4a9eff" },
    { id: "platformEng",      label: "Platform Solution Engineer", sublabel: "Forward Deployment · Customer Config · Agent Deployment · Adoption",       lead: { name: "Darren",            role: "Application Layer Lead" },         color: "#0f2a4a", accent: "#38bdf8" },
    { id: "services",         label: "Shared Solutions",           sublabel: "Agent Orchestration · Skills · Integrations · Trust Fabric",               lead: { name: "Brian Johnson",     role: "Platform Services Lead" },         color: "#1a3d2e", accent: "#3ecf8e" },
    { id: "infra",            label: "Infrastructure & Data",      sublabel: "Gloo Brain · Data Normalization · Auditability · Continuous Improvement",  lead: { name: "Daniel Wilson",     role: "Head of AI Engineering" },         color: "#3a1a3a", accent: "#c084fc" },
  ],
  products: [
    { id: "church", name: "Church", type: "church", productLead: "TBD", cells: {
        product:      ["Outcome Product Lead"],
        design:       ["Experience Systems Designer"],
        appEng:       ["Application Layer Engineer 1","Application Layer Engineer 2"],
        platformEng:  ["Platform Solution Engineer 1","Platform Solution Engineer 2","Platform Solution Engineer 3"],
        services:     ["Shared Solutions Engineer 1","Shared Solutions Engineer 2"],
        infra:        ["Infra & Data Engineer 1","Infra & Data Engineer 2","Infra & Data Engineer 3"],
        dataAnalytics:   ["Data Analyst 1"],
        enterpriseSys:   ["Enterprise Systems Engineer 1"],
        coreInfra:       ["Core Infra Engineer 1"],
        security:        ["Security Engineer 1"],
        helpDesk:        ["Help Desk Specialist 1"],
      }
    },
    { id: "ag",   name: "AG",   type: "360", productLead: "TBD", cells: {
        product:      ["Outcome Product Lead"],
        design:       ["Experience Systems Designer"],
        appEng:       ["Application Layer Engineer 1"],
        platformEng:  ["Platform Solution Engineer 4","Platform Solution Engineer 5"],
        services:     ["Shared Solutions Engineer 1","Shared Solutions Engineer 2"],
        infra:        ["Infra & Data Engineer 1"],
        dataAnalytics:   ["Data Analyst 1"],
        enterpriseSys:   ["Enterprise Systems Engineer 1"],
        coreInfra:       ["Core Infra Engineer 1"],
        security:        ["Security Engineer 1"],
        helpDesk:        ["Help Desk Specialist 1"],
      }
    },
    { id: "ivy",  name: "Ivy",  type: "360", productLead: "TBD", cells: {
        product:      ["Outcome Product Lead"],
        design:       ["Experience Systems Designer"],
        appEng:       ["Application Layer Engineer 1"],
        platformEng:  ["Platform Solution Engineer 6","Platform Solution Engineer 7"],
        services:     ["Shared Solutions Engineer 1"],
        infra:        ["Infra & Data Engineer 1"],
        dataAnalytics:   ["Data Analyst 1"],
        enterpriseSys:   ["Enterprise Systems Engineer 1"],
        coreInfra:       ["Core Infra Engineer 1"],
        security:        ["Security Engineer 1"],
        helpDesk:        ["Help Desk Specialist 1"],
      }
    },
    { id: "tyro", name: "Tyro", type: "360", productLead: "TBD", cells: {
        product:      ["Outcome Product Lead"],
        design:       ["Experience Systems Designer"],
        appEng:       ["Application Layer Engineer 1"],
        platformEng:  ["Platform Solution Engineer 8"],
        services:     ["Shared Solutions Engineer 1"],
        infra:        ["Infra & Data Engineer 1"],
        dataAnalytics:   ["Data Analyst 1"],
        enterpriseSys:   ["Enterprise Systems Engineer 1"],
        coreInfra:       ["Core Infra Engineer 1"],
        security:        ["Security Engineer 1"],
        helpDesk:        ["Help Desk Specialist 1"],
      }
    },
  ],
  innovation: ["Casey", "Matt Michel"],
  innovationLead: "Matt & Kasey",
  executives: [
    { id: "exec1", name: "TBD", role: "IT & Operations Leader", color: "#1a2030", accent: "#60a5fa", layers: ["dataAnalytics","enterpriseSys","coreInfra","security","helpDesk"] },
    { id: "exec2", name: "TBD", role: "Platform & Product Leader", color: "#0f1a10", accent: "#3ecf8e", layers: ["design","appEng","platformEng","services","infra"] },
  ],
};

const typeColors = {
  church: { bg: "#0c1c2e", badge: "#4a9eff", badgeText: "Church" },
  "360":  { bg: "#141200", badge: "#facc15", badgeText: "360°"   },
  gloo:   { bg: "#0e1a10", badge: "#3ecf8e", badgeText: "Gloo"   },
};

function uid() { return Math.random().toString(36).slice(2, 8); }

/* ── Editable plain text ── */
function ET({ value, onChange, style }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef(null);
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

/* ── Editable chip ── */
function Chip({ name, accent, onChange, onDelete, onJD }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(name);
  const ref = useRef(null);
  useEffect(() => { if (editing && ref.current) ref.current.focus(); }, [editing]);
  const commit = () => { setEditing(false); if(draft.trim()&&draft.trim()!==name) onChange(draft.trim()); else setDraft(name); };
  const initials = name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  return (
    <div style={{ display:"inline-flex", alignItems:"center", gap:"4px", background:accent+"14", border:"1px solid "+accent+"30", borderRadius:"6px", padding:"4px 8px 4px 9px", marginBottom:"5px", marginRight:"4px", position:"relative" }}
      onMouseEnter={e=>{ e.currentTarget.querySelectorAll(".chip-ctrl").forEach(b=>b.style.opacity="1"); }}
      onMouseLeave={e=>{ e.currentTarget.querySelectorAll(".chip-ctrl").forEach(b=>b.style.opacity="0"); }}
    >
      <div style={{ width:"18px", height:"18px", borderRadius:"50%", background:accent+"30", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"8px", color:accent, fontWeight:"700", flexShrink:0 }}>{initials}</div>
      {editing
        ? <input ref={ref} value={draft} onChange={e=>setDraft(e.target.value)} onBlur={commit}
            onKeyDown={e=>{if(e.key==="Enter")commit();if(e.key==="Escape"){setDraft(name);setEditing(false);}}}
            style={{ background:"transparent", border:"none", borderBottom:"1px solid "+accent, color:"#f1f5f9", fontSize:"11px", fontFamily:"inherit", width:Math.max(60,draft.length*7)+"px", outline:"none", padding:"0" }} />
        : <span onClick={e=>{e.stopPropagation();setEditing(true);}} title="Click to rename"
            style={{ fontSize:"11px", color:"#f1f5f9", whiteSpace:"nowrap", cursor:"text", borderBottom:"1px dashed rgba(255,255,255,0.3)" }}>{name}</span>
      }
      {/* JD button */}
      {onJD && (
        <button className="chip-ctrl" onClick={e=>{e.stopPropagation();onJD();}}
          style={{ opacity:0, background:accent+"22", border:"1px solid "+accent+"44", borderRadius:"4px", color:accent, cursor:"pointer", fontSize:"8px", fontFamily:"Courier New, monospace", letterSpacing:"0.5px", padding:"1px 5px", lineHeight:"14px", transition:"opacity 0.15s, background 0.15s", whiteSpace:"nowrap" }}
          onMouseEnter={e=>{e.currentTarget.style.background=accent+"44";}}
          onMouseLeave={e=>{e.currentTarget.style.background=accent+"22";}}
          title="View job description">JD</button>
      )}
      {/* delete button */}
      <button className="chip-ctrl x" onClick={e=>{e.stopPropagation();onDelete();}}
        style={{ opacity:0, background:"none", border:"none", color:accent, cursor:"pointer", fontSize:"12px", padding:"0 0 0 1px", lineHeight:1, transition:"opacity 0.15s" }}>×</button>
    </div>
  );
}

/* ── JD Modal ── */
function JDModal({ layerId, layer, onClose }) {
  const jd = JDS[layerId];
  if (!jd) return null;
  const accent = layer.accent;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2000, padding:"20px" }}
      onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}
    >
      <div style={{ background:"#0b1320", border:"1px solid "+accent+"44", borderRadius:"16px", maxWidth:"760px", width:"100%", maxHeight:"85vh", overflow:"hidden", display:"flex", flexDirection:"column" }}>
        {/* header */}
        <div style={{ padding:"20px 24px 16px", borderBottom:"1px solid "+accent+"22", display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"16px", flexShrink:0 }}>
          <div>
            <div style={{ fontSize:"9px", letterSpacing:"3px", color:accent, fontFamily:"Courier New, monospace", marginBottom:"4px", textTransform:"uppercase" }}>{layer.label}</div>
            <div style={{ fontSize:"20px", fontWeight:"700", color:"#f1f5f9", marginBottom:"4px" }}>{jd.title}</div>
            <div style={{ fontSize:"11px", color:"#64748b" }}>Reports to: <span style={{ color:"#94a3b8" }}>{jd.reports}</span></div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#475569", cursor:"pointer", fontSize:"20px", lineHeight:1, padding:"2px", flexShrink:0 }}>×</button>
        </div>
        {/* body scrollable */}
        <div style={{ overflowY:"auto", padding:"20px 24px", display:"flex", flexDirection:"column", gap:"20px" }}>
          {/* what this layer does */}
          <div>
            <div style={{ fontSize:"9px", letterSpacing:"3px", color:accent, fontFamily:"Courier New, monospace", marginBottom:"10px", textTransform:"uppercase" }}>What This Role Does</div>
            <p style={{ margin:0, fontSize:"12px", color:"#cbd5e1", lineHeight:"1.7" }}>{jd.what}</p>
          </div>
          {/* responsibilities */}
          <div>
            <div style={{ fontSize:"9px", letterSpacing:"3px", color:accent, fontFamily:"Courier New, monospace", marginBottom:"10px", textTransform:"uppercase" }}>What You'll Do</div>
            {jd.responsibilities.map((r,i)=>(
              <div key={i} style={{ display:"flex", gap:"10px", marginBottom:"10px" }}>
                <span style={{ color:accent, flexShrink:0, marginTop:"3px", fontSize:"10px" }}>▸</span>
                <span style={{ fontSize:"12px", color:"#cbd5e1", lineHeight:"1.6" }}>{r}</span>
              </div>
            ))}
          </div>
          {/* two-col: looking for + success */}
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
          {/* not this */}
          <div style={{ background:"#1a0a0a", border:"1px solid #ef444433", borderRadius:"8px", padding:"12px 16px" }}>
            <div style={{ fontSize:"9px", letterSpacing:"3px", color:"#ef4444", fontFamily:"Courier New, monospace", marginBottom:"8px", textTransform:"uppercase" }}>What This Role Is Not</div>
            <p style={{ margin:0, fontSize:"11px", color:"#94a3b8", lineHeight:"1.6", fontStyle:"italic" }}>{jd.notThis}</p>
          </div>
          {/* flourishing */}
          <div style={{ background:accent+"0a", border:"1px solid "+accent+"22", borderRadius:"8px", padding:"12px 16px" }}>
            <div style={{ fontSize:"9px", letterSpacing:"3px", color:accent, fontFamily:"Courier New, monospace", marginBottom:"8px", textTransform:"uppercase" }}>On Human Flourishing</div>
            <p style={{ margin:0, fontSize:"11px", color:"#94a3b8", lineHeight:"1.6" }}>{jd.flourishing}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Add-column modal ── */
function AddColModal({ onAdd, onClose }) {
  const [name, setName] = useState("New Product");
  const [type, setType] = useState("church");
  const [lead, setLead] = useState("TBD");
  const ref = useRef(null);
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
function AddRowModal({ onAdd, onClose }) {
  const [label,    setLabel]    = useState("New Layer");
  const [sublabel, setSublabel] = useState("Description");
  const [leadName, setLeadName] = useState("TBD");
  const [leadRole, setLeadRole] = useState("Layer Lead");
  const [accent,   setAccent]   = useState(ACCENT_OPTIONS[4]);
  const [color,    setColor]    = useState(COLOR_OPTIONS[4]);
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.focus(); }, []);
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}>
      <div style={{ background:"#0f1a24", border:"1px solid #1e293b", borderRadius:"14px", padding:"24px", minWidth:"300px" }}>
        <div style={{ fontSize:"13px", fontWeight:"700", color:"#e2e8f0", marginBottom:"16px" }}>Add Row</div>
        {[["Layer Name",label,setLabel,ref],["Description",sublabel,setSublabel,null],["Lead Name",leadName,setLeadName,null],["Lead Role",leadRole,setLeadRole,null]].map(([lbl,val,set,r])=>(
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
function AssignRowsModal({ exec, layers, onSave, onClose }) {
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
            <div key={layer.id}
              onClick={()=>toggle(layer.id)}
              style={{ display:"flex", alignItems:"center", gap:"10px", padding:"8px 12px", borderRadius:"8px", cursor:"pointer",
                background: selected.has(layer.id) ? layer.accent+"15" : "#0b1320",
                border: "1px solid " + (selected.has(layer.id) ? layer.accent+"44" : "#1e293b"),
                transition:"all 0.15s" }}>
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
function LayerView({ layers }) {
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

/* ── Agentic OS View ── */
function AgenticOSView() {
  const [activeRole, setActiveRole] = useState(null);

  const signal = {
    label: "The Honest Signal",
    description: "Block's edge is transaction data — both sides of millions of daily transactions. Gloo's equivalent is ministry intelligence: engagement patterns, pastoral care touchpoints, giving behavior, discipleship journeys, staff workflows. Every interaction a church has through the platform becomes signal. The signal compounds. The model gets smarter. The smarter the model, the more valuable the platform. The more valuable the platform, the more churches use it. The more churches use it, the richer the signal.",
    items: [
      { label: "Member engagement & attendance patterns", icon: "📊" },
      { label: "Giving behavior & stewardship trends", icon: "💛" },
      { label: "Pastoral care touchpoints & response rhythms", icon: "🤝" },
      { label: "Staff workflow patterns & friction points", icon: "⚙️" },
      { label: "Discipleship journey progression", icon: "🌱" },
      { label: "Cross-org patterns across church network", icon: "🔗" },
    ],
  };

  const fourThings = [
    {
      id: "capabilities",
      number: "01",
      label: "Capabilities",
      gloo: "Agents · Skills · Integrations · Trust Fabric",
      color: "#c084fc",
      bg: "#1a0a2a",
      blockDef: "Atomic primitives — hard to acquire, hard to maintain. No UIs of their own. Reliability, compliance, and performance targets.",
      glooMap: "The shared solutions layer. Rock RMS integration, Microsoft connector, expense automation skill, sermon content pipeline, trust fabric policy engine. Built once at the capability layer. Available to every customer. These are not products — they are building blocks.",
      owner: "Brian Johnson",
      ownerRole: "Platform Services Lead",
    },
    {
      id: "worldmodel",
      number: "02",
      label: "World Model",
      gloo: "Gloo Brain · Data Normalization · Church Intelligence",
      color: "#3ecf8e",
      bg: "#0a1a14",
      blockDef: "Two sides: a company world model (how the org understands itself) and a customer world model (per-customer representation built from proprietary signal). Replaces the information that used to flow through layers of management.",
      glooMap: "The Gloo Brain. Infrastructure & Data layer. Knows each church's org chart, their Rock RMS configuration, their staff relationships, their communication patterns, their historical data. Starts with what churches upload. Compounds with every agent action. Every Platform Solution Engineer deployment makes the brain smarter for the next church.",
      owner: "Daniel Wilson",
      ownerRole: "Head of AI Engineering",
    },
    {
      id: "intelligence",
      number: "03",
      label: "Intelligence Layer",
      gloo: "Orchestration · Composition · Proactive Delivery",
      color: "#f97316",
      bg: "#1a0f00",
      blockDef: "Composes capabilities into solutions for specific customers at specific moments. Proactively delivers them. No product manager decides what to build — the intelligence layer recognizes the moment and composes the solution. When it can't compose because the capability doesn't exist, that failure signal is the future roadmap.",
      glooMap: "The agent orchestration layer. A church's giving is down three weeks running before a capital campaign — the intelligence layer composes an engagement analysis, flags the pattern for the pastor, and drafts a communication sequence. A staff member uploads a sermon draft — the intelligence layer composes a devotional series, social content, and a six-week drip campaign. No one asked for it. The model recognized the moment.",
      owner: "Brian Johnson",
      ownerRole: "Platform Services Lead",
    },
    {
      id: "interfaces",
      number: "04",
      label: "Interfaces",
      gloo: "Ministry Chat · Polymer · Role-Configured Surfaces",
      color: "#4a9eff",
      bg: "#0a1020",
      blockDef: "Delivery surfaces through which the intelligence layer delivers composed solutions. Important, but not where the value is created. The value is in the model and the intelligence.",
      glooMap: "Ministry Chat and Polymer unified. The lead pastor logs in and sees their church. The children's ministry director logs in and sees theirs. The 360° client's staff logs into a white-labeled surface that feels built for their org. The interface is not the product. It is the window into the intelligence. Application Layer Engineers own the platform. Platform Solution Engineers configure it per customer.",
      owner: "Darren",
      ownerRole: "Application Layer Lead",
    },
  ];

  const roles = [
    {
      id: "ic",
      label: "Individual Contributor",
      abbr: "IC",
      color: "#4a9eff",
      blockDef: "Deep specialists who build and operate capabilities, the model, the intelligence layer, and the interfaces. The world model provides the context a manager used to provide — ICs make decisions about their layer without waiting to be told.",
      glooMap: "Application Layer Engineers, Shared Solutions Engineers, Infrastructure & Data Engineers, Experience Systems Designers. Experts in a specific layer. The Gloo Brain gives them the organizational context that used to require a manager. They act without waiting for direction up the chain.",
      examples: ["Application Layer Engineer", "Shared Solutions Engineer", "Infra & Data Engineer", "Experience Systems Designer"],
    },
    {
      id: "dri",
      label: "Directly Responsible Individual",
      abbr: "DRI",
      color: "#f472b6",
      blockDef: "Own specific cross-cutting problems or customer outcomes. May own a problem for 90 days with full authority to pull resources from any team. DRIs persist on certain problems or move elsewhere to solve new ones. Not permanent — they are attached to outcomes, not headcount.",
      glooMap: "Outcome Product Leads. Platform Solution Engineers on specific deployments. Innovation team members on bleeding-edge problems. A DRI might own 'Church of the Resurrection deployment' for 90 days with authority to pull from Application, Shared Solutions, and Infra. When it's stable, they move. The DRI structure handles strategy and priority — the world model handles alignment.",
      examples: ["Outcome Product Lead", "Platform Solution Engineer", "Innovation Lead (Casey / Matt)"],
    },
    {
      id: "pc",
      label: "Player-Coach",
      abbr: "PC",
      color: "#3ecf8e",
      blockDef: "Combine building with developing people. Replace the traditional manager whose primary job was information routing. Still write code, build models, design interfaces. Also invest in people around them. Don't spend days in status meetings — the world model handles alignment, the DRI handles priority.",
      glooMap: "Layer leads: Daniel Wilson, Brian Johnson, Darren, Matthew Slaughter. They still build. Daniel still architects the Gloo Brain. Brian still defines skills and integrations. But they also define how things get built at their layer, hold the org to it, and develop the people doing it. There is no permanent middle management layer above them. The Gloo Brain is the middle management.",
      examples: ["Daniel Wilson — Infra & Data", "Brian Johnson — Shared Solutions", "Darren — Application Layer", "Matthew Slaughter — Design"],
    },
  ];

  const accent = "#e2e8f0";

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"32px" }}>

      {/* intro */}
      <div style={{ background:"#0b1320", border:"1px solid #1e293b", borderRadius:"14px", padding:"24px 28px" }}>
        <div style={{ fontSize:"9px", letterSpacing:"4px", color:"#475569", fontFamily:"Courier New, monospace", marginBottom:"10px", textTransform:"uppercase" }}>Framework · Block / Sequoia 2026</div>
        <h2 style={{ fontSize:"20px", fontWeight:"700", color:"#f1f5f9", margin:"0 0 12px" }}>From Hierarchy to Intelligence</h2>
        <p style={{ fontSize:"13px", color:"#94a3b8", lineHeight:"1.8", margin:"0 0 12px", maxWidth:"800px" }}>
          Two thousand years of org design solved one problem: how to route information through humans. Every layer of hierarchy exists because a leader can only manage 3–8 people, and someone above them needs to know what's happening. The Romans figured this out. McKinsey packaged it. Every org chart since is a variation on the same protocol.
        </p>
        <p style={{ fontSize:"13px", color:"#94a3b8", lineHeight:"1.8", margin:"0 0 12px", maxWidth:"800px" }}>
          Block's bet — and ours — is that AI is the first technology capable of actually performing the coordination functions that hierarchy exists to provide. Not copilots that make the existing structure work slightly better. A company organized as an intelligence.
        </p>
        <p style={{ fontSize:"13px", color:"#e2e8f0", lineHeight:"1.8", margin:0, maxWidth:"800px", fontStyle:"italic" }}>
          "What does your company understand that is genuinely hard to understand, and is that understanding getting deeper every day?"
        </p>
      </div>

      {/* honest signal */}
      <div style={{ background:"#0a1a14", border:"1px solid #3ecf8e33", borderRadius:"14px", overflow:"hidden" }}>
        <div style={{ display:"flex", borderBottom:"1px solid #3ecf8e22" }}>
          <div style={{ width:"4px", background:"#3ecf8e", flexShrink:0 }} />
          <div style={{ padding:"16px 20px", flex:1 }}>
            <div style={{ fontSize:"9px", letterSpacing:"3px", color:"#3ecf8e", fontFamily:"Courier New, monospace", marginBottom:"6px", textTransform:"uppercase" }}>The Compounding Advantage</div>
            <div style={{ fontSize:"16px", fontWeight:"700", color:"#f1f5f9", marginBottom:"8px" }}>{signal.label}</div>
            <p style={{ margin:0, fontSize:"12px", color:"#94a3b8", lineHeight:"1.7", maxWidth:"760px" }}>{signal.description}</p>
          </div>
        </div>
        <div style={{ padding:"16px 20px", display:"flex", flexWrap:"wrap", gap:"10px" }}>
          {signal.items.map((item,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:"8px", background:"#3ecf8e0d", border:"1px solid #3ecf8e22", borderRadius:"8px", padding:"8px 14px" }}>
              <span style={{ fontSize:"14px" }}>{item.icon}</span>
              <span style={{ fontSize:"11px", color:"#cbd5e1" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* four things */}
      <div>
        <div style={{ fontSize:"9px", letterSpacing:"4px", color:"#475569", fontFamily:"Courier New, monospace", marginBottom:"14px", textTransform:"uppercase" }}>The Four Things We Build</div>
        <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
          {fourThings.map(t=>(
            <div key={t.id} style={{ borderRadius:"12px", border:"1px solid "+t.color+"33", background:t.bg, overflow:"hidden" }}>
              <div style={{ display:"flex", flexWrap:"wrap" }}>
                {/* number + label */}
                <div style={{ width:"200px", padding:"18px 20px", borderRight:"1px solid "+t.color+"20", flexShrink:0 }}>
                  <div style={{ fontSize:"28px", fontWeight:"700", color:t.color+"44", fontFamily:"Courier New, monospace", lineHeight:1, marginBottom:"4px" }}>{t.number}</div>
                  <div style={{ fontSize:"14px", fontWeight:"700", color:"#f1f5f9", marginBottom:"4px" }}>{t.label}</div>
                  <div style={{ fontSize:"9px", color:t.color, fontFamily:"Courier New, monospace", letterSpacing:"1px" }}>{t.gloo}</div>
                  <div style={{ marginTop:"12px", padding:"6px 10px", background:"#080e14", border:"1px solid "+t.color+"33", borderRadius:"7px" }}>
                    <div style={{ fontSize:"11px", fontWeight:"700", color:t.color }}>{t.owner}</div>
                    <div style={{ fontSize:"9px", color:"#64748b" }}>{t.ownerRole}</div>
                  </div>
                </div>
                {/* block definition */}
                <div style={{ flex:"1 1 240px", padding:"18px 20px", borderRight:"1px solid "+t.color+"20" }}>
                  <div style={{ fontSize:"9px", letterSpacing:"2px", color:t.color, fontFamily:"Courier New, monospace", marginBottom:"8px", textTransform:"uppercase" }}>Block's Definition</div>
                  <p style={{ margin:0, fontSize:"12px", color:"#94a3b8", lineHeight:"1.65" }}>{t.blockDef}</p>
                </div>
                {/* gloo map */}
                <div style={{ flex:"1 1 240px", padding:"18px 20px" }}>
                  <div style={{ fontSize:"9px", letterSpacing:"2px", color:t.color, fontFamily:"Courier New, monospace", marginBottom:"8px", textTransform:"uppercase" }}>Gloo's Version</div>
                  <p style={{ margin:0, fontSize:"12px", color:"#cbd5e1", lineHeight:"1.65" }}>{t.glooMap}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* three roles */}
      <div>
        <div style={{ fontSize:"9px", letterSpacing:"4px", color:"#475569", fontFamily:"Courier New, monospace", marginBottom:"14px", textTransform:"uppercase" }}>Three Roles · No Permanent Middle Management</div>
        <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
          {roles.map(r=>(
            <div key={r.id}
              onClick={()=>setActiveRole(activeRole===r.id ? null : r.id)}
              style={{ flex:"1 1 260px", borderRadius:"12px", border:"1px solid "+r.color+(activeRole===r.id?"88":"33"), background: activeRole===r.id ? r.color+"0f" : "#0b1320", cursor:"pointer", overflow:"hidden", transition:"all 0.2s" }}>
              {/* header */}
              <div style={{ padding:"16px 18px", borderBottom:"1px solid "+r.color+"22" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"8px" }}>
                  <div style={{ width:"32px", height:"32px", borderRadius:"8px", background:r.color+"22", border:"1px solid "+r.color+"44", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"11px", fontWeight:"700", color:r.color, fontFamily:"Courier New, monospace" }}>{r.abbr}</div>
                  <div style={{ fontSize:"13px", fontWeight:"700", color:"#f1f5f9" }}>{r.label}</div>
                </div>
                <p style={{ margin:0, fontSize:"11px", color:"#94a3b8", lineHeight:"1.6" }}>{r.blockDef}</p>
              </div>
              {/* gloo map — visible when active */}
              {activeRole===r.id && (
                <div style={{ padding:"16px 18px" }}>
                  <div style={{ fontSize:"9px", letterSpacing:"2px", color:r.color, fontFamily:"Courier New, monospace", marginBottom:"8px", textTransform:"uppercase" }}>At Gloo</div>
                  <p style={{ margin:"0 0 12px", fontSize:"12px", color:"#cbd5e1", lineHeight:"1.65" }}>{r.glooMap}</p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
                    {r.examples.map((ex,i)=>(
                      <div key={i} style={{ background:r.color+"14", border:"1px solid "+r.color+"30", borderRadius:"5px", padding:"3px 9px", fontSize:"10px", color:r.color }}>{ex}</div>
                    ))}
                  </div>
                </div>
              )}
              {activeRole!==r.id && (
                <div style={{ padding:"10px 18px 14px" }}>
                  <div style={{ fontSize:"9px", color:r.color+"60", fontFamily:"Courier New, monospace" }}>Click to see Gloo's version →</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* the edge */}
      <div style={{ background:"#0b1320", border:"1px solid #1e293b", borderRadius:"14px", padding:"22px 28px" }}>
        <div style={{ fontSize:"9px", letterSpacing:"3px", color:"#38bdf8", fontFamily:"Courier New, monospace", marginBottom:"10px", textTransform:"uppercase" }}>The Edge · Where Intelligence Meets Reality</div>
        <h3 style={{ fontSize:"16px", fontWeight:"700", color:"#f1f5f9", margin:"0 0 12px" }}>Platform Solution Engineers are the edge.</h3>
        <p style={{ fontSize:"12px", color:"#94a3b8", lineHeight:"1.75", margin:"0 0 12px", maxWidth:"800px" }}>
          Block writes: "The edge is where the intelligence makes contact with reality. People reach into places the model can't go yet. They sense things the model can't perceive: intuition, opinionated direction, cultural context, trust dynamics, the feeling in a room."
        </p>
        <p style={{ fontSize:"12px", color:"#cbd5e1", lineHeight:"1.75", margin:"0 0 16px", maxWidth:"800px" }}>
          For Gloo, that's a Platform Solution Engineer sitting in the room with a church's IT director, understanding how their staff actually communicates, how their Rock RMS is actually configured, what the lead pastor's real anxiety is about AI. The model can't perceive that yet. The PSE can. And every deployment they make — every agent they configure, every workflow they build — comes back into the Gloo Brain. The edge feeds the model. The model sharpens the edge. That loop is the compounding advantage.
        </p>
        <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
          {["PSE goes on-site → observes real friction","Configures platform for that church","Agents run → data returns to Gloo Brain","Brain gets smarter for next church","Next PSE deploys faster with better model","Repeat"].map((step,i,arr)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:"8px" }}>
              <div style={{ background:"#38bdf822", border:"1px solid #38bdf833", borderRadius:"7px", padding:"6px 12px", fontSize:"11px", color:"#38bdf8" }}>{step}</div>
              {i < arr.length-1 && <span style={{ color:"#334155", fontSize:"14px" }}>→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* closing principle */}
      <div style={{ background:"#070d14", border:"1px solid #1e293b", borderRadius:"14px", padding:"22px 28px", borderStyle:"dashed" }}>
        <div style={{ fontSize:"9px", letterSpacing:"3px", color:"#475569", fontFamily:"Courier New, monospace", marginBottom:"12px", textTransform:"uppercase" }}>The Test · Block's Question Applied to Gloo</div>
        <p style={{ fontSize:"15px", color:"#f1f5f9", lineHeight:"1.7", margin:"0 0 16px", fontStyle:"italic", maxWidth:"780px" }}>
          "What does your company understand that is genuinely hard to understand, and is that understanding getting deeper every day?"
        </p>
        <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 280px", background:"#0b1320", border:"1px solid #ef444433", borderRadius:"10px", padding:"14px 16px" }}>
            <div style={{ fontSize:"9px", letterSpacing:"2px", color:"#ef4444", fontFamily:"Courier New, monospace", marginBottom:"8px" }}>IF THE ANSWER IS NOTHING</div>
            <p style={{ margin:0, fontSize:"12px", color:"#94a3b8", lineHeight:"1.6" }}>AI is just a cost optimization story. We cut headcount, improve margins for a few quarters, and get absorbed by something smarter. Claude Cowork wins. Every secular platform wins. We were just faster to ship a chatbot.</p>
          </div>
          <div style={{ flex:"1 1 280px", background:"#0b1320", border:"1px solid #3ecf8e33", borderRadius:"10px", padding:"14px 16px" }}>
            <div style={{ fontSize:"9px", letterSpacing:"2px", color:"#3ecf8e", fontFamily:"Courier New, monospace", marginBottom:"8px" }}>IF THE ANSWER IS DEEP</div>
            <p style={{ margin:0, fontSize:"12px", color:"#cbd5e1", lineHeight:"1.6" }}>We understand how ministry organizations actually function — their rhythms, their relationships, their decision-making, their data — and that understanding gets deeper every day a church uses the platform. AI doesn't augment Gloo. It reveals what Gloo actually is.</p>
          </div>
        </div>
        <p style={{ margin:"16px 0 0", fontSize:"12px", color:"#4a9eff", lineHeight:"1.6", fontWeight:"600" }}>
          Our answer: the ministry intelligence graph. The operational patterns, care rhythms, and relational data of the churches and nonprofits we serve — understood at depth, compounding daily, available to no one else. That is the moat. Build the platform like it is.
        </p>
      </div>
    </div>
  );
}
export default function MatrixOrg() {
  const [org,        setOrg]        = useState(initData);
  const [saved,      setSaved]      = useState(false);
  const [loaded,     setLoaded]     = useState(false);

  // Load from storage on mount
  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get("gloo-matrix-org");
        if (result && result.value) {
          setOrg(JSON.parse(result.value));
        }
      } catch (e) {
        // no saved data yet, use initData
      }
      setLoaded(true);
    })();
  }, []);

  // Auto-save whenever org changes (after initial load)
  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        await window.storage.set("gloo-matrix-org", JSON.stringify(org));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (e) {
        // storage error
      }
    })();
  }, [org, loaded]);
  const [showAddCol, setShowAddCol] = useState(false);
  const [showAddRow, setShowAddRow] = useState(false);
  const [view,       setView]       = useState("people");
  const [jdOpen,     setJdOpen]     = useState(null); // { layerId, layer }
  const [collapsedExecs, setCollapsedExecs] = useState(new Set());
  const toggleCollapse = (id) => setCollapsedExecs(s => { const n = new Set(s); if(n.has(id)) n.delete(id); else n.add(id); return n; });
  const [assignOpen, setAssignOpen] = useState(null); // exec object

  const updateLayerLead    = (id,v) => setOrg(o=>({...o,layers:o.layers.map(l=>l.id===id?{...l,lead:{...l.lead,name:v}}:l)}));
  const addLayer           = (layer) => { const id=uid(); setOrg(o=>({...o,layers:[...o.layers,{...layer,id}]})); setShowAddRow(false); };
  const removeLayer        = (id)    => setOrg(o=>({...o,layers:o.layers.filter(l=>l.id!==id)}));
  const moveLayer          = (id,dir)=> setOrg(o=>{ const arr=[...o.layers]; const i=arr.findIndex(l=>l.id===id); const j=i+dir; if(j<0||j>=arr.length)return o; [arr[i],arr[j]]=[arr[j],arr[i]]; return{...o,layers:arr}; });

  const updateProductName  = (id,v) => setOrg(o=>({...o,products:o.products.map(p=>p.id===id?{...p,name:v}:p)}));
  const updateProductLead  = (id,v) => setOrg(o=>({...o,products:o.products.map(p=>p.id===id?{...p,productLead:v}:p)}));
  const addProduct         = ({name,type,productLead}) => { const id=uid(); const cells={}; org.layers.forEach(l=>{cells[l.id]=[];}); setOrg(o=>({...o,products:[...o.products,{id,name,type,productLead,cells}]})); setShowAddCol(false); };
  const removeProduct      = (id)   => setOrg(o=>({...o,products:o.products.filter(p=>p.id!==id)}));
  const moveProduct        = (id,dir)=> setOrg(o=>{ const arr=[...o.products]; const i=arr.findIndex(p=>p.id===id); const j=i+dir; if(j<0||j>=arr.length)return o; [arr[i],arr[j]]=[arr[j],arr[i]]; return{...o,products:arr}; });

  const updateCellName     = (pId,lId,idx,v) => setOrg(o=>({...o,products:o.products.map(p=>{if(p.id!==pId)return p;const n=[...(p.cells[lId]||[])];n[idx]=v;return{...p,cells:{...p.cells,[lId]:n}};})}));
  const deleteCellName     = (pId,lId,idx)   => setOrg(o=>({...o,products:o.products.map(p=>{if(p.id!==pId)return p;const n=[...(p.cells[lId]||[])];n.splice(idx,1);return{...p,cells:{...p.cells,[lId]:n}};})}));
  const addCellName        = (pId,lId)       => setOrg(o=>({...o,products:o.products.map(p=>{if(p.id!==pId)return p;return{...p,cells:{...p.cells,[lId]:[...(p.cells[lId]||[]),"New Member"]}};})}));

  const updateInnovation     = (idx,v) => setOrg(o=>{const a=[...o.innovation];a[idx]=v;return{...o,innovation:a};});
  const updateInnovationLead = (v)     => setOrg(o=>({...o,innovationLead:v}));

  // Executive ops
  const addExecutive = () => {
    const newExec = { id:uid(), name:"New Leader", role:"Executive Role", color:"#1a2030", accent:"#60a5fa", layers:[] };
    setOrg(o=>({...o, executives:[...(o.executives||[]), newExec]}));
    setAssignOpen(newExec);
  };
  const removeExecutive = (id) => setOrg(o=>({...o, executives:(o.executives||[]).filter(e=>e.id!==id)}));
  const updateExecName = (id,v) => setOrg(o=>({...o, executives:(o.executives||[]).map(e=>e.id===id?{...e,name:v}:e)}));
  const updateExecRole = (id,v) => setOrg(o=>({...o, executives:(o.executives||[]).map(e=>e.id===id?{...e,role:v}:e)}));
  const updateExecLayers = (id,layers) => setOrg(o=>({...o, executives:(o.executives||[]).map(e=>e.id===id?{...e,layers}:e)}));

  const btnStyle = (accent="#4a9eff") => ({
    display:"inline-flex", alignItems:"center", gap:"5px",
    background:"transparent", border:"1px dashed "+accent+"55", borderRadius:"7px",
    color:accent+"99", cursor:"pointer", fontSize:"11px", padding:"5px 12px",
    fontFamily:"Courier New, monospace", letterSpacing:"1px", transition:"all 0.15s",
  });

  return (
    <div style={{ fontFamily:"Georgia, Times New Roman, serif", background:"#070d14", minHeight:"100vh", color:"#e2e8f0", padding:"28px 20px" }}>

      {showAddCol && <AddColModal onAdd={addProduct} onClose={()=>setShowAddCol(false)} />}
      {showAddRow && <AddRowModal onAdd={addLayer}   onClose={()=>setShowAddRow(false)} />}
      {jdOpen     && <JDModal layerId={jdOpen.layerId} layer={jdOpen.layer} onClose={()=>setJdOpen(null)} />
      }
      {assignOpen && <AssignRowsModal exec={assignOpen} layers={org.layers} onSave={v=>updateExecLayers(assignOpen.id,v)} onClose={()=>setAssignOpen(null)} />}

      {/* hint */}
      <div style={{ textAlign:"center", marginBottom:"6px", display:"flex", alignItems:"center", justifyContent:"center", gap:"16px", flexWrap:"wrap" }}>
        <span style={{ fontSize:"10px", color:"#475569", fontFamily:"Courier New, monospace" }}>
          ✎ Click any name to rename · hover chips for JD button and × to remove · + to add a role
        </span>
        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          <span style={{ fontSize:"10px", fontFamily:"Courier New, monospace", color: saved ? "#3ecf8e" : "#334155", transition:"color 0.3s" }}>
            {saved ? "✓ saved" : "auto-saving"}
          </span>
          <button
            onClick={() => { navigator.clipboard.writeText(JSON.stringify(org, null, 2)).then(()=>alert("Copied! Paste it to Claude to hardcode permanently.")); }}
            style={{ fontSize:"9px", fontFamily:"Courier New, monospace", color:"#3ecf8e", background:"none", border:"1px solid #3ecf8e44", borderRadius:"4px", padding:"2px 8px", cursor:"pointer", letterSpacing:"1px" }}
            onMouseEnter={e=>e.currentTarget.style.borderColor="#3ecf8e"}
            onMouseLeave={e=>e.currentTarget.style.borderColor="#3ecf8e44"}
          >EXPORT</button>
          <button
            onClick={async () => { if (window.confirm("Reset to defaults? This will clear all edits.")) { await window.storage.delete("gloo-matrix-org"); setOrg(initData); } }}
            style={{ fontSize:"9px", fontFamily:"Courier New, monospace", color:"#475569", background:"none", border:"1px solid #1e293b", borderRadius:"4px", padding:"2px 8px", cursor:"pointer", letterSpacing:"1px" }}
            onMouseEnter={e=>e.currentTarget.style.color="#ef4444"}
            onMouseLeave={e=>e.currentTarget.style.color="#475569"}
          >RESET</button>
        </div>
      </div>

      {/* view toggle */}
      <div style={{ display:"flex", justifyContent:"center", marginBottom:"20px" }}>
        <div style={{ display:"flex", background:"#0b1320", border:"1px solid #1e293b", borderRadius:"8px", padding:"3px", gap:"3px" }}>
          {[["people","👥  People"],["layers","⚙️  How Layers Work"],["agenticOS","🧠  Agentic OS"]].map(([v,label])=>(
            <button key={v} onClick={()=>setView(v)}
              style={{ padding:"6px 18px", borderRadius:"6px", border:"none", cursor:"pointer", fontSize:"11px", fontFamily:"Courier New, monospace", letterSpacing:"1px", transition:"all 0.15s",
                background:view===v?"#1e3a5f":"transparent", color:view===v?"#4a9eff":"#475569", fontWeight:view===v?"700":"400" }}>{label}</button>
          ))}
        </div>
      </div>

      {/* header */}
      <div style={{ textAlign:"center", marginBottom:"24px" }}>
        <div style={{ fontSize:"10px", letterSpacing:"4px", color:"#475569", textTransform:"uppercase", marginBottom:"7px", fontFamily:"Courier New, monospace" }}>Gloo - Platform and Product Team</div>
        <h1 style={{ fontSize:"26px", fontWeight:"700", margin:"0 0 3px", color:"#e2e8f0" }}>Platform Matrix Org</h1>
        <p style={{ fontSize:"12px", color:"#475569", margin:0 }}>Q2 2026 - Draft pending Ben alignment</p>
      </div>

      {view==="layers" ? <LayerView layers={org.layers} /> : view==="agenticOS" ? <AgenticOSView /> : (<>

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
                    onMouseEnter={e=>e.currentTarget.querySelectorAll(".col-ctrl").forEach(b=>b.style.opacity="1")}
                    onMouseLeave={e=>e.currentTarget.querySelectorAll(".col-ctrl").forEach(b=>b.style.opacity="0")}
                  >
                    <button className="col-ctrl" onClick={()=>moveProduct(p.id,-1)} disabled={isFirst} title="Move left"
                      style={{ opacity:0, position:"absolute", top:"50%", left:"4px", transform:"translateY(-50%)", background:"none", border:"none", color:isFirst?"#1e293b":"#64748b", cursor:isFirst?"default":"pointer", fontSize:"14px", lineHeight:1, transition:"opacity 0.15s, color 0.15s", padding:"2px" }}
                      onMouseEnter={e=>{ if(!isFirst)e.currentTarget.style.color="#e2e8f0"; }}
                      onMouseLeave={e=>{ if(!isFirst)e.currentTarget.style.color="#64748b"; }}>◀</button>
                    <button className="col-ctrl" onClick={()=>moveProduct(p.id,1)} disabled={isLast} title="Move right"
                      style={{ opacity:0, position:"absolute", top:"50%", right:"20px", transform:"translateY(-50%)", background:"none", border:"none", color:isLast?"#1e293b":"#64748b", cursor:isLast?"default":"pointer", fontSize:"14px", lineHeight:1, transition:"opacity 0.15s, color 0.15s", padding:"2px" }}
                      onMouseEnter={e=>{ if(!isLast)e.currentTarget.style.color="#e2e8f0"; }}
                      onMouseLeave={e=>{ if(!isLast)e.currentTarget.style.color="#64748b"; }}>▶</button>
                    <button className="col-ctrl" onClick={()=>removeProduct(p.id)}
                      style={{ opacity:0, position:"absolute", top:"6px", right:"4px", background:"none", border:"none", color:"#ef4444", cursor:"pointer", fontSize:"13px", lineHeight:1, transition:"opacity 0.15s", padding:"2px" }} title="Remove">×</button>
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
              // Build coverage map: layerId -> execId
              const coverage = {};
              (org.executives||[]).forEach(ex => ex.layers.forEach(lId => { coverage[lId] = ex.id; }));
              const execById = {};
              (org.executives||[]).forEach(ex => { execById[ex.id] = ex; });
              // Compute segments: for each layer index, {exec, rowSpan} or null (skip cell)
              const segments = [];
              let i = 0;
              while (i < org.layers.length) {
                const lId = org.layers[i].id;
                const execId = coverage[lId];
                if (!execId) {
                  segments.push({ exec: null, rowSpan: 1 });
                  i++;
                } else {
                  let span = 0, j = i;
                  while (j < org.layers.length && coverage[org.layers[j].id] === execId) { span++; j++; }
                  segments.push({ exec: execById[execId], rowSpan: span });
                  for (let k = 1; k < span; k++) segments.push(null);
                  i = j;
                }
              }
              return org.layers.map((layer,li)=>{
                const seg = segments[li];
                const coveredByExec = coverage[layer.id] ? execById[coverage[layer.id]] : null;
                const isCollapsed = coveredByExec && collapsedExecs.has(coveredByExec.id);
                const isMicro = isCollapsed; // every row under a collapsed exec becomes a micro-row
                return (
              <tr key={layer.id} style={{ verticalAlign:"top" }}>
                {/* exec column — only render td when it's the first row of a group (rowSpan handles the rest) */}
                {seg !== null && (
                  seg && seg.exec ? (
                    <td rowSpan={seg.rowSpan} style={{ padding:"10px", borderRight:"1px solid #1e293b", borderBottom:"1px solid #1e293b", background:seg.exec.color, verticalAlign:"middle", position:"relative", minWidth:"140px", cursor:"pointer" }}
                      onClick={()=>toggleCollapse(seg.exec.id)}
                      onMouseEnter={e=>e.currentTarget.querySelectorAll(".ex-ctrl").forEach(b=>b.style.opacity="1")}
                      onMouseLeave={e=>e.currentTarget.querySelectorAll(".ex-ctrl").forEach(b=>b.style.opacity="0")}
                    >
                      <button className="ex-ctrl" onClick={e=>{e.stopPropagation();removeExecutive(seg.exec.id);}}
                        style={{ opacity:0, position:"absolute", top:"5px", right:"5px", background:"none", border:"none", color:"#ef4444", cursor:"pointer", fontSize:"12px", lineHeight:1, transition:"opacity 0.15s", padding:"2px" }} title="Remove">×</button>
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
                          style={{ opacity:0, background:"none", border:"1px solid "+seg.exec.accent+"44", borderRadius:"4px", color:seg.exec.accent+"99", cursor:"pointer", fontSize:"8px", fontFamily:"Courier New, monospace", padding:"2px 6px", letterSpacing:"1px", transition:"all 0.15s" }}
                          onMouseEnter={e=>{e.currentTarget.style.borderColor=seg.exec.accent;e.currentTarget.style.color=seg.exec.accent;}}
                          onMouseLeave={e=>{e.currentTarget.style.borderColor=seg.exec.accent+"44";e.currentTarget.style.color=seg.exec.accent+"99";}}>ASSIGN ROWS</button>
                      )}
                    </td>
                  ) : (
                    <td style={{ padding: isMicro ? "4px 10px" : "12px 10px", borderRight:"1px solid #1e293b", borderBottom:"1px solid #1e293b", background:"#08080f", verticalAlign:"middle" }}>
                      {!isMicro && <div style={{ fontSize:"8px", color:"#1e293b", fontFamily:"Courier New, monospace", textAlign:"center", paddingTop:"8px" }}>unassigned</div>}
                    </td>
                  )
                )}

                {/* layer header cell — micro when collapsed */}
                {isMicro ? (
                  <td colSpan={org.products.length + 2} style={{ padding:"5px 14px", borderBottom:"1px solid #1e293b", background:layer.color+"33", verticalAlign:"middle" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                      <div style={{ width:"3px", height:"14px", background:layer.accent, borderRadius:"2px", flexShrink:0 }} />
                      <span style={{ fontSize:"10px", fontWeight:"600", color:"#64748b", letterSpacing:"0.3px" }}>{layer.label}</span>
                      <span style={{ fontSize:"9px", color:layer.accent+"60", fontFamily:"Courier New, monospace" }}>{layer.sublabel}</span>
                    </div>
                  </td>
                ) : (
                  <>
                <td style={{ padding:"16px", borderRight:"1px solid #1e293b", borderBottom:"1px solid #1e293b", background:layer.color+"55", verticalAlign:"top", position:"relative" }}
                  onMouseEnter={e=>e.currentTarget.querySelectorAll(".row-ctrl").forEach(b=>b.style.opacity="1")}
                  onMouseLeave={e=>e.currentTarget.querySelectorAll(".row-ctrl").forEach(b=>b.style.opacity="0")}
                >
                  <button className="row-ctrl" onClick={()=>moveLayer(layer.id,-1)} disabled={li===0} title="Move up"
                    style={{ opacity:0, position:"absolute", top:"4px", right:"38px", background:"none", border:"none", color:li===0?"#1e293b":"#64748b", cursor:li===0?"default":"pointer", fontSize:"13px", lineHeight:1, transition:"opacity 0.15s, color 0.15s", padding:"2px" }}
                    onMouseEnter={e=>{ if(li!==0)e.currentTarget.style.color="#e2e8f0"; }}
                    onMouseLeave={e=>{ if(li!==0)e.currentTarget.style.color="#64748b"; }}>▲</button>
                  <button className="row-ctrl" onClick={()=>moveLayer(layer.id,1)} disabled={li===org.layers.length-1} title="Move down"
                    style={{ opacity:0, position:"absolute", top:"4px", right:"22px", background:"none", border:"none", color:li===org.layers.length-1?"#1e293b":"#64748b", cursor:li===org.layers.length-1?"default":"pointer", fontSize:"13px", lineHeight:1, transition:"opacity 0.15s, color 0.15s", padding:"2px" }}
                    onMouseEnter={e=>{ if(li!==org.layers.length-1)e.currentTarget.style.color="#e2e8f0"; }}
                    onMouseLeave={e=>{ if(li!==org.layers.length-1)e.currentTarget.style.color="#64748b"; }}>▼</button>
                  <button className="row-ctrl" onClick={()=>removeLayer(layer.id)}
                    style={{ opacity:0, position:"absolute", top:"6px", right:"6px", background:"none", border:"none", color:"#ef4444", cursor:"pointer", fontSize:"13px", lineHeight:1, transition:"opacity 0.15s", padding:"2px" }} title="Remove row">×</button>
                  <div style={{ display:"flex", gap:"10px" }}>
                    <div style={{ width:"3px", minHeight:"50px", background:layer.accent, borderRadius:"2px", flexShrink:0 }} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:"12px", fontWeight:"700", color:"#f1f5f9", lineHeight:"1.3" }}>{layer.label}</div>
                      <div style={{ fontSize:"9px", color:layer.accent, fontFamily:"Courier New, monospace", marginTop:"2px", marginBottom:"8px" }}>{layer.sublabel}</div>
                      <div style={{ padding:"7px 10px", background:"#080e14", border:"1px solid "+layer.accent+"33", borderRadius:"8px" }}>
                        <ET value={layer.lead.name} onChange={v=>updateLayerLead(layer.id,v)} style={{ fontSize:"11px", fontWeight:"700", color:layer.accent }} />
                        <div style={{ fontSize:"9px", color:"#94a3b8" }}>{layer.lead.role}</div>
                      </div>
                      {JDS[layer.id] && (
                        <button onClick={()=>setJdOpen({layerId:layer.id, layer})}
                          style={{ marginTop:"8px", background:"none", border:"1px solid "+layer.accent+"40", borderRadius:"5px", color:layer.accent+"99", cursor:"pointer", fontSize:"9px", fontFamily:"Courier New, monospace", padding:"3px 8px", letterSpacing:"1px", transition:"all 0.15s" }}
                          onMouseEnter={e=>{e.currentTarget.style.borderColor=layer.accent;e.currentTarget.style.color=layer.accent;}}
                          onMouseLeave={e=>{e.currentTarget.style.borderColor=layer.accent+"40";e.currentTarget.style.color=layer.accent+"99";}}>
                          VIEW JD →
                        </button>
                      )}
                    </div>
                  </div>
                </td>

                {/* product cells */}
                {org.products.map(prod=>{
                  const names=prod.cells[layer.id]||[];
                  const tc=typeColors[prod.type]||typeColors.church;
                  const hasJD=!!JDS[layer.id];
                  return (
                    <td key={prod.id}
                      style={{ padding:"12px 10px", borderRight:"1px solid #1e293b", borderBottom:"1px solid #1e293b", background:tc.bg, verticalAlign:"top" }}
                    >
                      <div style={{ display:"flex", flexWrap:"wrap" }} onClick={e=>e.stopPropagation()}>
                        {names.map((name,idx)=>(
                          <Chip key={idx} name={name} accent={layer.accent}
                            onChange={v=>updateCellName(prod.id,layer.id,idx,v)}
                            onDelete={()=>deleteCellName(prod.id,layer.id,idx)}
                            onJD={hasJD ? ()=>setJdOpen({layerId:layer.id,layer}) : undefined}
                          />
                        ))}
                        <button onClick={e=>{e.stopPropagation();addCellName(prod.id,layer.id);}} title="Add role"
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
            {/* innovation row */}
            <tr>
              <td style={{ borderRight:"1px solid #1e293b", borderBottom:"1px solid #1e293b", background:"#08080f" }} />
              <td style={{ padding:"16px", borderRight:"1px solid #1e293b", borderBottom:"1px solid #1e293b", background:"#0f0a1a55", verticalAlign:"top" }}>
                <div style={{ display:"flex", gap:"10px" }}>
                  <div style={{ width:"3px", minHeight:"50px", background:"#7c3aed", borderRadius:"2px", flexShrink:0 }} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:"12px", fontWeight:"700", color:"#f1f5f9", lineHeight:"1.3" }}>Product / Platform Innovation</div>
                    <div style={{ fontSize:"9px", color:"#7c3aed", fontFamily:"Courier New, monospace", marginTop:"2px", marginBottom:"8px" }}>Bleeding Edge R&D</div>
                    <div style={{ padding:"7px 10px", background:"#080e14", border:"1px solid #7c3aed33", borderRadius:"8px" }}>
                      <ET value={org.innovationLead} onChange={updateInnovationLead} style={{ fontSize:"11px", fontWeight:"700", color:"#c084fc" }} />
                      <div style={{ fontSize:"9px", color:"#94a3b8" }}>Innovation Lead</div>
                    </div>
                  </div>
                </div>
              </td>
              <td colSpan={org.products.length} style={{ padding:"12px 10px", borderRight:"1px solid #1e293b", borderBottom:"1px solid #1e293b", background:"#0f0a1a", verticalAlign:"top" }}>
                <div style={{ display:"flex", flexWrap:"wrap" }}>
                  {org.innovation.map((name,idx)=>(
                    <Chip key={idx} name={name} accent="#7c3aed"
                      onChange={v=>updateInnovation(idx,v)}
                      onDelete={()=>setOrg(o=>({...o,innovation:o.innovation.filter((_,i)=>i!==idx)}))} />
                  ))}
                  <button onClick={()=>setOrg(o=>({...o,innovation:[...o.innovation,"New Member"]}))} title="Add"
                    style={{ background:"none", border:"1px dashed #7c3aed40", borderRadius:"6px", color:"#7c3aed80", cursor:"pointer", fontSize:"14px", width:"26px", height:"26px", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"5px", transition:"all 0.15s", padding:0 }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor="#7c3aed";e.currentTarget.style.color="#7c3aed";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="#7c3aed40";e.currentTarget.style.color="#7c3aed80";}}>+</button>
                </div>
              </td>
              <td style={{ borderBottom:"1px solid #1e293b", background:"transparent" }} />
            </tr>

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

      {/* legend */}
      <div style={{ marginTop:"16px", display:"flex", gap:"14px", flexWrap:"wrap", fontSize:"10px", color:"#64748b", fontFamily:"Courier New, monospace" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"5px" }}><div style={{ width:"9px", height:"9px", borderRadius:"2px", background:"#4a9eff33", border:"1px solid #4a9eff55" }} />Church</div>
        <div style={{ display:"flex", alignItems:"center", gap:"5px" }}><div style={{ width:"9px", height:"9px", borderRadius:"2px", background:"#facc1522", border:"1px solid #facc1544" }} />360° Clients</div>
        <div style={{ display:"flex", alignItems:"center", gap:"5px" }}><div style={{ width:"9px", height:"9px", borderRadius:"2px", background:"#0e1a10", border:"1px solid #3ecf8e55" }} />Gloo</div>
        <div style={{ display:"flex", alignItems:"center", gap:"5px" }}><div style={{ width:"9px", height:"9px", borderRadius:"2px", background:"#0f0a1a", border:"1px dashed #7c3aed55" }} />Innovation</div>
        <div style={{ color:"#334155" }}>Hover any role chip → JD button appears · VIEW JD in row header also works</div>
      </div>
      </>)}

      {/* inject JD badge hover style */}
      <style>{`td:hover .jd-hint { opacity: 1 !important; }`}</style>
    </div>
  );
}
