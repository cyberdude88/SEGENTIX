# ASPM — Mission, Objectives, Redundancy, and Gap-Filling Functions

> Working document derived from `STRATEGY.md` and `market_strategy.txt` (June 2026), and reconciled
> against `SPEC.md` (current build). Supersedes the "Product positioning" line in
> `SPEC.md` until that file is updated.

---

## 1. Adjusted Mission

**Old mission (foreclosed by the market):**
> Discover every AI agent. Understand every permission. Govern every action.
> Enforce least privilege.

This is now commercial posture-platform homepage copy, backed by billions in
combined venture funding. Shipping the same mission as a solo founder loses on
feature velocity and GTM reach within 12 months.

**Adjusted mission:**
> **Agent governance and ATO automation for environments where SaaS can't go
> and auditors must sign.**
>
> Discover every agent. Map every action to a control. Generate the evidence.
> Walk into the audit ready.

The product is no longer a generic posture dashboard, and it is not only ATO
automation. ATO evidence is the first packaged buyer outcome. The larger
product is the **governance + evidence layer** that lets a regulated,
classified, sovereign, or air-gapped organization govern AI agents and
demonstrate OWASP/RMF coverage, with control mappings to NIST 800-53 / CNSSI
1253 / CMMC / EU AI Act.

**Forcing function:** FY2026 NDAA §1513 directs DoD to fold AI/ML security into
DFARS and CMMC. Status report to Congress was due 2026-06-16. No commercial
agent-security vendor is architected to serve this requirement.

---

## 2. Objectives (Derived from the Adjusted Mission)

Each objective is tagged with the strategy gap it serves (G1–G6 from
`market_strategy.txt` §4) and the security layer it lives in (L1–L3 from
`SPEC.md` §"Three-layer security model").

| # | Objective | Gap | Layer |
|---|---|---|---|
| O1 | Maintain a complete inventory of AI agents, including shadow agents, across cloud, SaaS, custom, and local environments | — | L1 |
| O2 | Map every agent's tools and actions to a Read/Write/Modify/Delete/Admin risk class | — | L1 |
| O3 | Enforce allow/deny policy on tool actions, with audit trail | — | L1 |
| O4 | **Map agent posture findings to NIST 800-53, CNSSI 1253, CMMC practices, and EU AI Act articles** | G1, G2 | L1 |
| O5 | **Generate ATO-ready evidence packages: POA&M, SAR-style findings, eMASS-importable bundles, continuous-monitoring outputs** | G2 | L1 |
| O6 | **Deploy as a single binary or container with zero phone-home, suitable for IL4/IL5 and air-gapped enclaves** | G1 | L1 |
| O7 | **Govern the Skill / instruction-set / context layer: registry, version pinning, allowlist, capability + autonomy budgets** | G3 | L1 |
| O8 | **Implement the RMF disposal phase: secure decommissioning workflow for agent weights, training data, containers, secrets** | G6 | L1 |
| O9 | Publish and maintain an open **Agent RMF Overlay** mapping OWASP Agentic Top 10 ↔ NIST 800-53 / CNSSI 1253 controls | G2 | — |
| O10 | Support EU / NATO sovereignty requirements: data residency, on-soil deployment, sovereign-cloud compatibility | G4 | L1 |

Out of scope for MVP (explicit, per strategy §5):

- Runtime MCP traffic inspection (L2) — partnership or later phase
- Behavioral analytics, drift, cascade modeling (L3) — different company
- Blast-radius graph as a marketed differentiator (already shipped by funded commercial tooling)
- Generic multi-tenant SaaS architecture
- Consumer-platform breadth (n8n, etc.) — defer

---

## 3. Redundancy Audit

### 3.1 Redundancy vs. funded commercial tooling

Every objective below is **already shipped** by at least one well-funded
competitor. Building these as differentiators is dead on arrival.

