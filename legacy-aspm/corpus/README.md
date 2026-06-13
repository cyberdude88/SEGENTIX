# ASPM Mapping Corpus

The canonical mapping table from agent-security threat catalogs (OWASP
Agentic AI Top 10, OWASP LLM Top 10) to compliance frameworks
(NIST 800-53 Rev. 5, CNSSI 1253, CMMC L2, EU AI Act).

This directory is the **content asset** behind F1 (Control Mapping Engine)
and F6 (Public RMF Overlay) in [`../MISSION.md`](../MISSION.md). The same
YAML is consumed at build time by the engine and published under a
permissive license as the overlay.

The moat is the validated mappings, not the engine. Authoring quality
compounds; bad authoring tools sink the asset. Hence F7
(`scripts/validate-corpus.ts`) gates every change.

---

## Layout

```
corpus/
  README.md            this file
  frameworks.yaml      registry: known frameworks + control IDs
  mappings/
    owasp-agentic.yaml ASI01–ASI10 mappings
    owasp-llm.yaml     subset of LLM01–LLM10 mappings
```

Mapping files are plain YAML with a top-level `mappings:` list. Split or
merge however reads best — the validator does not care about file layout,
only about uniqueness of `mapping.id` across the whole tree.

---

## Authoring a mapping

```yaml
- id: asi02-tool-misuse          # kebab-case, globally unique
  source:
    framework: owasp-agentic-top-10
    id: ASI02
    name: Tool Misuse            # advisory; may lag the canonical source
  description: |
    Free-text statement of the threat in operator language.
  targets:
    - framework: nist-800-53
      control: AC-3
      relationship: satisfies     # satisfies | partially-satisfies | informs | supports
      notes: Tool-level allow/deny is the access enforcement boundary.
    - framework: cmmc-l2
      control: AC.L2-3.1.5
      relationship: satisfies
  status: draft                   # draft | reviewed | published
  review_notes: |
    Optional — capture review history, dissent, outstanding questions.
```

### Relationship semantics

| Relationship | Meaning |
|---|---|
| `satisfies` | The mitigation for the threat fully meets the control's intent. |
| `partially-satisfies` | The mitigation meets some but not all of the control's intent; other controls or compensating measures are needed. |
| `informs` | The threat is relevant to the control's intent but the mapping is interpretive, not direct. |
| `supports` | The control is a detective/oversight complement, not the primary mitigation. |

### Status lifecycle

- `draft` — authored, not yet reviewed. Default for new entries.
- `reviewed` — at least one ISSM/ISSO or named external reviewer has
  walked the mapping and accepted it. Capture who in `review_notes:`.
- `published` — included in a versioned overlay release. Only the release
  tooling moves entries into `published`; do not set it by hand in a PR.

`npm run validate-corpus -- --strict` fails if any mapping is still draft,
so use strict mode in release gates.

---

## Validating

```bash
npm install
npm run validate-corpus           # warnings allowed
npm run validate-corpus --strict  # release gate; no warnings, no drafts
```

The validator checks:

- YAML structure conforms to the schema in `scripts/validate-corpus.ts`.
- Every `mapping.id` is unique across all files.
- Every `source.framework` / `target.framework` is in
  `frameworks.yaml`.
- Every `source.id` / `target.control` is in that framework's
  `controls:` list — unless the framework's list is empty, in which case
  the framework is treated as unconstrained (used while a framework is
  being seeded; CNSSI 1253 is in that state today).
- No duplicate `(framework, control)` pairs inside a single mapping's
  `targets`.

Reported (warnings only, by default):

- Orphan controls — IDs registered in `frameworks.yaml` that no mapping
  cites. Often legitimate; the registry is allowed to be broader than
  current coverage.

---

## Scope today

| Framework | Coverage |
|---|---|
| OWASP Agentic Top 10 | All 10 (ASI01–ASI10), draft |
| OWASP LLM Top 10 | LLM01, LLM03, LLM06, LLM07 (posture-layer relevant), draft |
| NIST 800-53 Rev. 5 | Subset of controls referenced by current mappings |
| CMMC L2 | Subset of practices referenced by current mappings |
| EU AI Act | Articles 9, 10, 12, 13, 14, 15 registered; cited from ASI07, ASI10 |
| CNSSI 1253 | Registered, control list deferred (treated as 800-53 overlay) |

Out of scope until further notice:

- ISO 42001, ISO 27001 — separate corpus pass when there is reviewer
  capacity.
- Sectoral overlays (HIPAA, FedRAMP-specific divergences). FedRAMP is
  largely 800-53 with a defined baseline; capture only where it diverges.

---

## Attribution and licensing

OWASP threat catalog IDs and names belong to the OWASP Foundation under
CC BY-SA 4.0. NIST 800-53 control catalog is public domain. CMMC practice
IDs are DoD-authored. EU AI Act article numbering is Regulation
(EU) 2024/1689.

When this corpus is published as the Agent RMF Overlay (F6), the
mappings — i.e., the relationship statements joining these catalogs — are
licensed under CC BY 4.0 with attribution to the ASPM project.
