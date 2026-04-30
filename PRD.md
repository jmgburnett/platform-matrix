# Platform Matrix — Gloo Engineering Org Visualization & Management

**The living blueprint of how Gloo's technology organization is structured, staffed, and evolving.**

---

## Vision

Platform Matrix is an internal strategic planning tool that makes Gloo's engineering organization legible. It answers the questions leaders ask constantly but can never answer quickly: *Who's working on what? Which teams are understaffed? How do people map to products? Where are the gaps?*

Traditional org charts show reporting lines. Spreadsheets track headcount. Neither captures the reality of a matrixed engineering org where people work across multiple products, roles span layers, and the organization is simultaneously stabilizing legacy systems, modernizing architecture, and productizing for scale.

Platform Matrix does. It's a single interactive surface where Josh and Gloo leadership can see the entire engineering org mapped against products, layers, stages, and customers — and edit it in real-time as the organization evolves.

---

## Context

Gloo is a faith-tech company operating a complex engineering organization with:
- **200+ team members** across multiple functions
- **5+ product verticals** (Church, AG, ETEN, IV, ABS — each a major nonprofit customer/partner)
- **11 functional layers** from Data & Analytics down to Infrastructure & Data
- **3 executive lanes** (IT & Ops, Product, Engineering)
- **3 organizational stages** happening simultaneously (Stabilize → Modernize → Productize)

The org is moving from a fragmented legacy structure into a platform-oriented architecture. This transition requires constant visibility into who's allocated where, which stages are getting investment, and where capability gaps exist.

No off-the-shelf org chart tool handles this. Platform Matrix was purpose-built for it.

---

## Who It's For

| Audience | Use Case |
|----------|----------|
| **Josh (Head of AI Product)** | Strategic planning, staffing decisions, org design, presenting to leadership |
| **Daniel (Engineering Leader)** | Engineering allocation, layer staffing, capability assessment |
| **Justin (IT & Ops Leader)** | IT layer visibility, infrastructure staffing |
| **Hiring managers** | Gap identification, role scoping (JDs built in) |
| **Exec team** | Board-level org snapshots, strategic alignment reviews |

---

## Technical Architecture

### Stack
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Backend | Convex (elegant-meerkat-935) |
| Deployment | Vercel |
| UI | Gloo Design System components + Tailwind CSS |
| Icons | Phosphor Icons |
| Auth | Session-based passcode gate ("Manatee") |

### Live URLs
- **Production:** Vercel (prj_rbYc0aeT3QTLuRtOdqZUf8323T4Z)
- **GitHub:** github.com/jmgburnett/platform-matrix

### Data Architecture
Simple but effective — two JSON blobs in Convex:

```
orgData      — Full org matrix state (layers, products, cells, executives, people assignments)
rosterData   — Roster metadata (roles, capabilities, contact info, manager assignments, status)
```

This "document" pattern was chosen over normalized tables because:
1. The data is edited as a whole (drag/drop, bulk reassignment)
2. A single leader is the primary editor — no multi-user conflict concerns
3. Real-time sync via Convex gives instant persistence without save buttons
4. The org structure changes shape frequently (add/remove layers, products) — schema flexibility matters

---

## Feature Map

### ━━━ The Matrix View (Core) ━━━
**Status: ✅ Shipped**

The main view — a grid where **rows = functional layers** and **columns = products/customers**.

#### Layers (Rows)
| # | Layer | Lead | Executive |
|---|-------|------|-----------|
| 1 | Data & Analytics | TBD | Justin (IT & Ops) |
| 2 | Enterprise Systems | TBD | Justin |
| 3 | Core Infrastructure | TBD | Justin |
| 4 | Security | TBD | Justin |
| 5 | Help Desk | TBD | Justin |
| 6 | Product | TBD | TBD (Product) |
| 7 | Design | Matthew Slaughter | Daniel (Engineering) |
| 8 | Platform Solution Engineer | Casey | Daniel |
| 9 | Application Layer Engineer | Casey | Daniel |
| 10 | Shared Solutions | Brian Johnson | Daniel |
| 11 | Infrastructure & Data | Daniel Wilson | Daniel |

