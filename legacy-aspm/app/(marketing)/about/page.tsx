export const metadata = {
  title: "About — ASPM",
  description:
    "ASPM is the governance and evidence layer for AI agents in regulated, air-gapped, and sovereign environments.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[820px] px-5 py-20">
      <div className="text-[11px] uppercase tracking-wider text-fg-subtle">
        About
      </div>
      <h1 className="mt-2 text-[36px] sm:text-[44px] tracking-tight font-semibold leading-[1.1]">
        Built for the audits the SaaS players can&apos;t pass.
      </h1>
      <p className="mt-5 text-[15px] text-fg-muted leading-relaxed">
        ASPM is the governance and evidence layer for AI agents in regulated,
        air-gapped, and sovereign environments. Discover every agent. Map every
        action to a control. Generate the evidence. Walk into the audit ready.
      </p>

      <div className="mt-12 space-y-10">
        <Section title="Mission">
          <p>
            Agent governance and ATO automation for environments where SaaS
            can&apos;t go and auditors must sign. The product is a control-
            mapping engine and evidence exporter — not another posture
            dashboard. It maps OWASP Agentic Top 10 findings to NIST 800-53,
            CNSSI 1253, CMMC practices, and EU AI Act articles, then produces
            the binder an ISSM hands the AO.
          </p>
        </Section>

        <Section title="Why now">
          <p>
            FY2026 NDAA §1513 directs DoD to fold AI/ML security into DFARS and
            CMMC. The DoD AI Cybersecurity RMF Tailoring Guide v2 already maps
            MITRE ATLAS threat vectors to CNSSI 1253 controls — including a
            disposal phase requiring secure destruction of model weights,
            training data, and containers. No commercial agent-security vendor
            is architected to serve this requirement.
          </p>
          <p>
            FedRAMP/IL4/IL5 authorization takes years and is economically
            irrational for a SaaS startup chasing Fortune 500 logos. The funded
            SaaS players will not come here before 2028 at the earliest. That
            window is the product.
          </p>
        </Section>

        <Section title="Who it's for">
          <ul className="space-y-2 pl-0 list-none">
            {[
              "DoD program offices and CMMC-bound contractors preparing for the next ATO cycle.",
              "ISSMs and ISSOs who already write POA&Ms by hand and want a generator instead.",
              "EU public-sector and NATO-adjacent organizations with sovereignty and data-residency requirements.",
              "Intel community and IL4/IL5 enclaves where SaaS deployment is structurally excluded.",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span className="mt-2 h-1 w-1 rounded-full bg-accent shrink-0" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="What it isn't">
          <ul className="space-y-2 pl-0 list-none">
            {[
              "Not a runtime MCP traffic gateway — that layer stays on the roadmap as a partnership, not a founder build.",
              "Not a behavioral-analytics or drift-modeling product — different company, different scale.",
              "Not generic multi-tenant SaaS — the air-gap is the wedge, not an afterthought.",
              "Not chasing consumer breadth (n8n and similar) — deferred until the regulated base is paid for.",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span className="mt-2 h-1 w-1 rounded-full bg-fg-subtle shrink-0" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Architecture in one paragraph">
          <p>
            A versioned mapping corpus (YAML, in-repo, published under CC BY
            4.0) is the source of truth. A pure-function engine joins the
            corpus with the agent inventory to produce control coverage. An
            exporter emits reproducible, deterministic evidence bundles —
            POA&M CSVs in the eMASS schema, SAR-style findings, control-
            implementation statements, and disposal attestations. Air-gap by
            construction: no telemetry, no outbound calls, file-based ingest,
            file-based output.
          </p>
        </Section>
      </div>

      <div className="mt-14 hairline rounded-xl p-6 bg-bg-surface/40">
        <div className="text-[14px] font-semibold tracking-tight">
          Prototype scope
        </div>
        <div className="text-[13px] text-fg-muted mt-1">
          The current build covers discovery, risk classification, and policy
          enforcement. The control-mapping engine and evidence exporter ship in
          Phase 1.
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-[18px] font-semibold tracking-tight">{title}</h2>
      <div className="mt-3 text-[14px] text-fg-muted leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  );
}