| Capability | Category leader | Lifecycle platform | Identity platform | In current build? |
|---|---|---|---|---|
| Agent / model / MCP discovery | ✅ | ✅ | ✅ | ✅ (`/agents`, mock) |
| Tool & action inventory | ✅ | ✅ | partial | ✅ (`AgentDetailPanel`) |
| Risk classification (R/W/M/D/A) | ✅ | ✅ | — | ✅ (`mock-data.ts`) |
| Posture management dashboard | ✅ | ✅ | ✅ | ✅ (`/` Dashboard) |
| Shadow-agent detection | ✅ | ✅ | partial | ✅ (`RiskBanner`, filters) |
| Blast-radius / Agentic Risk Map | ✅ | partial | — | not yet |
| Policy allow/deny | ✅ | ✅ | ✅ | ✅ (`/policies`) |
| OWASP Agentic Top 10 mapping | ✅ | partial | — | ✅ (`CoverageLayers`) |
| **NIST 800-53 / CNSSI 1253 mapping** | ❌ | ❌ | ❌ | ❌ |
| **CMMC practice mapping** | ❌ | ❌ | ❌ | ❌ |
| **eMASS-importable evidence export** | ❌ | ❌ | ❌ | ❌ |
| **Air-gapped / on-prem deployment** | ❌ (SaaS only) | ❌ | ❌ | n/a (Next.js prototype) |
| **Skill / instruction-set governance** | ❌ (publicly acknowledged observability gap) | ❌ | ❌ | ❌ |
| **Agent disposal workflow** | ❌ | ❌ | ❌ | ❌ |
| **EU/NATO sovereign deployment** | ❌ | ❌ | ❌ | ❌ |

**Reading:** Rows 1–8 are commodity. The current build already covers 7 of
those 8. Keep them because the regulated-buyer story still needs them, but do
not market them as differentiators. Rows 9–15 are the white space and are the
new product surface.

### 3.2 Redundancy inside our own objectives

- **O1 ↔ O2:** Discovery and tool mapping are naturally one pipeline. Already
  fused in `lib/mock-data.ts` shape. Keep fused; no duplication.
- **O4 ↔ O9:** O9 (public overlay) is the open-source content asset; O4 is the
  productized engine that consumes it. Same corpus, two surfaces. Treat the
  overlay as the canonical mapping table that the engine reads at build time.
- **O5 ↔ O8:** Disposal evidence (O8) is one section of the evidence bundle
  (O5). Implement O8 as an evidence template inside the O5 export engine, not
  as a parallel reporting path.
- **O6 ↔ O10:** Air-gap and sovereignty are the same deployment story with
  different jurisdictional framing. One deployable artifact, multiple framing
  documents.
- **L2 / L3 ambitions:** Currently surfaced in `SPEC.md` §"Future roadmap" as
  Phases 2 and 4. They are still roadmap — but the strategy explicitly recasts
  them as **partnership or later-stage**, not founder-built. Soften the
  language in `SPEC.md` to reflect that.

### 3.3 Redundancy with what the current build already ships

`SPEC.md` lists 7 metric cards, an agent inventory, policy rules, a coverage
layers panel, and a shadow-AI report section. All of this maps cleanly to
O1–O3 and the OWASP side of O9. **Nothing here needs to be rebuilt.** The
build's gap is everything below the OWASP layer: the control-mapping engine,
the evidence exporter, the deployment story, the Skill registry, the disposal
workflow.

---

## 4. Functions to Fill the Gaps

The functions below are the concrete capabilities that turn the current
prototype into the repositioned product. Each is named so it can be tracked as
a unit of work, mapped to the objective it serves, and ordered by the
execution roadmap in `market_strategy.txt` §7.

### F1. Control Mapping Engine  ·  serves O4
- Input: an agent record (platform, tools, actions, risk class, owner, origin).
- Output: a list of applicable 800-53 / CNSSI 1253 / CMMC controls with
  inherited/satisfied/POA&M status per control.
- Storage: mapping corpus is a versioned YAML/JSON in-repo (the canonical
  source O9 also publishes). Engine is a pure function over that corpus + the
  agent record — no network calls, air-gap safe by construction.
- UI: new tab on the agent detail panel ("Controls") + a per-control rollup on
  `/reports`.

### F2. Evidence Export  ·  serves O5, O8
- Generates: POA&M CSV (eMASS column schema), SAR-style findings doc
  (Markdown + PDF), control-implementation statements per agent, continuous-
  monitoring snapshot (JSON).
- Includes O8 disposal artifacts when an agent transitions to a
  "decommissioned" state: weight-destruction attestation, data-purge record,
  container-image disposition log.
- One CLI subcommand and one `/reports` action, both producing the same
  bundle. Bundle is reproducible (deterministic ordering, embedded mapping-
  corpus version, no timestamps in payload).

