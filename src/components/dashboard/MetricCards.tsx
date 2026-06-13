import {
  Activity,
  Bot,
  Crown,
  EyeOff,
  KeyRound,
  ShieldAlert,
  UserX,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Tone = "default" | "danger" | "warn" | "info" | "accent";

const tones: Record<Tone, string> = {
  default: "text-fg-muted",
  danger: "text-danger",
  warn: "text-warn",
  info: "text-info",
  accent: "text-accent",
};

function Card({
  label,
  value,
  trend,
  icon: Icon,
  href,
  tone = "default",
  emphasis = false,
}: {
  label: string;
  value: string | number;
  trend?: string;
  icon: typeof Bot;
  href?: string;
  tone?: Tone;
  emphasis?: boolean;
}) {
  const className = cn(
    "border border-accent/15 bg-bg/40 p-4 flex flex-col gap-2 relative overflow-hidden backdrop-blur-sm transition-colors",
    href && "hover:border-accent/55 hover:bg-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
    emphasis &&
      "border-warn/35 bg-[linear-gradient(180deg,rgba(240,178,74,0.08),transparent_55%)]",
  );

  const content = (
    <>
      <div className="flex items-start justify-between">
        <span className="mono text-[10px] uppercase tracking-[0.18em] text-fg-muted">
          {label}
        </span>
        <Icon size={14} className={cn("opacity-80", tones[tone])} />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold tracking-tight tabular-nums">
          {value}
        </span>
        {trend && (
          <span className={cn("text-[11px] font-medium", tones[tone])}>
            {trend}
          </span>
        )}
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className} aria-label={`View ${label}`}>
        {content}
      </Link>
    );
  }

  return (
    <div className={className}>
      {content}
    </div>
  );
}

export default function MetricCards({
  metrics,
}: {
  metrics: {
    total: number;
    active: number;
    unknownOwner: number;
    highRisk: number;
    adminAccess: number;
    prodCreds: number;
    shadow: number;
    shadowTrend: number;
  };
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-7 gap-3">
      <Card
        label="Total agents"
        value={metrics.total}
        icon={Bot}
        href="/agents"
      />
      <Card
        label="Active"
        value={metrics.active}
        icon={Activity}
        tone="accent"
        href="/agents?status=active"
      />
      <Card
        label="Unknown owner"
        value={metrics.unknownOwner}
        icon={UserX}
        tone="warn"
        href="/agents?owner=unknown"
      />
      <Card
        label="High risk"
        value={metrics.highRisk}
        icon={ShieldAlert}
        tone="danger"
        href="/agents?risk=High"
      />
      <Card
        label="Admin access"
        value={metrics.adminAccess}
        icon={Crown}
        href="/agents?admin=true"
      />
      <Card
        label="Prod credentials"
        value={metrics.prodCreds}
        icon={KeyRound}
        tone="info"
        href="/agents?prodCreds=true"
      />
      <Card
        label="Shadow agents"
        value={metrics.shadow}
        trend={`+${metrics.shadowTrend} this week`}
        icon={EyeOff}
        tone="warn"
        emphasis
        href="/agents?shadow=true"
      />
    </div>
  );
}
