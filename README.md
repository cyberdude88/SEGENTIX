# SEGENTIX — Agent Governance Landing Page

SEGENTIX is the AI agent permission and risk analysis workspace for regulated, classified, sovereign, and air-gapped environments.

## Positioning

ATO automation is the first packaged outcome, but the broader vision is an
RMF-native governance layer for AI agents: inventory, action mapping, Skill
governance, control evidence, disposal records, and audit-ready artifacts for
environments where SaaS cannot go.

Core promise:

> Discover every agent. Map every action to a control. Generate the evidence. Walk into the audit ready.

See [`STRATEGY.md`](./STRATEGY.md) for the CEO-level market strategy and
vision. See [`MISSION.md`](./MISSION.md) for the product objectives and
implementation functions.

Audience:

- DoD programs
- CMMC-bound contractors
- EU / NATO-adjacent organizations
- Regulated environments where SaaS cannot deploy

## Current Experience

`src/app/page.tsx` renders:

- `Stage` — full-screen snap-scroll hero sequence for SEGENTIX product messaging
- `Services` — product-surface area using a kinetic carousel on mobile/tablet and a traversable 3D word cloud on desktop
- footer

Visual system:

- SOC-style video background
- scanline, grain, HUD corners, and grid overlays
- snap-scroll stage choreography
- desktop 3D label cloud and camera fly-in
- mobile horizontal carousel

## Active Copy Map

Hero moments in `src/components/Stage.tsx`:

| # | Tag | Title | One-liner |
|---|---|---|---|
| 00 | SEGENTIX | SEGENTIX | Agent governance and ATO automation for regulated environments. |
| 01 | DISCOVERY | Discover Every Agent | Inventory agents across cloud, SaaS, custom workflows, and local enclaves. |
| 02 | CONTROL MAP | Map Actions To Controls | Translate tool access into NIST 800-53, CNSSI 1253, CMMC, and RMF evidence. |
| 03 | SKILLS | Govern Instruction Sets | Version, allowlist, and budget the Skill layer commercial tooling cannot observe. |
| 04 | EVIDENCE | Generate The Binder | Produce POA&Ms, SAR-style findings, and eMASS-ready artifacts. |
| 05 | AIR GAP | Deploy Inside The Enclave | Single binary or container. No telemetry. No phone-home. |
| 06 | RMF | Walk Into Audit Ready | Discover every agent. Map every action. Generate the evidence. |
| 07 | NDAA 1513 | Built For The Forcing Function | FY2026 AI security requirements are coming for DoD programs and CMMC contractors. |
| 08 | ESTABLISH LINK | Request Pilot Access | hello@segentix.dev |

Product surfaces in `src/components/Services.tsx`:

- Agent Discovery
- Control Mapping
- Skill Governance
- Evidence Export
- Enclave Deployment
- RMF Workflow
- Pilot Readiness

## Stack

- Next.js 16 App Router + React 19
- TypeScript
- Tailwind v4
- React Three Fiber + `@react-three/drei`
- `requestAnimationFrame` scroll choreography in `Stage.tsx`
- `ffmpeg`-generated background video assets

## Run

```bash
npm run dev
npm run build
npm start
```

Default local URL:

```text
http://localhost:3000
```

If port 3000 is occupied, run on another port:

```bash
npm run dev -- --port 3001
```

## Project Layout

```text
src/
  app/
    layout.tsx          # metadata, fonts
    page.tsx            # Stage + Services + footer
    globals.css         # visual system and motion styles
  components/
    Stage.tsx           # snap-scroll SEGENTIX hero
    Services.tsx        # mobile carousel + desktop 3D word cloud
    SignalParallax.tsx  # 3D background canvas + camera rig + labels
public/
  hero-bg-yoyo.mp4      # active looped SOC-style background
  hero-bg.mp4           # background asset/fallback
  hero-bg-last.jpg      # still image fallback/reference
legacy-segentix/
  ...                   # earlier SEGENTIX prototype, preserved for reference
```

## Copy Rules

- Product name: `SEGENTIX`
- Prototype label: `v0.1`
- Footer format: `SEGENTIX — v0.1 prototype`
- Demo CTA: `Open the demo`
- Audit promise: `Walk into the audit ready`
- Avoid named competitor callouts in public page copy.

## Verification

Useful checks:

```bash
npm run build
curl -I http://localhost:3000
```
