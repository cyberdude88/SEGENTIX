import { EyeOff, FileBarChart, ListChecks, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ShadowByBuChart from "@/components/reports/ShadowByBuChart";
import CoverageLayers from "@/components/reports/CoverageLayers";
import {
  METRICS,
  SHADOW_BY_BU,
  SHADOW_TOP_PLATFORMS,
} from "@/lib/mock-data";

const recommended = [
  "Assign owners to all 14 unregistered agents within 5 business days.",
  "Revoke unapproved tools — start with the 6 Salesforce Agentforce instances.",
  "Enforce registration policy at the Entra app-registration boundary.",
  "Add Slack + n8n workspace audit jobs to the discovery scanner.",
  "Quarantine shadow agents in Production until reviewed.",
];

export default function ReportsPage() {
  return (
    <div className="px-4 md:px-6 py-5 max-w-[1440px] mx-auto space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Reports</h1>
          <p className="text-[12px] text-fg-muted">
            Shadow AI exposure, coverage map, and posture trend reports.
          </p>
        </div>
        <span className="text-[11px] text-fg-subtle hidden md:inline">
          Generated 2026-06-12
        </span>
      </div>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <EyeOff size={14} className="text-warn" />
          <h2 className="text-[13px] font-medium tracking-tight">Shadow AI</h2>
          <Badge variant="warn">Live</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-[11px] text-fg-muted">
                <TrendingUp size={12} className="text-warn" />
                Total shadow agents this month
              </div>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="text-3xl font-semibold tabular-nums">
                  {METRICS.shadow}
                </span>
                <span className="text-[12px] text-warn">
                  +{METRICS.shadowTrend} this week
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Platforms with most shadow activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {SHADOW_TOP_PLATFORMS.map((p) => {
                  const pct =
                    (p.count /
                      Math.max(
                        ...SHADOW_TOP_PLATFORMS.map((x) => x.count),
                      )) *
                    100;
                  return (
                    <li
                      key={p.platform}
                      className="grid grid-cols-[160px_1fr_40px] items-center gap-3"
                    >
                      <span className="text-[12px] text-fg-muted">
                        {p.platform}
                      </span>
                      <span className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
                        <span
                          className="block h-full bg-danger/80"
                          style={{ width: `${pct}%` }}
                        />
                      </span>
                      <span className="text-[12px] text-fg tabular-nums text-right">
                        {p.count}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Shadow vs registered agents by business unit</CardTitle>
              <span className="text-[11px] text-fg-subtle">All environments</span>
            </CardHeader>
            <CardContent>
              <ShadowByBuChart data={SHADOW_BY_BU} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <span className="inline-flex items-center gap-2">
                  <ListChecks size={13} className="text-accent" />
                  Recommended actions
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2.5 text-[12px]">
                {recommended.map((r, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="h-5 w-5 shrink-0 rounded-md bg-accent-soft text-accent text-[10px] grid place-items-center font-medium">
                      {i + 1}
                    </span>
                    <span className="text-fg-muted leading-snug pt-0.5">
                      {r}
                    </span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <FileBarChart size={14} className="text-info" />
          <h2 className="text-[13px] font-medium tracking-tight">
            Coverage layers
          </h2>
          <Badge variant="info">OWASP LLM Top 10 + ASI</Badge>
        </div>
        <p className="text-[12px] text-fg-muted -mt-1">
          SEGENTIX's posture layer is active. Runtime gateway and behavioral
          analytics complete coverage across LLM01–LLM10 and ASI01–ASI10.
        </p>
        <CoverageLayers />
      </section>

      <section className="space-y-3 pt-2">
        <h2 className="text-[13px] font-medium tracking-tight">More reports</h2>
        <Card>
          <CardContent className="py-10 text-center">
            <div className="text-[13px] text-fg-muted">
              Posture trends, entitlement drift, and dormant-agent audits
            </div>
            <div className="text-[11px] text-fg-subtle mt-1">Coming soon</div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
