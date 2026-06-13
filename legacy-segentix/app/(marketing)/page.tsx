import Link from "next/link";
import {
  ShieldCheck,
  FileBarChart,
  Boxes,
  Globe2,
  Trash2,
  ArrowRight,
} from "lucide-react";

const gaps = [
  {
    icon: ShieldCheck,
    title: "Regulated, air-gapped, classified",
    body: "SaaS-only competitors won't hit FedRAMP / IL4 / IL5 before 2028. SEGENTIX ships as a single binary or container with zero phone-home — deployable inside the enclave.",
  },
  {
    icon: FileBarChart,
    title: "Audit evidence, not just dashboards",
    body: "Map agent posture to NIST 800-53, CNSSI 1253, CMMC practices, and EU AI Act articles. Generate POA&Ms, SAR-style findings, and eMASS-importable bundles an ISSM can hand the AO.",
  },
  {
    icon: Boxes,
    title: "Govern the Skill / instruction-set layer",
    body: "Skills and instruction-sets load invisibly into model context — a gap the commercial tooling layer has publicly acknowledged it can't observe. Registry, version pinning, allowlist, autonomy budgets, pre-deployment.",
  },
  {
    icon: Globe2,
    title: "EU / NATO sovereignty",
    body: "Data residency, on-soil deployment, sovereign-cloud compatibility. Built for jurisdictions that exclude US-SaaS-only vendors from public-sector and NATO-adjacent deals.",
  },
  {
    icon: Trash2,
    title: "Agent decommissioning",
    body: "RMF disposal phase mandates secure destruction of weights, training data, containers, and secrets. No commercial tool does it. SEGENTIX implements it as a state machine with attested artifacts.",
  },
];

