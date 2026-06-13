# ASPM Landing Page — Handoff

> Last updated: 2026-06-12

This project is the ASPM copy of the cinematic freelance landing page. The original freelance site remains at `/home/alex/freelance-site` and should stay intact.

## What Changed

- Copied the freelance-site source into `/home/alex/ASPM`.
- Excluded `.git`, `.next`, and `node_modules` from the copy.
- Moved the previous ASPM prototype folders into `legacy-aspm/`.
- Installed the copied Next 16 / React 19 / Tailwind 4 dependencies.
- Rewrote the active hero and service-surface copy for ASPM.

## Active Files

- `src/app/page.tsx` renders `Stage`, `Services`, and the footer.
- `src/app/layout.tsx` owns metadata and fonts.
- `src/components/Stage.tsx` owns the snap-scroll ASPM hero.
- `src/components/Services.tsx` owns the product-surface carousel and desktop 3D word cloud.
- `src/components/SignalParallax.tsx` owns the background R3F scene and label camera fly-in.
- `src/app/globals.css` owns the copied visual system: HUD corners, scanline, grain, video tint, carousel motion, and cloud detail animations.

## Current Product Story

ASPM is positioned as:

> Agent governance for regulated, classified, sovereign, and air-gapped
> environments. ATO automation is the first packaged outcome, not the full
> company vision.

The page should reinforce:

- agent discovery
- control mapping to NIST 800-53 / CNSSI 1253 / CMMC
- Skill / instruction-set governance
- EU / NATO sovereignty and air-gap deployment
- evidence export
- air-gap and enclave deployment
- RMF lifecycle workflow
- pilot readiness for regulated buyers

## Stage Sequence

`Stage.tsx` defines nine moments:

| # | Tag | Title |
|---|---|---|
| 00 | ASPM | ASPM |
| 01 | DISCOVERY | Discover Every Agent |
| 02 | CONTROL MAP | Map Actions To Controls |
| 03 | SKILLS | Govern Instruction Sets |
| 04 | EVIDENCE | Generate The Binder |
| 05 | AIR GAP | Deploy Inside The Enclave |
| 06 | RMF | Walk Into Audit Ready |
| 07 | NDAA 1513 | Built For The Forcing Function |
| 08 | ESTABLISH LINK | Request Pilot Access |

The top HUD now reads:

- `ASPM // v0.1`
- `DISCOVER · MAP · EVIDENCE`
- `STATUS // ENCLAVE READY`

The jump button label is `WHAT SHIPS`.

## Product Surfaces

`Services.tsx` defines seven surfaces:

| # | Surface | Purpose |
|---|---|---|
| 01 | Agent Discovery | Inventory approved, discovered, and shadow agents. |
| 02 | Control Mapping | Translate tool actions into RMF control language. |
| 03 | Skill Governance | Govern Skills and instruction-sets as auditable artifacts. |
| 04 | Evidence Export | Generate POA&M, SAR-style, and eMASS-ready artifacts. |
| 05 | Enclave Deployment | Package for air-gapped / no-phone-home environments. |
| 06 | RMF Workflow | Track approval, monitoring, POA&M, recertification, and disposal. |
| 07 | Pilot Readiness | Scope design-partner deployments for regulated buyers. |

## Local Development

```bash
cd /home/alex/ASPM
npm run dev
```

Default URL:

```text
http://localhost:3000
```

If the preserved freelance site is already bound to port 3000, either stop that process or run:

```bash
npm run dev -- --port 3001
```

## Verification Commands

```bash
npm run build
curl -I http://localhost:3000
```

## Notes

- The copied `Hero.tsx`, `Scene3D.tsx`, `Contact.tsx`, `Credentials.tsx`, and `Work.tsx` are not active in `src/app/page.tsx`.
- `legacy-aspm/` preserves the earlier ASPM dashboard/marketing prototype for reference.
- Keep public page copy vendor-generic. No named competitor callouts.

---

# `/demo` Dashboard — Buyer-Need Coverage

> Added 2026-06-12. Extends `/demo` to cover the full buyer opportunity matrix.

## Buyer need → product surface

| Buyer question | Product opportunity | Where it lives in `/demo` |
|---|---|---|
| "What agents exist in my company?" | Agent inventory | `AgentTable` (Agent inventory card) |
| "What tools can each agent use?" | Agent-to-tool access map | `TopToolsChart` + per-agent `tools[]` in `AGENTS` |
| "Which agents can touch email / GitHub / cloud / databases?" | Agent permission graph | `PermissionMatrix` — scopes × Read/Write/Admin |
| "Who approved this agent?" | Approval workflow | `ApprovalsPanel` — pending + decided, with approver |
| "What risks map to NIST / ISO 42001 / SOC 2 / OWASP?" | Compliance mapping | `ComplianceMatrix` — 4 frameworks, 13 controls |
| "Can I show auditors evidence?" | Evidence export | `EvidenceExport` — PDF / CSV / JSON / SOC 2 bundle |
| "Can security see violations in one place?" | Dashboard + SIEM integration | `ViolationsFeed` + `SiemIntegrations` |
| "Can non-developers govern this?" | No-code policy builder | `PolicyBuilder` — plain-language if/and/then rules |
| "Can leadership understand risk?" | Executive reporting | `ExecSummary` — 6 KPIs with 30d deltas |

## New files

Components (`src/components/dashboard/`):

- `ExecSummary.tsx`
- `PermissionMatrix.tsx`
- `ApprovalsPanel.tsx`
- `ComplianceMatrix.tsx`
- `EvidenceExport.tsx` *(client component — fake export, sets local state)*
- `SiemIntegrations.tsx`
- `PolicyBuilder.tsx`

Data (added to `src/lib/mock-data.ts`; types in `src/lib/types.ts`):

- `SCOPE_ACCESS` — derived from `AGENTS[].tools` via `TOOL_SCOPE`. Do not hand-edit.
- `APPROVALS`, `COMPLIANCE_CONTROLS`, `SIEM_CONNECTORS`, `POLICY_TEMPLATES`, `EXEC_KPIS` — hand-crafted fixtures.

Wiring: `src/app/demo/page.tsx`.

## Layout order

1. RiskBanner
2. ExecSummary *(new)*
3. MetricCards
4. High-risk agents · Risk by category
5. Recently discovered agents · Policy violations
6. Agent inventory
7. Permission graph *(new)* · Approval workflow *(new)*
8. Compliance mapping *(new)* · Evidence export *(new)*
9. Top tools chart
10. Policy builder *(new)* · SIEM & integrations *(new)* — both collapsed by default

## Known limitations / next moves

- `EvidenceExport` is visual only. Wire to a server action before any prospect demo where they'll actually click it.
- `PermissionMatrix` cells are not clickable yet — obvious next interaction is filter `AgentTable` by scope+level.
- `Payroll / HR` scope is intentionally zero — it dramatizes a coverage gap. Remove the row or add a Workday tool if it lands flat in demos.
- `PolicyBuilder` checkboxes are uncontrolled; toggling does not persist.
- `ComplianceMatrix` evidence counts are static. When real, link rows to a per-control evidence drawer.
- All numbers are seeded in `mock-data.ts`. The `reconcileCount` helpers pin `METRICS` totals — change with care.

## Sanity check

```bash
npx tsc --noEmit            # clean as of this handoff
npm run dev                  # then visit http://localhost:3000/demo
```
