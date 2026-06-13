"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import type { AccessScope, ScopeAccess } from "@/lib/types";
import { cn } from "@/lib/utils";

type AccessLevel = "read" | "write" | "execute" | "user" | "admin";

type SelectedCell = {
  scope: AccessScope;
  level: AccessLevel;
  count: number;
};

const ACCESS_LEVELS: Array<{ key: AccessLevel; label: string }> = [
  { key: "read", label: "Read" },
  { key: "write", label: "Write" },
  { key: "execute", label: "Execute" },
  { key: "user", label: "User" },
  { key: "admin", label: "Admin" },
];

const PEOPLE = [
  "Priya Shah",
  "Marcus Lee",
  "Elena Ortiz",
  "Jordan Whitley",
  "Daniel Park",
  "Naomi Reyes",
  "Yusuf Ahmed",
  "Sofia Bellini",
  "Wen Chen",
  "Hannah Carter",
  "Ravi Iyer",
  "Lukas Becker",
  "Maya Chen",
  "Owen Brooks",
  "Amara Singh",
  "Noah Fischer",
  "Leila Haddad",
  "Ethan Wright",
  "Camila Duarte",
  "Mila Novak",
  "Jonas Weber",
  "Aisha Khan",
  "Iris Morgan",
  "Theo Martin",
  "Sara Lind",
  "Kenji Tanaka",
  "Nora Weiss",
  "Malik Johnson",
  "Eva Rossi",
  "Omar Nasser",
  "Greta Klein",
  "Lina Alvarez",
  "Sam Carter",
  "Anika Patel",
  "Tom Ellis",
  "Claire Dubois",
  "Ivan Petrov",
];

const AGENT_PREFIXES = [
  "Atlas",
  "Echo",
  "Nimbus",
  "Sentinel",
  "Pulse",
  "Helix",
  "Cobalt",
  "Vector",
  "Orbit",
  "Beacon",
  "Cipher",
  "Forge",
];

const AGENT_SUFFIXES = [
  "Ops",
  "Triage",
  "Concierge",
  "Sync",
  "Router",
  "Auditor",
  "Drafter",
  "Reviewer",
  "Closer",
  "Scout",
  "Resolver",
  "Assist",
];

function cell(n: number) {
  if (n === 0) return "bg-surface-2/40 text-fg-subtle";
  if (n < 5) return "bg-accent/10 text-accent";
  if (n < 15) return "bg-info-soft text-info";
  if (n < 30) return "bg-warn-soft text-warn";
  return "bg-danger-soft text-danger";
}