#### Products (Columns)
| Product | Type | Product Lead |
|---------|------|-------------|
| Church | Church | TBD |
| AG | 360° | TBD |
| ETEN | 360° | TBD |
| IV | 360° | TBD |
| ABS | 360° | TBD |

#### Matrix Features
| Feature | Status | Description |
|---------|--------|-------------|
| Layer × Product grid with people chips | ✅ | Each cell shows who's assigned to that layer for that product |
| Stage tracking (Stabilize / Modernize / Productize / All) | ✅ | Per-person stage allocation — color-coded badges |
| Stage filtering | ✅ | Filter the whole matrix by stage to see who's working on what phase |
| Inline editing (all text fields) | ✅ | Click any label, name, role, or description to edit in-place |
| Add/remove rows (layers) | ✅ | Modal with layer name, description, lead, accent/background color picker |
| Add/remove columns (products) | ✅ | Modal with product name, type (Church/360°/Gloo), product lead |
| Add/remove people in cells | ✅ | Assign people to specific layer × product intersections |
| Executive lanes | ✅ | Top-level grouping showing which executive owns which layers |
| Per-person stage cycling | ✅ | Click ⟳ on any chip to cycle through S → M → P → All |
| Accent & background color customization per layer | ✅ | 8 accent colors, 8 background colors |
| Per-product people count | ✅ | Header shows total resources per product column |
| Assign rows to executive lanes | ✅ | Reassign which layers report to which executive |
| Dark theme premium aesthetic | ✅ | Purpose-built dark dashboard look |

#### Job Descriptions (JDs)
| Feature | Status | Description |
|---------|--------|-------------|
| Built-in JDs for 6 core roles | ✅ | Design, App Eng, Platform Eng, Shared Solutions, Infra & Data, Product |
| JD modal with full details | ✅ | Title, reports to, what the role does, responsibilities, looking for, success criteria |
| "What This Role Is Not" section | ✅ | Anti-patterns and scope boundaries per role |
| "On Human Flourishing" section | ✅ | Mission-driven framing unique to Gloo's culture |
| Custom JDs (create + edit) | ✅ | Add JDs for any new layer |
| Edit JDs from view modal | ✅ | Inline editing without leaving the modal |
| JD button on person chips | ✅ | Quick access to the JD for any role |

#### Layer Descriptions
| Feature | Status | Description |
|---------|--------|-------------|
| Purpose statement per layer | ✅ | Why this layer exists |
| Activities list | ✅ | What the layer does day-to-day |
| Outputs list | ✅ | What the layer produces |
| "Not This" framing | ✅ | What the layer is not responsible for |
| Flourishing statement | ✅ | How this work connects to mission |

---

### ━━━ Team Roster ━━━
**Status: ✅ Shipped**

Full people directory derived from the matrix assignments, plus metadata that doesn't belong in the grid view.

| Feature | Status | Description |
|---------|--------|-------------|
| 204+ team members | ✅ | Full engineering org imported |
| Search by name | ✅ | Instant filter across all members |
| Filter by layer, product, stage | ✅ | Drill down to specific intersections |
| "Unassigned" filter | ✅ | Find people not yet placed in the matrix |
| Role editing | ✅ | Assign/change role per person |
| Role → Layer auto-mapping | ✅ | Changing role to "Platform Solution Engineer" auto-moves to correct layer |
| Capabilities tags | ✅ | Freeform capability list per person |
| Contact info (email, phone) | ✅ | Per-person contact details |
| Notes field | ✅ | Free-text notes per person |
| Employee vs. Provisional status | ✅ | Track employment type |
| Stage per assignment | ✅ | Editable stage syncs back to matrix |
| Engineering Manager designation | ✅ | Flag people as EMs, assign EM to others |
| Product Manager designation | ✅ | Flag and assign PMs |
| Design Manager designation | ✅ | Flag and assign design managers |
| Program Manager designation | ✅ | Flag and assign program managers |
| "Accountable To" section | ✅ | Shows product leads for assigned customers |
| "Reports To" section | ✅ | Shows layer lead for assigned layers |
| Add people from roster page | ✅ | Create new team members directly |
| Remove people from roster | ✅ | Delete with confirmation |
| Inline edit assignments (customer + layer) | ✅ | Change without delete/recreate |

---

