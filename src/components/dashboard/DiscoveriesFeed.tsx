import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";
import type { Discovery, OriginBadge } from "@/lib/types";

function originVariant(o: OriginBadge): "teal" | "info" | "shadow" {
  if (o === "IT-approved") return "teal";
  if (o === "Business unit") return "info";
  return "shadow";
}

export default function DiscoveriesFeed({ items }: { items: Discovery[] }) {
  return (
    <ul className="divide-y divide-line-subtle max-h-[420px] overflow-y-auto">
      {items.map((d) => (
        <li key={d.id} className="px-5 py-3 flex items-start gap-3">
          <div className="mt-1">
            <span
              className={`h-1.5 w-1.5 rounded-full block ${
                d.origin === "Shadow AI"
                  ? "bg-danger animate-pulse"
                  : d.origin === "Business unit"
                    ? "bg-info"
                    : "bg-accent"
              }`}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium truncate">{d.name}</span>
              <Badge variant={originVariant(d.origin)}>{d.origin}</Badge>
            </div>
            <div className="text-[11px] text-fg-muted truncate mt-0.5">
              {d.platform} · {d.source}
            </div>
          </div>
          <div className="text-[11px] text-fg-subtle whitespace-nowrap pt-0.5">
            {timeAgo(d.discoveredAt)}
          </div>
        </li>
      ))}
    </ul>
  );
}
