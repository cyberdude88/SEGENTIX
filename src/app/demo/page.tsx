import Link from "next/link";
import { CardContent } from "@/components/ui/card";
import RiskBanner from "@/components/dashboard/RiskBanner";
import HighRiskPanel from "@/components/dashboard/HighRiskPanel";
import RiskChart from "@/components/dashboard/RiskChart";
import AgentTable from "@/components/dashboard/AgentTable";
import ViolationsFeed from "@/components/dashboard/ViolationsFeed";
import TopToolsChart from "@/components/dashboard/TopToolsChart";
import DiscoveriesFeed from "@/components/dashboard/DiscoveriesFeed";
import CollapsibleCard from "@/components/dashboard/CollapsibleCard";
import PermissionMatrix from "@/components/dashboard/PermissionMatrix";
import ApprovalsPanel from "@/components/dashboard/ApprovalsPanel";
import ComplianceMatrix from "@/components/dashboard/ComplianceMatrix";
import EvidenceExport from "@/components/dashboard/EvidenceExport";
import SiemIntegrations from "@/components/dashboard/SiemIntegrations";
import PolicyBuilder from "@/components/dashboard/PolicyBuilder";
import SelfHealing, {
  SELF_HEALING_INCIDENTS,
} from "@/components/dashboard/SelfHealing";
import ExecSummary from "@/components/dashboard/ExecSummary";
import DemoShell, { type DemoSectionId } from "@/components/dashboard/DemoShell";
import {
  AGENTS,
  APPROVALS,
  COMPLIANCE_CONTROLS,
  DISCOVERIES,
  EXEC_KPIS,
  HIGH_RISK_AGENTS,
  METRICS,
  OVERALL_RISK,
  POLICY_TEMPLATES,
  RISK_BY_CATEGORY,
  SCOPE_ACCESS,
  SIEM_CONNECTORS,
  TOP_TOOLS,
  VIOLATIONS,
} from "@/lib/mock-data";

export default function DashboardPage() {
  const sections: Record<DemoSectionId, React.ReactNode> = {
    overview: (
      <div className="space-y-4">
        <RiskBanner level={OVERALL_RISK} shadowCount={METRICS.shadow} />
        <CollapsibleCard
          title="Executive summary"
          meta="Board-ready KPIs · 30d trend"
        >
          <ExecSummary kpis={EXEC_KPIS} />
        </CollapsibleCard>
      </div>
    ),
    risk: (
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <CollapsibleCard
          className="lg:col-span-1"
          title="High-risk agents"
          meta={`${METRICS.highRisk} total`}
        >
          <HighRiskPanel agents={HIGH_RISK_AGENTS} />
        </CollapsibleCard>
        <CollapsibleCard
          className="lg:col-span-2"
          title="Risk by category"
          meta="All agents"
        >
          <CardContent>
            <RiskChart data={RISK_BY_CATEGORY} />
          </CardContent>
        </CollapsibleCard>
      </div>
    ),
    discovery: (
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <CollapsibleCard
          className="lg:col-span-2"
          title="Recently discovered agents"
          meta="Live feed"
        >
          <DiscoveriesFeed items={DISCOVERIES} />
        </CollapsibleCard>
        <CollapsibleCard title="Policy violations" meta="Last 24h">
          <ViolationsFeed items={VIOLATIONS} />
        </CollapsibleCard>
      </div>
    ),
    inventory: (
      <CollapsibleCard
        title="Agent inventory"
        meta={`${AGENTS.length} agents`}
        action={
          <Link
            href="/agents"
            className="inline-flex items-center gap-1 text-[12px] text-fg-muted hover:text-fg"
          >
            View all
          </Link>
        }
      >
        <AgentTable agents={AGENTS} />
      </CollapsibleCard>
    ),
    access: (
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <CollapsibleCard
          className="lg:col-span-2"
          title="Permission graph"
          meta="Agents × scope × access level"
        >
          <PermissionMatrix data={SCOPE_ACCESS} />
        </CollapsibleCard>
        <CollapsibleCard
          title="Approval workflow"
          meta={`${APPROVALS.filter((a) => a.status === "Pending").length} pending`}
        >
          <ApprovalsPanel items={APPROVALS} />
        </CollapsibleCard>
      </div>
    ),
    compliance: (
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <CollapsibleCard
          className="lg:col-span-2"
          title="Compliance mapping"
          meta="NIST AI RMF · ISO 42001 · SOC 2 · OWASP LLM"
        >
          <ComplianceMatrix controls={COMPLIANCE_CONTROLS} />
        </CollapsibleCard>
        <CollapsibleCard title="Evidence export" meta="Auditor-ready">
          <EvidenceExport />
        </CollapsibleCard>
      </div>
    ),
    tools: (
      <CollapsibleCard
        title="Top tools by agent count"
        meta="Click a tool to see the agents that use it"
      >
        <CardContent>
          <TopToolsChart data={TOP_TOOLS} agents={AGENTS} />
        </CardContent>
      </CollapsibleCard>
    ),
    policy: (
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <CollapsibleCard title="Policy builder" meta="No-code rules">
          <PolicyBuilder templates={POLICY_TEMPLATES} />
        </CollapsibleCard>
        <CollapsibleCard
          title="SIEM & integrations"
          meta="Stream to your stack"
        >
          <SiemIntegrations connectors={SIEM_CONNECTORS} />
        </CollapsibleCard>
      </div>
    ),
    healing: (
      <CollapsibleCard
        title="Adaptive self-healing"
        meta="Contain → patch → sandbox validate → human approve → deploy"
      >
        <SelfHealing incidents={SELF_HEALING_INCIDENTS} />
      </CollapsibleCard>
    ),
  };

  return <DemoShell metrics={METRICS} sections={sections} />;
}
