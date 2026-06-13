"use client";

import { useState } from "react";
import { Download } from "lucide-react";

const formats = ["PDF", "CSV", "JSON", "SOC 2 bundle"] as const;

export default function EvidenceExport() {
  const [busy, setBusy] = useState<string | null>(null);
  const [last, setLast] = useState<string | null>(null);

  function run(fmt: string) {
    setBusy(fmt);
    setTimeout(() => {
      setBusy(null);
      setLast(`${fmt} · ${new Date().toLocaleTimeString()}`);
    }, 900);
  }

  return (
    <div className="px-5 py-4">
      <div className="mb-3 text-[12px] text-fg-muted">
        Snapshot all agents, policies, approvals, and compliance evidence into
        an auditor-ready bundle.
      </div>
      <div className="flex flex-wrap gap-2">
        {formats.map((f) => (
          <button
            key={f}
            onClick={() => run(f)}
            disabled={busy !== null}
            className="mono inline-flex items-center gap-2 border border-accent/40 bg-transparent px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-accent transition-colors hover:border-accent hover:bg-accent/10 disabled:opacity-50"
          >
            <Download size={12} />
            {busy === f ? "exporting…" : f}
          </button>
        ))}
      </div>
      <div className="mono mt-3 text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
        last export · {last ?? "2026-06-12 08:14 — SOC 2 bundle · Hannah Carter"}
      </div>
    </div>
  );
}