### ━━━ Customer Roster ━━━
**Status: ✅ Shipped**

Customer/organization directory showing which nonprofits Gloo serves and how they map to the platform.

| Feature | Status | Description |
|---------|--------|-------------|
| Customer list with categorization | ✅ | Bible Translators, Denominations, Higher Ed, Para Church, Internal |
| Category filter | ✅ | Filter by nonprofit type |
| Search | ✅ | Filter by name |
| Per-customer people count | ✅ | How many team members are assigned to each customer |
| Add/remove customers | ✅ | Create new customer orgs |
| Expand for details | ✅ | See who's assigned to each customer |
| Type badges (Church / 360° / Gloo) | ✅ | Visual categorization |

---

### ━━━ Navigation ━━━
**Status: ✅ Shipped**

| Feature | Status | Description |
|---------|--------|-------------|
| Shared header with page switching | ✅ | Matrix / Team Roster / Customer Roster tabs |
| Session-based password gate | ✅ | Passcode required per browser session |
| Responsive layout | ✅ | Horizontal scroll for large matrices |

---

## Organizational Model

Platform Matrix encodes a specific organizational philosophy that Josh and Daniel are driving at Gloo:

### The Layer Model
The org is structured in **horizontal functional layers** that cut across **vertical product lines**. This is not a traditional hierarchy — it's a capability matrix:

- **Each layer has a purpose, not just a name.** "Shared Solutions" isn't just a team — it has a defined mandate (agent orchestration, skills library, trust fabric) with explicit anti-patterns ("not an integration plumber").

- **Forward deployment is the primary research method.** Every layer description emphasizes going on-site, embedding with customers, feeling friction firsthand. This is Gloo's operating philosophy baked into the org design.

- **The "Not This" framing is critical.** Each role explicitly states what it is NOT. This prevents scope creep, misalignment, and the natural drift of engineering roles into generic feature factories.

### The Stage Model
The organization operates in three simultaneous modes:

| Stage | Color | Purpose |
|-------|-------|---------|
| **Stabilize** 🟠 | Orange | Fix what's broken. Reliability, performance, technical debt. |
| **Modernize** 🟣 | Purple | Rebuild for the future. Architecture, platform consolidation. |
| **Productize** 🟢 | Green | Ship new value. Products, features, market expansion. |

Every person is allocated to a stage. This makes it visible at a glance: *Are we over-investing in stabilization at the expense of productization? Is anyone working on modernization for ETEN?*

### The Executive Model
Three executive lanes own different parts of the stack:
- **Justin** — IT & Ops (Data, Enterprise Systems, Infrastructure, Security, Help Desk)
- **TBD** — Product (Product layer)
- **Daniel** — Engineering (Design, Platform Eng, App Eng, Shared Solutions, Infra & Data)

---

## What We're Driving Toward

### Near-Term (Current Focus)

1. **Staffing the matrix** — Many cells are empty or have TBD leads. The matrix makes gaps visible so Josh and Daniel can prioritize hiring.

2. **Stage rebalancing** — Ensure the right ratio of Stabilize vs. Modernize vs. Productize investment per product. The matrix makes imbalances obvious.

3. **Manager designation rollout** — Engineering Managers, Product Managers, Design Managers, Program Managers — establishing the management structure across layers.

4. **Customer mapping** — Which nonprofits map to which products, and how many people serve each customer? Customer Roster makes this visible.

### Mid-Term (Next Phase)

#### Real Authentication
| Feature | Status |
|---------|--------|
| Replace passcode with proper auth (Google OAuth or BetterAuth) | ❌ |
| Role-based access (viewer vs. editor) | ❌ |
| Audit log of changes | ❌ |

#### Normalized Data Model
| Feature | Status |
|---------|--------|
| Move from JSON blobs to proper Convex tables | ❌ |
| Individual person records with relationships | ❌ |
| Change history per person/layer/product | ❌ |
| Multi-user concurrent editing | ❌ |

#### Capacity Planning
| Feature | Status |
|---------|--------|
| FTE allocation (full-time vs. fractional per product) | ❌ |
| Capacity utilization per layer (over/under-staffed indicators) | ❌ |
| "What if" scenario modeling (add/remove people, see impact) | ❌ |
| Headcount targets per cell with gap highlighting | ❌ |
| Cost modeling per layer/product (salary bands × allocation) | ❌ |

