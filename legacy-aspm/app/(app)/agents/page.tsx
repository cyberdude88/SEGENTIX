"use client";
import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";
import { AGENTS } from "@/lib/mock-data";
import type { Agent } from "@/lib/types";
import AgentFilters, {
  defaultFilters,
  type FilterState,
} from "@/components/agents/AgentFilters";
import AgentDetailPanel from "@/components/agents/AgentDetailPanel";

type SortKey = "name" | "platform" | "owner" | "lastActiveAt" | "risk";

const riskRank: Record<Agent["risk"], number> = { High: 3, Medium: 2, Low: 1 };

function applyFilters(agents: Agent[], f: FilterState) {
  const now = new Date(2026, 5, 12, 9, 41, 0).getTime();
  return agents.filter((a) => {
    if (f.shadowOnly && a.origin !== "Shadow") return false;
    if (f.q) {
      const q = f.q.toLowerCase();
      if (
        !a.name.toLowerCase().includes(q) &&
        !a.platform.toLowerCase().includes(q) &&
        !(a.owner?.toLowerCase().includes(q) ?? false) &&
        !a.tools.some((t) => t.name.toLowerCase().includes(q))
      )
        return false;
    }
    if (f.platform !== "all" && a.platform !== f.platform) return false;
    if (f.risk !== "all" && a.risk !== f.risk) return false;
    if (f.owner !== "all") {
      if (f.owner === "unknown" && a.owner) return false;
      if (f.owner !== "unknown" && a.owner !== f.owner) return false;
    }
    if (f.lastActive !== "all") {
      const diffH =
        (now - new Date(a.lastActiveAt).getTime()) / (1000 * 60 * 60);
      if (f.lastActive === "24h" && diffH > 24) return false;
      if (f.lastActive === "7d" && diffH > 24 * 7) return false;
      if (f.lastActive === "dormant" && diffH < 24 * 30) return false;
    }
    return true;
  });
}

function AgentsContent() {
  const params = useSearchParams();
  const focus = params.get("focus");
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [sortKey, setSortKey] = useState<SortKey>("risk");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<Agent | null>(null);

  useEffect(() => {
    if (focus) {
      const a = AGENTS.find((a) => a.id === focus);
      if (a) setSelected(a);
    }
  }, [focus]);

  const platforms = useMemo(
    () => Array.from(new Set(AGENTS.map((a) => a.platform))).sort(),
    [],
  );
  const owners = useMemo(
    () =>
      Array.from(
        new Set(AGENTS.map((a) => a.owner).filter(Boolean) as string[]),
      ).sort(),
    [],
  );

  const filtered = useMemo(() => applyFilters(AGENTS, filters), [filters]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      let av: string | number = "";
      let bv: string | number = "";
      switch (sortKey) {
        case "name":
          av = a.name.toLowerCase();
          bv = b.name.toLowerCase();
          break;
        case "platform":
          av = a.platform;
          bv = b.platform;
          break;
        case "owner":
          av = a.owner ?? "zzz";
          bv = b.owner ?? "zzz";
          break;
        case "lastActiveAt":
          av = new Date(a.lastActiveAt).getTime();
          bv = new Date(b.lastActiveAt).getTime();
          break;
        case "risk":
          av = riskRank[a.risk];
          bv = riskRank[b.risk];
          break;
      }
      if (av === bv) return 0;
      return (av > bv ? 1 : -1) * (sortDir === "asc" ? 1 : -1);
    });
    return copy;
  }, [filtered, sortKey, sortDir]);

  function header(key: SortKey, label: string, align: "left" | "right" = "left") {
    const active = sortKey === key;
    return (
      <TH
        className={cn(align === "right" && "text-right")}
        onClick={() => {
          if (active) setSortDir(sortDir === "asc" ? "desc" : "asc");
          else {
            setSortKey(key);
            setSortDir("desc");
          }
        }}
        role="button"
      >
        <span className="inline-flex items-center gap-1 cursor-pointer select-none hover:text-fg">
          {label}
          {active &&
            (sortDir === "asc" ? <ArrowUp size={10} /> : <ArrowDown size={10} />)}
        </span>
      </TH>
    );
  }

  return (
    <div className="px-4 md:px-6 py-5 max-w-[1440px] mx-auto">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Agents</h1>
          <p className="text-[12px] text-fg-muted">
            {sorted.length} of {AGENTS.length} agents
            {filters.shadowOnly && " · shadow only"}
          </p>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="shadow">
              {AGENTS.filter((a) => a.origin === "Shadow").length} shadow
            </Badge>
            <Badge variant="info">
              {AGENTS.filter((a) => a.origin === "Discovered").length} discovered
            </Badge>
            <Badge variant="neutral">
              {AGENTS.filter((a) => a.origin === "Registered").length} registered
            </Badge>
          </div>
        </CardHeader>

        <AgentFilters
          value={filters}
          onChange={setFilters}
          platforms={platforms}
          owners={owners}
        />

        <div className="overflow-x-auto">
          <Table>
            <THead>
              <TR className="hover:bg-transparent">
                {header("name", "Agent")}
                {header("platform", "Platform")}
                {header("owner", "Owner")}
                <TH>Origin</TH>
                <TH>Tools</TH>
                <TH>Env</TH>
                {header("lastActiveAt", "Last active")}
                {header("risk", "Risk", "right")}
              </TR>
            </THead>
            <TBody>
              {sorted.map((a) => (
                <TR
                  key={a.id}
                  className={cn(
                    "cursor-pointer",
                    a.origin === "Shadow" &&
                      "[box-shadow:inset_2px_0_0_0_#E24B4A]",
                  )}
                  onClick={() => setSelected(a)}
                >
                  <TD>
                    <div className="flex items-center gap-2.5">
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
                        <div className="text-fg font-medium truncate">
                          {a.name}
                        </div>
                        <div className="text-[11px] text-fg-subtle font-mono">
                          {a.id}
                        </div>
                      </div>
                    </div>
                  </TD>
                  <TD className="text-fg-muted">{a.platform}</TD>
                  <TD className="text-fg-muted">
                    {a.owner ?? <span className="text-warn">Unknown</span>}
                  </TD>
                  <TD>
                    {a.origin === "Shadow" ? (
                      <Badge variant="shadow">Shadow</Badge>
                    ) : a.origin === "Discovered" ? (
                      <Badge variant="info">Discovered</Badge>
                    ) : (
                      <Badge variant="neutral">Registered</Badge>
                    )}
                  </TD>
                  <TD className="text-fg-muted tabular-nums">
                    {a.tools.length}
                  </TD>
                  <TD className="text-fg-muted">{a.environment}</TD>
                  <TD className="text-fg-muted">{timeAgo(a.lastActiveAt)}</TD>
                  <TD className="text-right">
                    <Badge
                      variant={
                        a.risk === "High"
                          ? "high"
                          : a.risk === "Medium"
                            ? "medium"
                            : "low"
                      }
                      dot
                    >
                      {a.risk}
                    </Badge>
                  </TD>
                </TR>
              ))}
              {sorted.length === 0 && (
                <TR className="hover:bg-transparent">
                  <TD colSpan={8}>
                    <div className="py-10 text-center text-fg-muted text-[13px]">
                      No agents match these filters.
                    </div>
                  </TD>
                </TR>
              )}
            </TBody>
          </Table>
        </div>
      </Card>

      <AgentDetailPanel agent={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

export default function AgentsPage() {
  return (
    <Suspense
      fallback={
        <div className="px-4 md:px-6 py-5 text-fg-muted text-sm">Loading…</div>
      }
    >
      <AgentsContent />
    </Suspense>
  );
}