### F3. Air-Gap Deployment Mode  ·  serves O6, O10
- Single binary or container with: bundled mapping corpus, no telemetry,
  no outbound calls, file-based ingest (CSV/JSON for agent inventory), file-
  based output (bundle written to a chosen path).
- Cleanly separable from the Next.js UI: a core Go/Rust/Node CLI that the UI
  shells out to in connected mode and that ships standalone in disconnected
  mode. Decide language at F1 implementation time.
- Document the threat model: what flows in, what flows out, what stays local.

### F4. Skill / Instruction-Set Registry  ·  serves O7
- Registry record: skill name, version, hash, source platform, capability
  scope, autonomy budget (read-only / suggest / act), approved/blocked state,
  owner, expiry.
- Audit log of registry mutations.
- Ingest hook for the platforms that expose Skills/instruction-sets via API
  (Copilot Studio, Agentforce, OpenAI). Manual entry for the rest.
- UI: new `/skills` page; cross-link from agent detail panel so a reviewer can
  see which Skills a given agent loads.

### F5. Agent Decommission Workflow  ·  serves O8
- State machine on the agent record: `active → flagged → pending-dispose →
  disposed`.
- Per-state checklist driven by the RMF disposal phase: revoke NHIs, rotate
  secrets, delete weights/fine-tuned models, purge training/embedding data,
  archive logs, destroy containers, file disposition statement.
- Each completed step writes an artifact that F2 picks up.

### F6. Public RMF Overlay  ·  serves O9
- Not a product feature — a content + repo asset. Open the mapping corpus
  (the same YAML F1 consumes) on GitHub under a permissive license.
- Companion long-form: an OWASP Agentic Top 10 ↔ 800-53 / CNSSI 1253 / CMMC
  cross-walk, referencing DoD AI RMF Tailoring Guide v2.
- Cyber Shop Talk episodes walk it section by section.
- Strategic role: SEO, credibility, and a community moat that makes F1's
  corpus the de-facto reference.

### F7. Mapping-Corpus Authoring Tooling  ·  serves F1, F6
- Internal-only at first. A small CLI that validates the YAML corpus against a
  schema, checks for orphan controls, and flags duplicates.
- Required because the moat is **the validated mappings**, not the engine.
  Authoring quality compounds; bad authoring tools sink the asset.

### F8. Repositioning of `SPEC.md`  ·  cleanup
- Replace the §"Product positioning" line with the adjusted mission from §1.
- Move blast-radius graph out of the "killer feature" framing.
- Move L2 (runtime gateway) and L3 (behavioral analytics) phases into a
  "Partnerships / later phases" section, not a build roadmap.
- Add a new top-level section linking to this file.

---

## 5. Sequencing (aligned to `market_strategy.txt` §7)

| Phase | Window | Functions | Status |
|---|---|---|---|
| 0 — Authority | Now → Sep 2026 | F6, F7, F8 | **In progress** — F8 complete (`SPEC.md` repositioned); F7 seeded (`scripts/validate-corpus.ts`, `corpus/frameworks.yaml`); F6 seeded (14 draft mappings in `corpus/mappings/`) — all 14 still `status: draft`, awaiting reviewer pass |
| 1 — Prototype | Oct → Dec 2026 | F1, F2 (POA&M only), pilot ingest path | Pending |
| 2 — SkillBridge build | Jan → Apr 2027 | F2 (full), F3, F4, F5 | Pending |
| 3 — Post-separation | Jul 2027+ | Harden F3, EU/NATO packaging (O10), partnership conversations for L2/L3 | Pending |

Phase 0 is deliberately content-and-tooling, not platform-weight. The heavy
build waits for the SkillBridge funded runway.

### Phase 0 exit criteria

- All Phase 0 mappings move from `status: draft` to `status: reviewed` via
  at least one ISSM/ISSO walkthrough.
- `npm run validate-corpus -- --strict` exits 0 (no drafts, no orphans).
- F6 overlay is published under CC BY 4.0 on a public repo with a release
  tag; the Cyber Shop Talk episodes walking the cross-walk are recorded.

---

## 6. What This Document Is Not

- Not a replacement for `SPEC.md`. `SPEC.md` describes the current prototype.
  This file describes the direction the prototype is being steered toward.
- Not a commitment to ship every function. F1, F2, F6, F8 are the
  load-bearing four; the rest are sequenced behind them.
- Not a runtime-security or behavioral-analytics product. Those layers stay
  on the roadmap as partnerships, per strategy §5.