#### Skills & Development
| Feature | Status |
|---------|--------|
| Skill matrix overlay (who has what capabilities per layer) | ❌ |
| Skill gap analysis (what's needed vs. what's present) | ❌ |
| Growth plans per person | ❌ |
| Cross-training visibility (who can flex between layers) | ❌ |

#### Reporting & Export
| Feature | Status |
|---------|--------|
| Export org chart as PDF/image for board decks | ❌ |
| Staffing summary report (counts by layer, stage, product) | ❌ |
| Historical snapshots (what did the org look like 3 months ago?) | ❌ |
| Comparison mode (before/after org changes) | ❌ |

### Long-Term (Integration with Flow)

#### Flow ↔ Platform Matrix Integration
The natural evolution is for Platform Matrix to become a module within Flow's TeamOS:

| Feature | Status |
|---------|--------|
| Shared people data between Flow contacts and Platform Matrix roster | ❌ |
| Platform Matrix team members auto-populate Flow's team management | ❌ |
| Meeting action items assigned to Matrix people | ❌ |
| Commitment tracking from live capture mapped to team members | ❌ |
| OKRs in Flow linked to Matrix layers/products | ❌ |
| Unified auth across Flow and Platform Matrix | ❌ |

#### AI-Powered Org Intelligence
| Feature | Status |
|---------|--------|
| AI analysis of org balance ("Engineering layer is 40% Stabilize — consider shifting") | ❌ |
| Auto-suggest reassignments based on capacity + skill match | ❌ |
| Predict attrition risk based on allocation patterns | ❌ |
| Generate hiring justifications from gap analysis | ❌ |
| Flobot can answer "Who's working on ETEN's modernization?" from Matrix data | ❌ |

---

## The Forward Deployment Philosophy

The JDs and layer descriptions encode a specific philosophy that makes Gloo's org unique. This is worth preserving:

> **"Forward deployment is the primary research method."**

Every role — from designers to infrastructure engineers — is expected to go on-site, embed with ministry staff, and feel the friction firsthand. This isn't just a nice-to-have; it's the defining characteristic of how Gloo builds product.

> **"Execution is no longer the bottleneck. Product judgment is."**

AI agents can generate code, UI, and content. The scarce resource is knowing *what to build*. The org is designed around judgment and context, not throughput.

> **"Design that respects their attention and gets out of their way is not just good UX. It is an act of service."**

Every layer description includes a "Human Flourishing" statement that connects the technical work to Gloo's mission of serving ministry leaders. This is not decoration — it's the cultural DNA of the organization, encoded in the tool itself.

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Org visibility | Any leader can answer "who's working on what" in <30 seconds |
| Staffing gaps | All critical gaps identified and visible with stage/layer attribution |
| Hiring alignment | Every open req traces to a specific Matrix cell |
| Stage balance | Conscious allocation ratios per product (not accidental drift) |
| Time to reorg | Org changes modeled and communicated in hours, not weeks |
| Adoption | Used in every staffing/planning meeting as the source of truth |

---

## Technical Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| JSON blob doesn't scale beyond ~300 people | Migrate to normalized tables when needed |
| No version history — can't undo changes | Add change log / snapshot feature |
| Single-user editing assumption | Fine for now — Josh is primary editor. Normalize data for multi-user later. |
| Passcode auth is minimal | Replace with proper auth when sharing beyond core leadership |
| No mobile experience | Not needed — this is a laptop/desktop planning tool |

---

## What Platform Matrix Is Not

- **Not an HR system.** It doesn't track compensation, PTO, or performance reviews.
- **Not a project management tool.** It doesn't track tasks, sprints, or delivery timelines.
- **Not a traditional org chart.** Reporting lines exist but are secondary to the capability × product matrix.
- **Not a headcount tracker.** It's a *strategic allocation* tool — showing how capability maps to value delivery.

It's the answer to the question every engineering leader asks but no tool answers: *"Show me my org — not the hierarchy, but the reality of who's doing what, for whom, at what stage of maturity."*

---

*Built for Gloo. Designed by Josh. The living blueprint of a mission-driven engineering organization.*