export default function LandingPage() {
  const credibilityStats = [
    {
      label: "FY2026 forcing function",
      value: "NDAA §1513",
    },
    {
      label: "Control crosswalk",
      value: "NIST 800-53 · CNSSI 1253 · CMMC",
    },
    {
      label: "Air-gap, single binary",
      value: "IL4 / IL5 ready",
    },
    {
      label: "Mapped to RMF",
      value: "OWASP Agentic Top 10",
    },
  ];

  return (
    <>
      <section className="relative grid-bg">
        <div className="mx-auto max-w-[1200px] px-5 pt-20 pb-24">
          <div className="inline-flex items-center gap-2 hairline rounded-full px-3 h-7 bg-surface-2 text-[11px] text-fg-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            AI agent permission and risk analysis · v0.1 prototype
          </div>
          <h1 className="mt-6 text-[34px] sm:text-[44px] md:text-[52px] leading-[1.05] tracking-tight font-semibold max-w-[820px]">
            Agent governance and{" "}
            <span className="text-accent">ATO automation</span> for environments
            where SaaS can&apos;t go and auditors must sign.
          </h1>
          <p className="mt-5 text-[15px] sm:text-[16px] text-fg-muted max-w-[680px] leading-relaxed">
            Discover every agent. Map every action to a control. Generate the
            evidence. Walk into the audit ready. Built for DoD programs, CMMC
            contractors, and EU / NATO-adjacent organizations the funded SaaS
            players won&apos;t reach.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 h-10 px-5 rounded-md bg-accent text-black text-[13px] font-medium hover:opacity-90"
            >
              Open the demo
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 h-10 px-4 rounded-md hairline bg-surface-2 text-[13px] text-fg hover:bg-surface-3"
            >
              Read the mission
            </Link>
          </div>

          <dl className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-px hairline rounded-lg overflow-hidden bg-line max-w-[820px]">
            {credibilityStats.map(({ label, value }) => (
              <div key={value} className="bg-bg-base px-4 py-3">
                <dt className="text-[11px] uppercase tracking-wider text-fg-subtle">
                  {label}
                </dt>
                <dd className="mt-1 text-[14px] font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="hairline-t">
        <div className="mx-auto max-w-[1200px] px-5 py-20">
          <div className="max-w-[720px]">
            <div className="text-[11px] uppercase tracking-wider text-fg-subtle">
              The white space
            </div>
            <h2 className="mt-2 text-[26px] sm:text-[30px] tracking-tight font-semibold">
              Five market gaps the funded players haven&apos;t closed.
            </h2>
            <p className="mt-3 text-[14px] text-fg-muted leading-relaxed">
              The funded SaaS players own the commercial posture story. The
              product surface below is where regulated environments need
              something they don&apos;t ship: deployable inside the enclave,
              speaking the language of the audit.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {gaps.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="hairline rounded-lg bg-bg-surface/40 p-5 hover:bg-bg-surface/70 transition"
              >
                <div className="h-8 w-8 rounded-md bg-accent-soft text-accent grid place-items-center">
                  <Icon size={16} />
                </div>
                <h3 className="mt-4 text-[14px] font-semibold tracking-tight">
                  {title}
                </h3>
                <p className="mt-2 text-[13px] text-fg-muted leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hairline-t">
        <div className="mx-auto max-w-[1200px] px-5 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-fg-subtle">
                What ships in the demo
              </div>
              <h2 className="mt-2 text-[26px] sm:text-[30px] tracking-tight font-semibold">
                The dashboard auditors and ISSMs actually want.
              </h2>
              <p className="mt-3 text-[14px] text-fg-muted leading-relaxed">
                Agent inventory, tool / action mapping, risk classification,
                policy enforcement, and shadow-agent detection — expressed as
                RMF artifacts instead of generic posture cards.
              </p>
              <ul className="mt-5 space-y-2.5 text-[13px] text-fg-muted">
                {[
                  "Discovery across cloud, SaaS, custom, and local environments",
                  "Tool actions mapped to R/W/M/D/A risk classes",
                  "Allow / deny policy with audit trail",
                  "Control coverage layered over OWASP Agentic Top 10",
                  "Shadow-agent report with provenance + owner",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="mt-1 h-1 w-1 rounded-full bg-accent shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-7">
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-accent text-black text-[13px] font-medium hover:opacity-90"
                >
                  Open the demo
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="hairline rounded-xl overflow-hidden bg-bg-surface/40">
              <div className="hairline-b h-9 px-3 flex items-center gap-1.5 bg-surface-2">
                <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-warn/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
                <span className="ml-3 text-[11px] text-fg-subtle font-mono">
                  segentix · posture overview
                </span>
              </div>
              <div className="p-5 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    ["Agents", "248"],
                    ["High-risk", "12"],
                    ["Shadow", "37"],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="hairline rounded-md bg-bg-base px-3 py-2.5"
                    >
                      <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
                        {k}
                      </div>
                      <div className="mt-0.5 text-[18px] font-semibold tracking-tight">
                        {v}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="hairline rounded-md bg-bg-base p-3">
                  <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
                    Risk by category
                  </div>
                  <div className="mt-2 space-y-1.5">
                    {(
                      [
                        ["Data exfiltration", 78, "bg-danger"],
                        ["Privilege abuse", 54, "bg-warn"],
                        ["Shadow agent", 41, "bg-warn"],
                        ["Supply chain", 22, "bg-info"],
                      ] as const
                    ).map(([label, w, tone]) => (
                      <div key={label} className="flex items-center gap-2">
                        <div className="w-28 text-[11px] text-fg-muted">
                          {label}
                        </div>
                        <div className="flex-1 h-1.5 rounded-full bg-surface-2 overflow-hidden">
                          <div
                            className={`h-full ${tone}`}
                            style={{ width: `${w}%` }}
                          />
                        </div>
                        <div className="w-8 text-right text-[11px] tabular-nums text-fg-muted">
                          {w}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="hairline rounded-md bg-bg-base p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
                      Recently discovered
                    </div>
                    <span className="text-[10px] text-fg-subtle">live</span>
                  </div>
                  <ul className="mt-2 space-y-1.5 text-[11px]">
                    {[
                      ["copilot-finance-ops", "shadow"],
                      ["claude-research", "tracked"],
                      ["agentforce-support", "tracked"],
                    ].map(([n, tag]) => (
                      <li
                        key={n as string}
                        className="flex items-center justify-between"
                      >
                        <span className="font-mono text-fg-muted">{n}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider ${
                            tag === "shadow"
                              ? "bg-danger-soft text-danger"
                              : "bg-accent-soft text-accent"
                          }`}
                        >
                          {tag}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hairline-t">
        <div className="mx-auto max-w-[1200px] px-5 py-20">
          <div className="hairline rounded-xl p-8 sm:p-12 bg-bg-surface/40">
            <div className="text-[11px] uppercase tracking-wider text-fg-subtle">
              For ISSMs, ISSOs, and program offices
            </div>
            <h2 className="mt-2 text-[24px] sm:text-[28px] tracking-tight font-semibold max-w-[680px]">
              If your agents have to pass an audit, talk to us before the next
              ATO cycle.
            </h2>
            <p className="mt-3 text-[14px] text-fg-muted max-w-[620px] leading-relaxed">
              Early design partners help shape the control-mapping corpus and
              evidence templates. Pilot deployments are on-prem by default.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 h-10 px-5 rounded-md bg-accent text-black text-[13px] font-medium hover:opacity-90"
              >
                Get in touch
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 h-10 px-4 rounded-md hairline bg-surface-2 text-[13px] text-fg hover:bg-surface-3"
              >
                Open the demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
