import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { cn, timeAgo } from "@/lib/utils";
import type { Agent } from "@/lib/types";

function originBadge(origin: Agent["origin"]) {
  if (origin === "Shadow") return <Badge variant="shadow">Shadow</Badge>;
  if (origin === "Discovered") return <Badge variant="info">Discovered</Badge>;
  return <Badge variant="neutral">Registered</Badge>;
}

function riskBadge(level: Agent["risk"]) {
  if (level === "High") return <Badge variant="high" dot>High</Badge>;
  if (level === "Medium") return <Badge variant="medium" dot>Medium</Badge>;
  return <Badge variant="low" dot>Low</Badge>;
}

export default function AgentTable({
  agents,
  limit,
}: {
  agents: Agent[];
  limit?: number;
}) {
  const rows = limit ? agents.slice(0, limit) : agents;
  return (
    <div className="overflow-x-auto">
      <Table>
        <THead>
          <TR className="hover:bg-transparent">
            <TH>Agent</TH>
            <TH>Platform</TH>
            <TH>Owner</TH>
            <TH>Origin</TH>
            <TH>Tools</TH>
            <TH>Last active</TH>
            <TH className="text-right">Risk</TH>
          </TR>
        </THead>
        <TBody>
          {rows.map((a) => (
            <TR
              key={a.id}
              className={cn(
                a.origin === "Shadow" &&
                  "[box-shadow:inset_2px_0_0_0_#E24B4A]",
              )}
            >
              <TD>
                <Link
                  href={`/agents?focus=${a.id}`}
                  className="flex items-center gap-2.5 group"
                >
                  <Avatar
                    name={a.name}
                    tone={
                      a.risk === "High"
                        ? "danger"
                        : a.risk === "Medium"
                          ? "warn"
                          : "accent"
                    }
                  />
                  <div className="min-w-0">
                    <div className="text-fg font-medium group-hover:underline truncate">
                      {a.name}
                    </div>
                    <div className="text-[11px] text-fg-subtle font-mono">
                      {a.id}
                    </div>
                  </div>
                </Link>
              </TD>
              <TD className="text-fg-muted">{a.platform}</TD>
              <TD className="text-fg-muted">
                {a.owner ?? (
                  <span className="text-warn">Unknown</span>
                )}
              </TD>
              <TD>{originBadge(a.origin)}</TD>
              <TD className="text-fg-muted">
                <div className="flex items-center gap-1">
                  <span className="tabular-nums">{a.tools.length}</span>
                  <span className="text-fg-subtle">/</span>
                  <span className="text-fg-subtle text-[11px] truncate max-w-[140px]">
                    {a.tools.map((t) => t.name).join(", ")}
                  </span>
                </div>
              </TD>
              <TD className="text-fg-muted">{timeAgo(a.lastActiveAt)}</TD>
              <TD className="text-right">{riskBadge(a.risk)}</TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
