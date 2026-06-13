import Section from "./Section";

const projects = [
  {
    name: "Agent RMF Overlay",
    blurb:
      "Open mapping corpus that crosswalks OWASP Agentic AI risks to NIST 800-53, CNSSI 1253, and CMMC practices for regulated agent deployments.",
    stack: ["OWASP Agentic", "NIST 800-53", "CNSSI 1253", "CMMC"],
  },
  {
    name: "Evidence Export",
    blurb:
      "ATO-ready export path for POA&M rows, SAR-style findings, control implementation statements, and continuous-monitoring snapshots.",
    stack: ["POA&M", "SAR findings", "eMASS-ready"],
  },
  {
    name: "Skill Registry",
    blurb:
      "Governance layer for Skills and instruction-sets: version hashes, owners, approval state, expiry, capability scope, and autonomy budgets.",
    stack: ["Version pinning", "Allowlists", "Audit log"],
  },
  {
    name: "Air-Gap Package",
    blurb:
      "Local-first deployment model with file-based ingest, deterministic evidence output, bundled mappings, and no outbound telemetry.",
    stack: ["Single binary", "Container", "No phone-home"],
  },
  {
    name: "Agent Disposal Workflow",
    blurb:
      "RMF disposal-state evidence for revoking access, rotating secrets, removing model artifacts, archiving logs, and filing disposition statements.",
    stack: ["RMF lifecycle", "Secrets rotation", "Disposition evidence"],
  },
];

export default function Work() {
  return (
    <Section
      id="work"
      eyebrow="PRODUCT THREADS"
      title="The governance layer auditors can actually inspect."
    >
      <div className="space-y-px">
        {projects.map((p, i) => (
          <article
            key={p.name}
            className="group relative grid grid-cols-12 gap-8 border-t border-accent/10 py-8 transition-colors hover:bg-accent/[0.03]"
          >
            <div className="col-span-12 md:col-span-2">
              <div className="mono text-xs text-accent">
                {String(i + 1).padStart(2, "0")}
              </div>
            </div>
            <div className="col-span-12 md:col-span-6">
              <h3 className="text-2xl font-semibold mb-2 group-hover:text-accent transition-colors">
                {p.name}
              </h3>
              <p className="text-fg-dim text-sm leading-relaxed">{p.blurb}</p>
            </div>
            <div className="col-span-12 md:col-span-4">
              <ul className="mono text-xs text-fg-dim space-y-1">
                {p.stack.map((t) => (
                  <li key={t}>
                    <span className="text-accent mr-2">▸</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
