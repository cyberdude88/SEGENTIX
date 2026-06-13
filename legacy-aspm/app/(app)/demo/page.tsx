import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RiskBanner from "@/components/dashboard/RiskBanner";
import MetricCards from "@/components/dashboard/MetricCards";
import HighRiskPanel from "@/components/dashboard/HighRiskPanel";
import RiskChart from "@/components/dashboard/RiskChart";
import AgentTable from "@/components/dashboard/AgentTable";
import ViolationsFeed from "@/components/dashboard/ViolationsFeed";
import TopToolsChart from "@/components/dashboard/TopToolsChart";
import DiscoveriesFeed from "@/components/dashboard/DiscoveriesFeed";
import SectionHeader from "@/components/dashboard/SectionHeader";
import {
  AGENTS,
  DISCOVERIES,
  HIGH_RISK_AGENTS,
  METRICS,
  OVERALL_RISK,
  RISK_BY_CATEGORY,
  TOP_TOOLS,
  VIOLATIONS,
} from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="px-4 md:px-6 py-5 space-y-4 max-w-[1440px] mx-auto">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            Posture overview
          </h1>
          <p className="text-[12px] text-fg-muted">
            Discovery, privilege mapping, and policy enforcement across every
            registered and shadow agent.
          </p>
        </div>
        <span className="text-[11px] text-fg-subtle hidden md:inline">
          Last sync · 2m ago
        </span>
      </div>

      <RiskBanner level={OVERALL_RISK} shadowCount={METRICS.shadow} />

      <MetricCards metrics={METRICS} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>High-risk agents</CardTitle>
            <span className="text-[11px] text-fg-subtle">
              {METRICS.highRisk} total
            </span>
          </CardHeader>
          <HighRiskPanel agents={HIGH_RISK_AGENTS} />
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Risk by category</CardTitle>
            <span className="text-[11px] text-fg-subtle">All agents</span>
          </CardHeader>
          <CardContent>
            <RiskChart data={RISK_BY_CATEGORY} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recently discovered agents</CardTitle>
            <span className="text-[11px] text-fg-subtle">Live feed</span>
          </CardHeader>
          <DiscoveriesFeed items={DISCOVERIES} />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Policy violations</CardTitle>
            <span className="text-[11px] text-fg-subtle">Last 24h</span>
          </CardHeader>
          <ViolationsFeed items={VIOLATIONS} />
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Agent inventory</CardTitle>
            <p className="text-[11px] text-fg-muted mt-0.5">
              Top {Math.min(12, AGENTS.length)} of {AGENTS.length} — open the
              Agents page for full filtering.
            </p>
          </div>
          <SectionHeader title="" action={{ label: "View all", href: "/agents" }} />
        </CardHeader>
        <AgentTable agents={AGENTS} limit={12} />
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top tools by agent count</CardTitle>
          <span className="text-[11px] text-fg-subtle">
            Tool reach across the fleet
          </span>
        </CardHeader>
        <CardContent>
          <TopToolsChart data={TOP_TOOLS} />
        </CardContent>
      </Card>
    </div>
  );
}
