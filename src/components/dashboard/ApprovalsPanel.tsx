import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";
import type { Approval } from "@/lib/types";

const variant: Record<Approval["status"], "warn" | "low" | "high" | "neutral"> =
  {
    Pending: "warn",
    Approved: "low",
    Rejected: "high",
    Expired: "neutral",
  };

export default function ApprovalsPanel({ items }: { items: Approval[] }) {
  return (
    <ul className="divide-y divide-line-subtle">
      {items.map((a) => (
        <li key={a.id} className="flex items-start gap-3 px-5 py-3">
          <Badge variant={variant[a.status]} dot>
            {a.status}
          </Badge>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px]">
              <span className="text-fg">{a.agent}</span>
              <span className="text-fg-subtle"> · </span>
              <span className="mono text-[11px] uppercase tracking-[0.16em] text-fg-muted">
                {a.scope}
              </span>
            </div>
            <div className="mt-0.5 truncate text-[12px] text-fg-muted">
              {a.justification}
            </div>
            <div className="mono mt-1 flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.16em] text-fg-subtle">
              <span>req · {a.requestedBy}</span>
              <span>
                approver ·{" "}
                <span className={a.approver ? "text-fg-muted" : "text-warn"}>
                  {a.approver ?? "unassigned"}
                </span>
              </span>
              <span>{timeAgo(a.decidedAt ?? a.requestedAt)}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
