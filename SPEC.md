# Agent Security Posture Management (ASPM)

> A governance dashboard for AI agents across enterprise environments.
> This repo is the working prototype — Next.js 14, mock data, no backend.

## Mission

**Agent governance and ATO automation for environments where SaaS can't go and auditors must sign.**

Discover every agent. Map every action to a control. Generate the evidence. Walk into the audit ready.

See [`MISSION.md`](./MISSION.md) for the full mission, derived objectives, redundancy audit, and the F1–F8 functions that close the gap between the current prototype and the repositioned product.

## Vision

Organizations are rapidly deploying AI agents across cloud platforms, SaaS applications, custom workflows, and local environments. In regulated, classified, and air-gapped environments, an ISSM/ISSO must additionally answer:

- How many AI agents exist?
- Who owns each agent?
- What tools can each agent access?
- What actions can each agent perform?
- Which agents have excessive privileges?
- Which agents are operating outside approved policy?
- **Which agents were spun up outside of IT visibility (Shadow AI)?**
- **Which NIST 800-53 / CNSSI 1253 / CMMC controls does each agent inherit, satisfy, or violate?**
- **Where is the evidence package for the AO?**

ASPM provides centralized discovery, visibility, governance, least-privilege enforcement, and **RMF-aligned evidence generation** for AI agents — deployable on-prem and air-gapped.

---

## Three-layer security model

| Layer | Name | Status | Covers |
|---|---|---|---|
| 1 | **Posture** | **Active in this build** | LLM06, LLM03, ASI02, ASI03, ASI04, ASI10 — discovery, inventory, privilege mapping, policy enforcement |
| 2 | Runtime gateway | Roadmap | LLM01, LLM05, LLM07, ASI01, ASI02, ASI05, ASI07 — MCP traffic inspection, prompt injection detection, inter-agent comms monitoring, action blocking |
| 3 | Behavioral analytics | Roadmap | LLM02, LLM04, LLM10, ASI06, ASI08, ASI09 — drift detection, anomaly scoring, cascade risk modeling, memory poisoning indicators |

Coverage layers are surfaced on the `/reports` page.

---

## What's built

### Pages

- **`/` Dashboard** — Risk banner with Shadow AI exposure copy, 7 metric cards (Total / Active / Unknown Owner / High Risk / Admin Access / Prod Credentials / **Shadow Agents +trend**), high-risk panel, risk-by-category bar chart, recently-discovered live feed, agent inventory (with Origin column + red left-border on shadow rows), policy violations feed, top tools chart.
- **`/agents`** — Sortable, filterable inventory. Filters: search, platform, risk level, owner (incl. "Unknown owner"), last-active window, **"Show shadow agents only"** toggle. Clicking a row opens a slide-over detail panel: metadata, risk flags, full tool inventory with action map (Read / Write / Modify / Delete / Admin).
- **`/policies`** — 22 mock Allow/Deny rules. Search + type filter. "New rule" modal adds rules to local state.
- **`/reports`** — Shadow AI section (totals, top platforms, stacked shadow-vs-registered chart by business unit, numbered recommended actions) + Coverage Layers panel mapping the 3 layers to OWASP LLM Top 10 / ASI threat IDs.

### Cross-cutting

- **Light/dark theme toggle** (sun/moon icon in TopNav). Persists to `localStorage`. Inline no-flash init script sets the class before paint.
- All colors driven by CSS variables; semantic Tailwind tokens (`bg-bg-card`, `border-line`, `bg-surface-2`, `text-fg-muted`, etc.).
- Hairline (0.5px) borders, no drop shadows.
- Recharts for all charts (themed via Tailwind variables).

### Data model

`lib/mock-data.ts` — 87 agents distributed across the 6 platforms (OpenAI Agents, Microsoft Copilot Studio, Salesforce Agentforce, LangChain, CrewAI, n8n) with 14 Shadow, 11 Discovered, 62 Registered. 8 tools (Microsoft Graph, ServiceNow, Jira, AWS, Azure, GitHub, Slack, Salesforce) with realistic actions classified Read / Write / Modify / Delete / Admin. 8 policy violations, 22 policy rules, 8 discovery events.

`lib/types.ts` is the single source of truth for all the shapes.

---

## Stack

- Next.js 14 (app router) + TypeScript
- Tailwind CSS 3 + tailwindcss-animate
- shadcn-style primitives (hand-rolled, Radix Dialog under the hood for Sheet/Modal)
- Recharts
- Lucide React icons
- Mock data only

---

## Run it

```bash
cd ~/ASPM
npm install
npm run dev
```

Open http://localhost:3000.

The dev server in this workspace is already running detached (adopted by `systemd --user`); it survives Claude session close. To stop it manually: `lsof -ti:3000 | xargs kill -9`. To check status: `ss -ltnp | grep :3000`.

---

## File layout

```
app/
  layout.tsx              # ThemeProvider, sidebar + topnav shell
  globals.css             # CSS variables for light/dark
  page.tsx                # Dashboard
  agents/page.tsx
  policies/page.tsx
  reports/page.tsx
components/
  layout/Sidebar.tsx
  layout/TopNav.tsx
  theme/ThemeProvider.tsx # client-side theme state + no-flash init script
  theme/ThemeToggle.tsx
  dashboard/RiskBanner.tsx
  dashboard/MetricCards.tsx
  dashboard/HighRiskPanel.tsx
  dashboard/RiskChart.tsx
  dashboard/AgentTable.tsx
  dashboard/ViolationsFeed.tsx
  dashboard/DiscoveriesFeed.tsx
  dashboard/TopToolsChart.tsx
  dashboard/SectionHeader.tsx
  agents/AgentFilters.tsx
  agents/AgentDetailPanel.tsx
  policies/PolicyRuleList.tsx
  reports/ShadowByBuChart.tsx
  reports/CoverageLayers.tsx
  ui/                     # button, badge, card, table, sheet, dialog, input, avatar
lib/
  mock-data.ts
  types.ts
  utils.ts
```

---

## Build roadmap

The repositioned product roadmap lives in [`MISSION.md`](./MISSION.md) §4–§5 (functions F1–F8, sequenced into Phases 0–3). The short version:

- **Phase 0 (now → Sep 2026):** F6 public RMF overlay, F7 corpus authoring tooling, F8 spec cleanup.
- **Phase 1 (Oct → Dec 2026):** F1 control mapping engine, F2 evidence export (POA&M first), pilot ingest path.
- **Phase 2 (Jan → Apr 2027, SkillBridge):** F2 full evidence bundle, F3 air-gap deployment mode, F4 Skill registry, F5 decommission workflow.
- **Phase 3 (Jul 2027+):** harden F3, EU/NATO packaging, partnership conversations for Layer 2 / Layer 3.

Agent approval workflow (business-owner sign-off, security approval, expiration, recertification) is folded into F5 and the F2 evidence bundle rather than tracked as a standalone phase.

---

## Partnerships and later phases

Layers 2 and 3 are intentionally **not founder-built**. Per `market_strategy.txt` §5, they are partnership or later-stage scope — runtime protection is "a partnership or roadmap item, never the MVP."

### Layer 2 — Runtime gateway (partnership scope)

Inline MCP traffic inspection, prompt injection detection, inter-agent communication monitoring, action blocking. Policy enforcement examples already seeded in mock data:

- Allow: `ServiceNow.CreateTicket`, `Jira.CreateIssue`
- Deny: `Azure.DeleteVM`, `AWS.DeleteBucket`

### Layer 3 — Behavioral analytics (later-phase scope)

Drift detection, anomaly scoring, cascade risk modeling, memory poisoning indicators, SIEM integration.
