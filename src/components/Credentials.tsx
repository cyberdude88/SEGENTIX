import Section from "./Section";

const certs = [
  "CISSP",
  "CISM",
  "CompTIA SecurityX",
  "CompTIA PenTest+",
  "CompTIA CySA+",
  "CompTIA Security+",
  "CC (ISC2)",
  "Secure Infrastructure Expert (CSIE)",
  "Security Analytics Expert (CSAE)",
  "Network Security Professional (CNSP)",
];

const stats = [
  { k: "10+", v: "years leading security operations" },
  { k: "$1.2M", v: "asset inventory under management" },
  { k: "100+", v: "endpoints recovered under one program" },
  { k: "6+", v: "orgs with validated bug bounty findings" },
];

export default function Credentials() {
  return (
    <Section
      id="credentials"
      eyebrow="CLEARANCE · CERTS · CRED"
      title="ATS-clearing alphabet soup. All of it earned, all of it defensible."
    >
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <div className="mono text-xs text-fg-dim uppercase tracking-[0.3em] mb-4">
            ▸ Clearance
          </div>
          <div className="border border-accent/30 p-6 bg-bg-soft/40 relative">
            <div className="hud-corner tl" />
            <div className="hud-corner br" />
            <div className="text-2xl font-semibold text-accent mb-2">
              Active U.S. Secret · NATO Secret
            </div>
            <p className="text-fg-dim text-sm">
              Both current and immediately transferable. DoD 8140 compliant.
              U.S. Citizen.
            </p>
          </div>

          <div className="mono text-xs text-fg-dim uppercase tracking-[0.3em] mt-10 mb-4">
            ▸ Education
          </div>
          <ul className="space-y-2 text-sm text-fg-dim">
            <li>
              <span className="text-accent mr-2">▸</span>
              M.S. Cybersecurity &amp; Information Assurance — WGU
            </li>
            <li>
              <span className="text-accent mr-2">▸</span>
              B.S. Public Safety &amp; Emergency Management — GCU
            </li>
            <li>
              <span className="text-accent mr-2">▸</span>
              Bilingual: English / French
            </li>
          </ul>
        </div>

        <div>
          <div className="mono text-xs text-fg-dim uppercase tracking-[0.3em] mb-4">
            ▸ Certifications
          </div>
          <div className="flex flex-wrap gap-2 mb-10">
            {certs.map((c) => (
              <span
                key={c}
                className="mono text-xs border border-accent/30 px-3 py-1.5 text-fg-dim hover:text-accent hover:border-accent transition-colors"
              >
                {c}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div key={s.v} className="border-l-2 border-accent/60 pl-4">
                <div className="text-3xl font-semibold text-accent">{s.k}</div>
                <div className="mono text-xs text-fg-dim mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