export default function PermissionMatrix({ data }: { data: ScopeAccess[] }) {
  const [selected, setSelected] = useState<SelectedCell | null>(null);

  useEffect(() => {
    if (!selected) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  return (
    <div className="px-5 py-4">
      <div className="grid grid-cols-[1fr_repeat(5,56px)] gap-2 text-[11px]">
        <div className="mono uppercase tracking-[0.18em] text-fg-subtle text-[10px]">
          Scope
        </div>
        {ACCESS_LEVELS.map(({ key, label }) => (
          <div
            key={key}
            className="mono uppercase tracking-[0.18em] text-fg-subtle text-[10px] text-right"
          >
            {label}
          </div>
        ))}
        {data.map((row) => (
          <ScopeRow key={row.scope} row={row} onSelect={setSelected} />
        ))}
      </div>
      <div className="mono mt-4 text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
        Agents per scope x access level · click a cell to inspect identities
      </div>
      {selected ? (
        <AccessDialog selected={selected} onClose={() => setSelected(null)} />
      ) : null}
    </div>
  );
}

function ScopeRow({
  row,
  onSelect,
}: {
  row: ScopeAccess;
  onSelect: (cell: SelectedCell) => void;
}) {
  return (
    <>
      <div className="self-center text-fg-muted">{row.scope}</div>
      {ACCESS_LEVELS.map(({ key, label }) => {
        const count = row[key];

        return (
          <button
            key={key}
            type="button"
            disabled={count === 0}
            aria-label={`${count} ${label} identities for ${row.scope}`}
            onClick={() => onSelect({ scope: row.scope, level: key, count })}
            className={cn(
              "mono min-h-8 border border-line-subtle px-2 py-1.5 text-right text-[12px] tabular-nums transition",
              count > 0
                ? "cursor-pointer hover:border-accent-ring hover:bg-accent-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                : "cursor-default",
              cell(count),
            )}
          >
            {count}
          </button>
        );
      })}
    </>
  );
}

function AccessDialog({
  selected,
  onClose,
}: {
  selected: SelectedCell;
  onClose: () => void;
}) {
  const identities = useMemo(() => buildIdentities(selected), [selected]);
  const label = ACCESS_LEVELS.find((level) => level.key === selected.level)!.label;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/70 px-4 py-6 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="access-dialog-title"
        className="w-full max-w-2xl overflow-hidden rounded-lg border border-line bg-bg-card shadow-2xl shadow-black/40"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line-subtle px-5 py-4">
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
              {selected.scope} · {label}
            </div>
            <h3 id="access-dialog-title" className="mt-1 text-lg font-semibold text-fg">
              {selected.count} synthetic identities with access
            </h3>
          </div>
          <button
            type="button"
            aria-label="Close access identities"
            onClick={onClose}
            className="inline-flex size-8 items-center justify-center rounded-md border border-line-subtle text-fg-muted transition hover:border-line-strong hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-[12px]">
            <thead className="sticky top-0 bg-bg-elevated text-[10px] uppercase tracking-[0.16em] text-fg-subtle">
              <tr>
                <th className="px-5 py-3 font-medium">Who</th>
                <th className="px-4 py-3 font-medium">Agent</th>
                <th className="px-4 py-3 font-medium">Account</th>
                <th className="px-4 py-3 text-right font-medium">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-subtle">
              {identities.map((identity) => (
                <tr key={identity.id} className="hover:bg-surface-1">
                  <td className="px-5 py-3">
                    <div className="font-medium text-fg">{identity.name}</div>
                    <div className="mono mt-0.5 text-[10px] text-fg-subtle">
                      {identity.email}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-fg-muted">{identity.agent}</td>
                  <td className="mono px-4 py-3 text-[11px] text-fg-muted">
                    {identity.account}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={cn(
                        "mono rounded border px-2 py-1 text-[10px] uppercase tracking-[0.14em]",
                        identity.risk === "High" &&
                          "border-danger/30 bg-danger-soft text-danger",
                        identity.risk === "Medium" &&
                          "border-warn/30 bg-warn-soft text-warn",
                        identity.risk === "Low" &&
                          "border-accent/25 bg-accent/10 text-accent",
                      )}
                    >
                      {identity.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function buildIdentities(selected: SelectedCell) {
  const seed = hash(`${selected.scope}:${selected.level}:${selected.count}`);

  return Array.from({ length: selected.count }, (_, index) => {
    const person = PEOPLE[(seed + index * 7) % PEOPLE.length];
    const emailName = person.toLowerCase().replace(/\s+/g, ".");
    const agent = `${AGENT_PREFIXES[(seed + index) % AGENT_PREFIXES.length]}-${
      AGENT_SUFFIXES[(seed + index * 3) % AGENT_SUFFIXES.length]
    }-${String(((seed + index * 11) % 89) + 1).padStart(2, "0")}`;
    const risk =
      selected.level === "admin" || selected.level === "execute"
        ? index % 3 === 0
          ? "High"
          : "Medium"
        : index % 5 === 0
          ? "Medium"
          : "Low";

    return {
      id: `${selected.scope}-${selected.level}-${index}`,
      name: person,
      email: `${emailName}@example.corp`,
      agent,
      account: `svc-${slug(selected.scope)}-${String((index % 12) + 1).padStart(
        2,
        "0",
      )}`,
      risk,
    };
  });
}

function hash(value: string) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
