import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";
import type { Agent } from "@/lib/types";

export default function HighRiskPanel({ agents }: { agents: Agent[] }) {
  return (
    <ul className="divide-y divide-line-subtle">
      {agents.map((a) => (
        <li key={a.id}>
          <Link
            href={`/agents?focus=${a.id}`}
            className="flex items-center gap-3 px-5 py-3 hover:bg-surface-1 transition-colors"
          >
            <Avatar name={a.name} tone="danger" />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-medium truncate">{a.name}</div>
              <div className="text-[11px] text-fg-muted truncate">
                {a.platform} · {a.environment} · {timeAgo(a.lastActiveAt)}
              </div>
            </div>
            <Badge variant="high" dot>
              High
            </Badge>
            <ChevronRight size={14} className="text-fg-subtle ml-1" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
