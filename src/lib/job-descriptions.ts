/* ─── JOB DESCRIPTIONS ─── */
/* Shared between matrix and roster */

export interface JobDescription {
  title: string;
  reports: string;
  what: string;
  responsibilities: string[];
  notThis: string;
  looking: string[];
  success: string[];
  flourishing: string;
}

export const JDS: Record<string, JobDescription> = {
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

/* Extract just the titles for dropdown use */
export const JD_TITLES = Object.values(JDS).map(jd => jd.title);
