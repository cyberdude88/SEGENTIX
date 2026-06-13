import {
  Activity,
  Bot,
  Crown,
  EyeOff,
  KeyRound,
  ShieldAlert,
  UserX,
} from "lucide-react";
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
  tone = "default",
  emphasis = false,
}: {
  label: string;
  value: string | number;
  trend?: string;
  icon: typeof Bot;
  tone?: Tone;
  emphasis?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl bg-bg-card border [border-width:0.5px] border-line p-4 flex flex-col gap-2 relative overflow-hidden",
        emphasis &&
          "border-warn/30 bg-[linear-gradient(180deg,rgba(239,159,39,0.06),transparent_55%)]",
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-[11px] text-fg-muted">{label}</span>
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
      <Card label="Total agents" value={metrics.total} icon={Bot} />
      <Card
        label="Active"
        value={metrics.active}
        icon={Activity}
        tone="accent"
      />
      <Card
        label="Unknown owner"
        value={metrics.unknownOwner}
        icon={UserX}
        tone="warn"
      />
      <Card
        label="High risk"
        value={metrics.highRisk}
        icon={ShieldAlert}
        tone="danger"
      />
      <Card label="Admin access" value={metrics.adminAccess} icon={Crown} />
      <Card
        label="Prod credentials"
        value={metrics.prodCreds}
        icon={KeyRound}
        tone="info"
      />
      <Card
        label="Shadow agents"
        value={metrics.shadow}
        trend={`+${metrics.shadowTrend} this week`}
        icon={EyeOff}
        tone="warn"
        emphasis
      />
    </div>
  );
}
