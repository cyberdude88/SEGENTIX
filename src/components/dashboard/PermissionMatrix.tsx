import type { ScopeAccess } from "@/lib/types";
import { cn } from "@/lib/utils";

function cell(n: number) {
  if (n === 0) return "bg-surface-2/40 text-fg-subtle";
  if (n < 5) return "bg-accent/10 text-accent";
  if (n < 15) return "bg-info-soft text-info";
  if (n < 30) return "bg-warn-soft text-warn";
  return "bg-danger-soft text-danger";
}

export default function PermissionMatrix({ data }: { data: ScopeAccess[] }) {
  return (
    <div className="px-5 py-4">
      <div className="grid grid-cols-[1fr_repeat(5,56px)] gap-2 text-[11px]">
        <div className="mono uppercase tracking-[0.18em] text-fg-subtle text-[10px]">
          Scope
        </div>
        {(["Read", "Write", "Execute", "User", "Admin"] as const).map((h) => (
          <div
            key={h}
            className="mono uppercase tracking-[0.18em] text-fg-subtle text-[10px] text-right"
          >
            {h}
          </div>
        ))}
        {data.map((row) => (
          <ScopeRow key={row.scope} row={row} />
        ))}
      </div>
      <div className="mono mt-4 text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
        Agents per scope × access level · click a cell in production to filter
      </div>
    </div>
  );
}

function ScopeRow({ row }: { row: ScopeAccess }) {
  return (
    <>
      <div className="self-center text-fg-muted">{row.scope}</div>
      {(["read", "write", "execute", "user", "admin"] as const).map((k) => (
        <div
          key={k}
          className={cn(
            "mono border border-line-subtle px-2 py-1.5 text-right text-[12px] tabular-nums",
            cell(row[k]),
          )}
        >
          {row[k]}
        </div>
      ))}
    </>
  );
}
