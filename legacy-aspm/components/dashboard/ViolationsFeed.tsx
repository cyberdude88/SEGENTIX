import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";
import type { PolicyViolation } from "@/lib/types";

export default function ViolationsFeed({
  items,
}: {
  items: PolicyViolation[];
}) {
  return (
    <ul className="divide-y divide-line-subtle">
      {items.map((v) => (
        <li
          key={v.id}
          className="px-5 py-3 flex items-start gap-3"
        >
          <Badge variant={v.policyType === "Deny" ? "high" : "warn"} dot>
            {v.policyType}
          </Badge>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] truncate">
              <span className="text-fg-muted">{v.agent}</span>
              <span className="text-fg-subtle"> attempted </span>
              <span className="font-mono text-[12px]">{v.action}</span>
            </div>
            <div className="text-[11px] text-fg-subtle mt-0.5">
              {timeAgo(v.timestamp)}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
